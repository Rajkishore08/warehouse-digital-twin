// Warehouse Navigation Graph
import { WAREHOUSE_CONFIG } from '../data/warehouseConfig';

export class WarehouseGraph {
  constructor() {
    this.nodes = new Map(); // id -> { id, x, z, type, aisleId, name }
    this.edges = [];        // [ { from, to, weight, aisleId, isBlocked, congestionCost } ]
    this.adjacency = new Map(); // id -> [ { target, weight, aisleId, edgeRef } ]
    this.buildGraph();
  }

  addNode(id, x, z, type = 'waypoint', aisleId = null, name = id) {
    const node = { id, x, z, type, aisleId, name };
    this.nodes.set(id, node);
    if (!this.adjacency.has(id)) {
      this.adjacency.set(id, []);
    }
    return node;
  }

  addEdge(fromId, toId, aisleId = null, bidirectional = true) {
    const fromNode = this.nodes.get(fromId);
    const toNode = this.nodes.get(toId);
    if (!fromNode || !toNode) {
      console.warn(`Cannot add edge: node not found ${fromId} -> ${toId}`);
      return;
    }

    const dx = toNode.x - fromNode.x;
    const dz = toNode.z - fromNode.z;
    const baseWeight = Math.sqrt(dx * dx + dz * dz);

    const edgeObj = {
      from: fromId,
      to: toId,
      baseWeight,
      weight: baseWeight,
      aisleId: aisleId || fromNode.aisleId || toNode.aisleId,
      isBlocked: false,
      congestionCost: 0,
      safetyCost: 0
    };

    this.edges.push(edgeObj);
    this.adjacency.get(fromId).push({
      target: toId,
      baseWeight,
      aisleId: edgeObj.aisleId,
      edgeRef: edgeObj
    });

    if (bidirectional) {
      const returnEdgeObj = {
        from: toId,
        to: fromId,
        baseWeight,
        weight: baseWeight,
        aisleId: aisleId || toNode.aisleId || fromNode.aisleId,
        isBlocked: false,
        congestionCost: 0,
        safetyCost: 0
      };
      this.edges.push(returnEdgeObj);
      this.adjacency.get(toId).push({
        target: fromId,
        baseWeight,
        aisleId: returnEdgeObj.aisleId,
        edgeRef: returnEdgeObj
      });
    }
  }

  buildGraph() {
    // 1. Build Aisle Nodes for Aisles 1 to 8
    WAREHOUSE_CONFIG.aisles.forEach((aisle, idx) => {
      const i = idx + 1;
      const x = aisle.x;

      const nNorth = `N_A${i}_NORTH`;
      const nNEntry = `N_A${i}_N_ENTRY`;
      const nMid = `N_A${i}_MID`;
      const nSEntry = `N_A${i}_S_ENTRY`;
      const nSouth = `N_A${i}_SOUTH`;

      this.addNode(nNorth, x, -18, 'junction', aisle.id, `Aisle ${i} North`);
      this.addNode(nNEntry, x, -10, 'aisle_node', aisle.id, `Aisle ${i} Rack N`);
      this.addNode(nMid, x, 0, 'crossover', aisle.id, `Aisle ${i} Mid Cross`);
      this.addNode(nSEntry, x, 10, 'aisle_node', aisle.id, `Aisle ${i} Rack S`);
      this.addNode(nSouth, x, 18, 'junction', aisle.id, `Aisle ${i} South`);

      // Aisle internal longitudinal paths
      this.addEdge(nNorth, nNEntry, aisle.id);
      this.addEdge(nNEntry, nMid, aisle.id);
      this.addEdge(nMid, nSEntry, aisle.id);
      this.addEdge(nSEntry, nSouth, aisle.id);
    });

    // 2. Connect North Cross-Aisle Highway (Z = -18)
    for (let i = 1; i < WAREHOUSE_CONFIG.aisles.length; i++) {
      this.addEdge(`N_A${i}_NORTH`, `N_A${i + 1}_NORTH`, 'HIGHWAY_NORTH');
    }

    // 3. Connect Middle Crossover Highway (Z = 0)
    for (let i = 1; i < WAREHOUSE_CONFIG.aisles.length; i++) {
      this.addEdge(`N_A${i}_MID`, `N_A${i + 1}_MID`, 'HIGHWAY_MID');
    }

    // 4. Connect South Cross-Aisle Highway (Z = 18)
    for (let i = 1; i < WAREHOUSE_CONFIG.aisles.length; i++) {
      this.addEdge(`N_A${i}_SOUTH`, `N_A${i + 1}_SOUTH`, 'HIGHWAY_SOUTH');
    }

    // 5. Inbound Receiving Docks (Z = -22)
    WAREHOUSE_CONFIG.zones.receiving.stations.forEach(st => {
      const nodeId = `N_${st.id}`;
      this.addNode(nodeId, st.x, st.z, 'dock', 'RECEIVING', st.name);
      
      // Connect to nearest North highway nodes
      let nearestNorth = 'N_A1_NORTH';
      let minDist = 999;
      WAREHOUSE_CONFIG.aisles.forEach((a, idx) => {
        const d = Math.abs(a.x - st.x);
        if (d < minDist) {
          minDist = d;
          nearestNorth = `N_A${idx + 1}_NORTH`;
        }
      });
      this.addEdge(nodeId, nearestNorth, 'RECEIVING_FEEDER');
    });

    // 6. Packing Stations (Z = 21)
    WAREHOUSE_CONFIG.zones.packing.stations.forEach(st => {
      const nodeId = `N_${st.id}`;
      this.addNode(nodeId, st.x, st.z, 'packing', 'PACKING', st.name);

      let nearestSouth = 'N_A1_SOUTH';
      let minDist = 999;
      WAREHOUSE_CONFIG.aisles.forEach((a, idx) => {
        const d = Math.abs(a.x - st.x);
        if (d < minDist) {
          minDist = d;
          nearestSouth = `N_A${idx + 1}_SOUTH`;
        }
      });
      this.addEdge(nodeId, nearestSouth, 'PACKING_FEEDER');
    });

    // 7. Dispatch Bays (Z = 22)
    WAREHOUSE_CONFIG.zones.dispatch.stations.forEach(st => {
      const nodeId = `N_${st.id}`;
      this.addNode(nodeId, st.x, st.z, 'dispatch', 'DISPATCH', st.name);

      let nearestSouth = 'N_A8_SOUTH';
      let minDist = 999;
      WAREHOUSE_CONFIG.aisles.forEach((a, idx) => {
        const d = Math.abs(a.x - st.x);
        if (d < minDist) {
          minDist = d;
          nearestSouth = `N_A${idx + 1}_SOUTH`;
        }
      });
      this.addEdge(nodeId, nearestSouth, 'DISPATCH_FEEDER');
    });

    // 8. Charging Hub (X = -29, with access spine at X = -25)
    this.addNode('N_CHG_HUB_N', -25, -18, 'charging_feeder', 'CHARGING', 'Charge Spine North');
    this.addNode('N_CHG_HUB_M', -25, 0,   'charging_feeder', 'CHARGING', 'Charge Spine Mid');
    this.addNode('N_CHG_HUB_S', -25, 18,  'charging_feeder', 'CHARGING', 'Charge Spine South');

    this.addEdge('N_A1_NORTH', 'N_CHG_HUB_N', 'CHARGING_ACCESS');
    this.addEdge('N_A1_MID',   'N_CHG_HUB_M', 'CHARGING_ACCESS');
    this.addEdge('N_A1_SOUTH', 'N_CHG_HUB_S', 'CHARGING_ACCESS');
    this.addEdge('N_CHG_HUB_N', 'N_CHG_HUB_M', 'CHARGING_SPINE');
    this.addEdge('N_CHG_HUB_M', 'N_CHG_HUB_S', 'CHARGING_SPINE');

    WAREHOUSE_CONFIG.zones.charging.stations.forEach(st => {
      const nodeId = `N_${st.id}`;
      this.addNode(nodeId, st.x, st.z, 'charging_pad', 'CHARGING', st.name);
      
      // Charging station access link to charging spine
      const intermediateSpineNode = `N_SPINE_${st.id}`;
      this.addNode(intermediateSpineNode, -25, st.z, 'charging_feeder', 'CHARGING');
      this.addEdge(intermediateSpineNode, nodeId, 'CHARGING_BAY_LINK');
      this.addEdge('N_CHG_HUB_M', intermediateSpineNode, 'CHARGING_SPINE');
    });
  }

  setAisleBlocked(aisleId, isBlocked) {
    this.edges.forEach(edge => {
      if (edge.aisleId === aisleId) {
        edge.isBlocked = isBlocked;
      }
    });
  }

  updateEdgeCongestionCost(aisleId, congestionFactor) {
    // congestionFactor: 0.0 to 1.0 (or higher if heavy gridlock)
    this.edges.forEach(edge => {
      if (edge.aisleId === aisleId) {
        // High congestion penalty increases virtual traversal length significantly
        edge.congestionCost = edge.baseWeight * (congestionFactor * 15.0);
      }
    });
  }

  resetCongestionCosts() {
    this.edges.forEach(edge => {
      edge.congestionCost = 0;
    });
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  getAllEdges() {
    return this.edges;
  }
}

export const warehouseGraphInstance = new WarehouseGraph();

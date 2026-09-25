// A* Pathfinding Engine with Dynamic Multi-Criteria Cost Evaluation

/**
 * Calculates Euclidean heuristic distance between two nodes
 */
function heuristic(nodeA, nodeB) {
  const dx = nodeA.x - nodeB.x;
  const dz = nodeA.z - nodeB.z;
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Dynamic A* Search Algorithm
 * @param {WarehouseGraph} graph 
 * @param {string} startNodeId 
 * @param {string} targetNodeId 
 * @param {Object} options - { avoidAisles: [], avoidEdges: [], batteryLevel: 100, costWeights: {} }
 * @returns {Array<{ id: string, x: number, z: number, name: string }>} Path node list
 */
export function findPathAStar(graph, startNodeId, targetNodeId, options = {}) {
  const startNode = graph.getNode(startNodeId);
  const targetNode = graph.getNode(targetNodeId);

  if (!startNode || !targetNode) {
    console.warn(`Pathfinding error: Start (${startNodeId}) or Target (${targetNodeId}) not in graph`);
    return [];
  }

  if (startNodeId === targetNodeId) {
    return [startNode];
  }

  const avoidAisles = new Set(options.avoidAisles || []);
  const extraAvoidNodes = new Set(options.avoidNodes || []);

  const openSet = new Set([startNodeId]);
  const cameFrom = new Map(); // nodeId -> { prevNodeId, edge }

  const gScore = new Map(); // nodeId -> cost from start
  const fScore = new Map(); // nodeId -> estimated total cost

  graph.nodes.forEach((_, id) => {
    gScore.set(id, Infinity);
    fScore.set(id, Infinity);
  });

  gScore.set(startNodeId, 0);
  fScore.set(startNodeId, heuristic(startNode, targetNode));

  while (openSet.size > 0) {
    // Pick node in openSet with lowest fScore
    let currentId = null;
    let lowestF = Infinity;
    for (const nodeId of openSet) {
      const f = fScore.get(nodeId);
      if (f < lowestF) {
        lowestF = f;
        currentId = nodeId;
      }
    }

    if (currentId === targetNodeId) {
      // Reconstruct path
      const path = [];
      let curr = targetNodeId;
      while (curr) {
        path.unshift(graph.getNode(curr));
        const prev = cameFrom.get(curr);
        curr = prev ? prev.prevNodeId : null;
      }
      return path;
    }

    openSet.delete(currentId);
    const currentNode = graph.getNode(currentId);
    const neighbors = graph.adjacency.get(currentId) || [];

    for (const neighbor of neighbors) {
      const neighborId = neighbor.target;
      const neighborNode = graph.getNode(neighborId);
      const edge = neighbor.edgeRef;

      // 1. Hard Constraints: Blocked edge or intentionally avoided node
      if (edge && edge.isBlocked) continue;
      
      // If edge is in an avoided aisle, only skip if the robot didn't start in it or isn't aiming to reach the destination in it
      if (avoidAisles.has(edge.aisleId)) {
        const isCurrentAisleExit = startNode.aisleId === edge.aisleId;
        const isDestinationAisle = targetNode.aisleId === edge.aisleId;
        if (!isCurrentAisleExit && !isDestinationAisle) {
          continue;
        }
      }
      if (extraAvoidNodes.has(neighborId) && neighborId !== targetNodeId) continue;

      // 2. Dynamic Cost Calculation:
      // Cost = Base Distance + Congestion Cost + Safety Cost + Avoidance Penalty
      const avoidancePenalty = avoidAisles.has(edge.aisleId) ? 80 : 0;
      const traversalWeight = neighbor.baseWeight + (edge.congestionCost || 0) + (edge.safetyCost || 0) + avoidancePenalty;
      const tentativeGScore = gScore.get(currentId) + traversalWeight;

      if (tentativeGScore < gScore.get(neighborId)) {
        cameFrom.set(neighborId, { prevNodeId: currentId, edge });
        gScore.set(neighborId, tentativeGScore);
        const h = heuristic(neighborNode, targetNode);
        fScore.set(neighborId, tentativeGScore + h);

        if (!openSet.has(neighborId)) {
          openSet.add(neighborId);
        }
      }
    }
  }

  // Fallback: If no path found under constraints, retry with softened avoidances
  if (avoidAisles.size > 0) {
    return findPathAStar(graph, startNodeId, targetNodeId, { ...options, avoidAisles: [] });
  }

  return [];
}

/**
 * Calculates total path physical length in meters
 */
export function calculatePathLength(path) {
  if (!path || path.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const dx = path[i + 1].x - path[i].x;
    const dz = path[i + 1].z - path[i].z;
    total += Math.sqrt(dx * dx + dz * dz);
  }
  return total;
}

// Central Simulation Store using Zustand
import { create } from 'zustand';
import { INITIAL_ROBOTS, ROBOT_TYPES } from '../data/robotConfig';
import { WAREHOUSE_CONFIG } from '../data/warehouseConfig';
import { INVENTORY_CATALOG } from '../data/taskConfig';
import { warehouseGraphInstance } from '../simulation/warehouseGraph';
import { trafficEngineInstance } from '../simulation/trafficEngine';
import { routeOptimizerInstance } from '../simulation/routeOptimizer';
import { predictiveEngineInstance } from '../simulation/predictiveEngine';
import { findPathAStar, calculatePathLength } from '../utils/pathfinding';

// Realistic Box colors & helper for pick/drop task generation
const BOX_COLORS = ['#d4a373', '#c68b59', '#1d3557', '#457b9d', '#2a9d8f', '#e76f51', '#4a5568'];
const RACK_PICK_NODES = [
  'N_A1_MID', 'N_A1_N_ENTRY', 'N_A1_S_ENTRY',
  'N_A2_MID', 'N_A2_N_ENTRY', 'N_A2_S_ENTRY',
  'N_A3_MID', 'N_A3_N_ENTRY', 'N_A3_S_ENTRY',
  'N_A4_MID', 'N_A4_N_ENTRY', 'N_A4_S_ENTRY',
  'N_A5_MID', 'N_A5_N_ENTRY', 'N_A5_S_ENTRY',
  'N_A6_MID', 'N_A6_N_ENTRY', 'N_A6_S_ENTRY',
  'N_A7_MID', 'N_A7_N_ENTRY', 'N_A7_S_ENTRY',
  'N_A8_MID', 'N_A8_N_ENTRY', 'N_A8_S_ENTRY',
  'N_DOCK_1', 'N_DOCK_2', 'N_DOCK_3'
];
const DROP_DESTINATIONS = [
  'N_PACK_A', 'N_PACK_B', 'N_PACK_C',
  'N_DISPATCH_1', 'N_DISPATCH_2', 'N_DISPATCH_3'
];

export function generateNewOrderTask(robot, currentPositionNodeId) {
  const item = INVENTORY_CATALOG[Math.floor(Math.random() * INVENTORY_CATALOG.length)];
  const isPalletType = robot.type === 'FORKLIFT' || robot.type === 'PALLET_ROBOT';
  const isSortingType = robot.type === 'SORTING_ROBOT';

  const filteredRackNodes = RACK_PICK_NODES.filter(n => n !== currentPositionNodeId);
  const sourceNode = filteredRackNodes[Math.floor(Math.random() * filteredRackNodes.length)] || 'N_A3_MID';

  const dropTargets = isSortingType
    ? ['N_DISPATCH_1', 'N_DISPATCH_2', 'N_DISPATCH_3']
    : (isPalletType ? ['N_PACK_A', 'N_PACK_B', 'N_DISPATCH_1', 'N_DISPATCH_2'] : DROP_DESTINATIONS);
  const targetNode = dropTargets[Math.floor(Math.random() * dropTargets.length)] || 'N_PACK_A';

  const orderNum = Math.floor(Math.random() * 8900) + 1000;
  const boxColor = BOX_COLORS[Math.floor(Math.random() * BOX_COLORS.length)];

  return {
    id: `ORD-${orderNum}`,
    title: isPalletType ? `Pallet Transfer #${orderNum}` : (isSortingType ? `Express Sort #${orderNum}` : `Order Pick #${orderNum}`),
    sku: `${item.sku} (${item.name.split(' ')[0]})`,
    skuFull: `${item.sku} - ${item.name}`,
    boxColor,
    boxType: isPalletType ? 'PALLET' : (isSortingType ? 'PARCEL' : 'BOX'),
    sourceNode,
    targetNode,
    weightKg: isPalletType ? (Math.floor(Math.random() * 500) + 250) : (Math.floor(Math.random() * 45) + 8),
    stage: 'EN_ROUTE_TO_PICK'
  };
}

export const useWarehouseStore = create((set, get) => ({
  // Core simulation controls
  isRunning: true,
  simSpeed: 1,
  emergencyStop: false,
  viewMode: 'standard', // 'standard' | 'heatmap' | 'routes' | 'inventory' | 'safety'
  lightingMode: 'night', // 'day' | 'evening' | 'night'
  showDataFlow: false,
  showRouteFlow: true,
  showPaths: false, // Digital navigation network overlay toggle

  // Camera Management
  cameraMode: 'orbit', // 'orbit' | 'follow' | 'pov'
  cameraPreset: 'overview', // 'overview' | 'top_view' | 'floor_view' | 'aisle_view' | 'packing' | 'charging' | 'receiving' | 'dispatch' | 'free'
  isCameraTransitioning: false,
  savedCameraState: null, // { position: [x, y, z], target: [x, y, z] }

  // Clean UI & Presentation Mode
  isCleanView: false,
  isPresentationMode: false,
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  bottomPanelCollapsed: false,

  // Scenario Mode
  scenarioMode: 'normal', // 'free_flow' | 'normal' | 'busy' | 'heavy' | 'extreme' | 'recovery'

  // Modals & Guided Modes
  demoMode: {
    isActive: false,
    currentStep: 1,
    totalSteps: 12,
    stepTitle: 'Normal Operations',
    stepDesc: 'Fleet moving smoothly across all sectors.'
  },
  learnModalOpen: false,
  archModalOpen: false,
  whatIfModalOpen: false,

  // Selection
  selectedRobotId: 'R01',
  selectedRackId: null,
  selectedAisleId: null,
  selectedObstacleId: null,

  // Environmental dynamic elements
  blockedAisles: new Set(),
  obstacles: [
    { id: 'OBS_01', x: 15, z: 0, type: 'PALLET_STACK', label: 'Staged Pallet' }
  ],
  chargingStations: WAREHOUSE_CONFIG.zones.charging.stations.map(st => ({
    ...st,
    status: 'available',
    currentRobotId: null
  })),

  // Traffic & AI Intelligence
  aisleMetrics: [],
  congestionZones: [],
  predictiveBottlenecks: [],
  heatmapVisible: false,
  aiDecisionLog: [],
  routeCandidateComparisons: [],
  latestAiAction: null,
  aiStatus: 'MONITORING', // 'MONITORING' | 'ANALYZING' | 'OPTIMIZING' | 'REROUTED'
  optimizationProgress: 100,

  // Alerts & Events
  alerts: [
    { id: 'ALT_INIT', type: 'info', message: 'Digital Twin simulation synchronized with 16 autonomous robot telemetry nodes.', time: '10:00:00' }
  ],
  timelineEvents: [
    { time: '10:00', label: 'Fleet Normal Operations', type: 'normal' }
  ],

  // Fleet data
  robots: [],

  // Orders and inventory
  inventory: INVENTORY_CATALOG,
  ordersQueue: [
    { id: 'ORD-9021', sku: 'SKU-7729', qty: 12, dest: 'PACK_A', priority: 'HIGH', status: 'IN_TRANSIT', robotId: 'R01' },
    { id: 'ORD-9022', sku: 'SKU-8821', qty: 2,  dest: 'PACK_B', priority: 'MEDIUM', status: 'IN_TRANSIT', robotId: 'R02' },
    { id: 'ORD-9023', sku: 'SKU-1002', qty: 4,  dest: 'PACK_C', priority: 'HIGH', status: 'IN_TRANSIT', robotId: 'R03' },
    { id: 'ORD-9024', sku: 'SKU-3320', qty: 40, dest: 'DISPATCH_1', priority: 'HIGH', status: 'IN_TRANSIT', robotId: 'R04' },
    { id: 'ORD-9025', sku: 'SKU-9921', qty: 6,  dest: 'PACK_C', priority: 'LOW', status: 'IN_TRANSIT', robotId: 'R05' },
    { id: 'ORD-9026', sku: 'SKU-4410', qty: 150, dest: 'DISPATCH_2', priority: 'MEDIUM', status: 'IN_TRANSIT', robotId: 'R06' },
  ],
  completedOrdersCount: 152,

  // Initialize Store & Paths with Realistic Pick & Drop Initial State
  initSimulation: () => {
    const graph = warehouseGraphInstance;
    const initialRobots = INITIAL_ROBOTS.map((r, idx) => {
      const isCharging = r.status === 'charging';
      const hasInitialBox = !isCharging && (idx % 2 === 0);
      const initialTask = generateNewOrderTask(r, r.startNode);
      initialTask.stage = hasInitialBox ? 'EN_ROUTE_TO_DROP' : 'EN_ROUTE_TO_PICK';
      const targetNodeId = hasInitialBox ? initialTask.targetNode : initialTask.sourceNode;
      const startNodeId = r.startNode || 'N_A1_NORTH';
      const path = findPathAStar(graph, startNodeId, targetNodeId);

      return {
        ...r,
        hasBox: hasInitialBox,
        actionTimer: 0,
        liftProgress: hasInitialBox ? 1.0 : 0.0,
        dropProgress: 0.0,
        task: initialTask,
        load: hasInitialBox ? (initialTask.weightKg || 35) : 0,
        path: path.length > 0 ? path : [graph.getNode(startNodeId)],
        oldPath: null,
        currentWaypointIndex: 0,
        currentSpeed: isCharging ? 0 : r.speed,
        targetSpeed: r.speed,
        progress: 0,
        totalDistance: calculatePathLength(path),
        distanceRemaining: calculatePathLength(path),
        etaSeconds: Math.round(calculatePathLength(path) / r.speed),
        intersectionWait: false,
        stuckTime: 0
      };
    });

    set({
      robots: initialRobots,
      chargingStations: WAREHOUSE_CONFIG.zones.charging.stations.map(st => ({
        ...st,
        status: (st.id === 'CHG_01' || st.id === 'CHG_02') ? 'occupied' : 'available',
        currentRobotId: st.id === 'CHG_01' ? 'R13' : (st.id === 'CHG_02' ? 'R14' : null)
      }))
    });
  },

  // Setters
  setSimRunning: (isRunning) => set({ isRunning }),
  setSimSpeed: (simSpeed) => set({ simSpeed }),
  setViewMode: (viewMode) => set({ viewMode }),
  setLightingMode: (lightingMode) => set({ lightingMode }),
  setSelectedRobotId: (id) => set({ selectedRobotId: id }),
  setSelectedRackId: (id) => set({ selectedRackId: id }),
  setSelectedAisleId: (id) => set({ selectedAisleId: id }),
  toggleHeatmap: () => set(state => ({ heatmapVisible: !state.heatmapVisible })),
  toggleDataFlow: () => set(state => ({ showDataFlow: !state.showDataFlow })),
  togglePaths: () => set(state => ({ showPaths: !state.showPaths })),
  setLearnModalOpen: (learnModalOpen) => set({ learnModalOpen }),
  setArchModalOpen: (archModalOpen) => set({ archModalOpen }),
  setWhatIfModalOpen: (whatIfModalOpen) => set({ whatIfModalOpen }),

  // UI Panels Collapse & Clean View
  toggleLeftPanel: () => set(state => ({ leftPanelCollapsed: !state.leftPanelCollapsed })),
  toggleRightPanel: () => set(state => ({ rightPanelCollapsed: !state.rightPanelCollapsed })),
  toggleBottomPanel: () => set(state => ({ bottomPanelCollapsed: !state.bottomPanelCollapsed })),
  toggleCleanView: () => set(state => ({
    isCleanView: !state.isCleanView,
    leftPanelCollapsed: !state.isCleanView,
    rightPanelCollapsed: !state.isCleanView,
    bottomPanelCollapsed: !state.isCleanView
  })),
  togglePresentationMode: () => set(state => ({
    isPresentationMode: !state.isPresentationMode,
    isCleanView: !state.isPresentationMode,
    leftPanelCollapsed: !state.isPresentationMode,
    rightPanelCollapsed: !state.isPresentationMode,
    bottomPanelCollapsed: !state.isPresentationMode
  })),

  // Camera Management
  setCameraPreset: (preset) => {
    set({
      cameraPreset: preset,
      cameraMode: 'orbit',
      isCameraTransitioning: true
    });
  },

  setUserCameraFree: () => {
    set({ cameraPreset: 'free', isCameraTransitioning: false });
  },

  enterRobotFollow: (robotId) => {
    const currentRobot = robotId || get().selectedRobotId;
    set({
      selectedRobotId: currentRobot,
      cameraMode: 'follow',
      cameraPreset: 'follow_robot',
      isCameraTransitioning: true
    });
  },

  enterRobotPov: (robotId) => {
    const currentRobot = robotId || get().selectedRobotId;
    set({
      selectedRobotId: currentRobot,
      cameraMode: 'pov',
      cameraPreset: 'robot_pov',
      isCameraTransitioning: true
    });
  },

  exitRobotCam: () => {
    set({
      cameraMode: 'orbit',
      cameraPreset: 'overview',
      isCameraTransitioning: true
    });
  },

  // 12-Step Interactive Demo Mode
  startDemoMode: () => {
    set({
      demoMode: {
        isActive: true,
        currentStep: 1,
        totalSteps: 12,
        stepTitle: 'Step 1: Normal Operations',
        stepDesc: 'Fleet of 16 autonomous robots navigating assigned picking and transit routes with zero congestion.'
      }
    });
    get().setDemoStep(1);
  },

  setDemoStep: (stepNumber) => {
    const graph = warehouseGraphInstance;
    const state = get();

    switch (stepNumber) {
      case 1:
        state.runFreeFlow();
        set({
          cameraPreset: 'overview',
          isCameraTransitioning: true,
          demoMode: {
            isActive: true,
            currentStep: 1,
            totalSteps: 12,
            stepTitle: 'Step 1: Free-Flow Baseline',
            stepDesc: 'Ideal warehouse state: low density, high average speed, zero congestion, clear aisles.'
          }
        });
        break;

      case 2:
        state.addRobots(6);
        set({
          demoMode: {
            isActive: true,
            currentStep: 2,
            totalSteps: 12,
            stepTitle: 'Step 2: Fleet Workload Increase',
            stepDesc: 'WMS receives inbound wave. Fleet active robot count increases to 22 units.'
          }
        });
        break;

      case 3:
        set({
          cameraPreset: 'aisle_view',
          isCameraTransitioning: true,
          demoMode: {
            isActive: true,
            currentStep: 3,
            totalSteps: 12,
            stepTitle: 'Step 3: Traffic Density Rising',
            stepDesc: 'Robots converging toward central storage sector (Aisle 5). Speed begins decaying.'
          }
        });
        break;

      case 4:
        state.runHeavyCongestion();
        set({
          cameraPreset: 'congestion',
          isCameraTransitioning: true,
          demoMode: {
            isActive: true,
            currentStep: 4,
            totalSteps: 12,
            stepTitle: 'Step 4: Severe Congestion in Aisle 5',
            stepDesc: 'Traffic density hits 94%. Queue length: 8+ units. Average speed drops to 0.28 m/s. Red alert zone active.'
          }
        });
        break;

      case 5:
        set({
          cameraPreset: 'top_view',
          isCameraTransitioning: true,
          aiStatus: 'OPTIMIZING',
          optimizationProgress: 50,
          demoMode: {
            isActive: true,
            currentStep: 5,
            totalSteps: 12,
            stepTitle: 'Step 5: Global AI Analysis',
            stepDesc: 'AI analyzes entire fleet topology, evaluating network-wide corridor density and parallel capacities.'
          }
        });
        break;

      case 6:
        set({
          aiStatus: 'OPTIMIZING',
          optimizationProgress: 85,
          demoMode: {
            isActive: true,
            currentStep: 6,
            totalSteps: 12,
            stepTitle: 'Step 6: Multi-Path Calculation',
            stepDesc: 'AI calculates 4 alternative non-conflicting corridors across Aisles 4, 6, 7, and 8.'
          }
        });
        break;

      case 7:
        state.triggerAiOptimization();
        set({
          demoMode: {
            isActive: true,
            currentStep: 7,
            totalSteps: 12,
            stepTitle: 'Step 7: Dynamic Multi-Robot Rerouting',
            stepDesc: 'Old paths turn dashed red. New glowing green paths deployed. Robots begin turning onto alternate corridors.'
          }
        });
        break;

      case 8:
        set({
          demoMode: {
            isActive: true,
            currentStep: 8,
            totalSteps: 12,
            stepTitle: 'Step 8: Aisle 5 Bottleneck Clears',
            stepDesc: 'Traffic dispersed evenly across parallel paths. Congestion zone count drops to 0.'
          }
        });
        break;

      case 9:
        set({
          cameraPreset: 'aisle_view',
          isCameraTransitioning: true,
          predictiveBottlenecks: [
            {
              aisleId: 'AISLE_07',
              name: 'Aisle 7',
              x: 15,
              predictedTimeSec: 30,
              confidence: '89%',
              severity: 'HIGH',
              reason: '4 robots converging on Aisle 7 in next 30s.'
            }
          ],
          demoMode: {
            isActive: true,
            currentStep: 9,
            totalSteps: 12,
            stepTitle: 'Step 9: Predictive Analytics Warning',
            stepDesc: 'Predictive Engine forecasts bottleneck in Aisle 7 in 30 seconds (89% Confidence). Amber hologram active.'
          }
        });
        break;

      case 10:
        state.triggerAiOptimization();
        set({
          predictiveBottlenecks: [],
          demoMode: {
            isActive: true,
            currentStep: 10,
            totalSteps: 12,
            stepTitle: 'Step 10: Proactive AI Rerouting',
            stepDesc: 'AI reroutes inbound robots before congestion physically forms in Aisle 7.'
          }
        });
        break;

      case 11:
        set({
          cameraPreset: 'overview',
          isCameraTransitioning: true,
          demoMode: {
            isActive: true,
            currentStep: 11,
            totalSteps: 12,
            stepTitle: 'Step 11: Free Flow Restored',
            stepDesc: 'Operations fully normalized with high throughput and continuous autonomous coordination.'
          }
        });
        break;

      case 12:
        set({
          demoMode: {
            isActive: true,
            currentStep: 12,
            totalSteps: 12,
            stepTitle: 'Step 12: Outcome Summary & KPIs',
            stepDesc: 'Delay reduced by 42s. Fleet throughput +36.8%. Zero intersection collision incidents.'
          }
        });
        break;

      default:
        break;
    }
  },

  nextDemoStep: () => {
    const current = get().demoMode.currentStep;
    if (current < 12) {
      get().setDemoStep(current + 1);
    }
  },

  prevDemoStep: () => {
    const current = get().demoMode.currentStep;
    if (current > 1) {
      get().setDemoStep(current - 1);
    }
  },

  exitDemoMode: () => {
    set({
      demoMode: {
        isActive: false,
        currentStep: 1,
        totalSteps: 12,
        stepTitle: '',
        stepDesc: ''
      }
    });
  },

  // Emergency Stop Toggle
  toggleEmergencyStop: () => {
    const nextStop = !get().emergencyStop;
    set(state => ({
      emergencyStop: nextStop,
      alerts: [
        {
          id: `ALT_EMG_${Date.now()}`,
          type: nextStop ? 'danger' : 'success',
          message: nextStop ? 'EMERGENCY STOP ACTIVATED - All robot actuators halted.' : 'Operations resumed - Safety lock cleared.',
          time: new Date().toLocaleTimeString()
        },
        ...state.alerts.slice(0, 30)
      ]
    }));
  },

  // Block / Unblock Aisle
  toggleBlockAisle: (aisleId) => {
    const blockedAisles = new Set(get().blockedAisles);
    const isNowBlocked = !blockedAisles.has(aisleId);

    if (isNowBlocked) {
      blockedAisles.add(aisleId);
    } else {
      blockedAisles.delete(aisleId);
    }

    warehouseGraphInstance.setAisleBlocked(aisleId, isNowBlocked);

    set(state => ({
      blockedAisles,
      alerts: [
        {
          id: `ALT_BLK_${Date.now()}`,
          type: isNowBlocked ? 'warning' : 'info',
          message: isNowBlocked ? `Aisle ${aisleId} BLOCKED by Safety System. Triggering dynamic reroute.` : `Aisle ${aisleId} cleared and unblocked.`,
          time: new Date().toLocaleTimeString()
        },
        ...state.alerts.slice(0, 30)
      ]
    }));

    if (isNowBlocked) {
      get().triggerAiOptimization();
    }
  },

  // Add / Remove Temporary Obstacle
  addObstacle: (x, z, type = 'PALLET_STACK') => {
    const newObs = {
      id: `OBS_${Date.now().toString().slice(-4)}`,
      x,
      z,
      type,
      label: `Obstacle @ (${x.toFixed(1)}, ${z.toFixed(1)})`
    };

    set(state => ({
      obstacles: [...state.obstacles, newObs],
      alerts: [
        {
          id: `ALT_OBS_${Date.now()}`,
          type: 'warning',
          message: `Obstacle detected at coordinates (${x.toFixed(1)}, ${z.toFixed(1)}). Updating fleet path costs.`,
          time: new Date().toLocaleTimeString()
        },
        ...state.alerts.slice(0, 30)
      ]
    }));

    get().triggerAiOptimization();
  },

  removeObstacle: (id) => {
    set(state => ({
      obstacles: state.obstacles.filter(o => o.id !== id),
      alerts: [
        {
          id: `ALT_OBS_CLR_${Date.now()}`,
          type: 'info',
          message: `Obstacle ${id} removed from warehouse floor.`,
          time: new Date().toLocaleTimeString()
        },
        ...state.alerts.slice(0, 30)
      ]
    }));
  },

  // Add Extra Robots for Stress Test
  addRobots: (count = 5) => {
    const currentRobots = get().robots;
    const types = ['AMR', 'AGV', 'FORKLIFT', 'PALLET_ROBOT', 'SORTING_ROBOT'];
    const graph = warehouseGraphInstance;
    const newRobots = [];

    for (let i = 0; i < count; i++) {
      const idx = currentRobots.length + i + 1;
      const id = `R${idx < 10 ? '0' + idx : idx}`;
      const type = types[i % types.length];
      const aisleIdx = (i % 8) + 1;
      const startNodeId = `N_A${aisleIdx}_NORTH`;
      const targetNodeId = (i % 2 === 0) ? 'N_PACK_A' : 'N_DISPATCH_2';
      const startNode = graph.getNode(startNodeId);
      const path = findPathAStar(graph, startNodeId, targetNodeId);

      newRobots.push({
        id,
        name: `FleetBot-${idx}`,
        type,
        startNode: startNodeId,
        x: startNode ? startNode.x : 0,
        z: startNode ? startNode.z : -18,
        rotation: 0,
        battery: Math.floor(65 + Math.random() * 30),
        speed: ROBOT_TYPES[type].maxSpeed,
        currentSpeed: ROBOT_TYPES[type].maxSpeed,
        targetSpeed: ROBOT_TYPES[type].maxSpeed,
        status: 'moving',
        task: {
          id: `TASK_DYN_${idx}`,
          title: `Dynamic Order #${1000 + idx}`,
          sku: `SKU-${7000 + idx}`,
          sourceNode: startNodeId,
          targetNode: targetNodeId,
          stage: 'TRANSIT'
        },
        load: Math.floor(Math.random() * 120) + 10,
        path: path.length > 0 ? path : [startNode],
        oldPath: null,
        currentWaypointIndex: 0,
        progress: 0,
        totalDistance: calculatePathLength(path),
        distanceRemaining: calculatePathLength(path),
        etaSeconds: Math.round(calculatePathLength(path) / ROBOT_TYPES[type].maxSpeed),
        intersectionWait: false
      });
    }

    set(state => ({
      robots: [...state.robots, ...newRobots],
      alerts: [
        {
          id: `ALT_FLEET_${Date.now()}`,
          type: 'info',
          message: `Spawned +${count} autonomous robots into active fleet (Total: ${currentRobots.length + count}).`,
          time: new Date().toLocaleTimeString()
        },
        ...state.alerts.slice(0, 30)
      ]
    }));
  },

  // Scenarios: Free Flow, Heavy Congestion, Extreme Recovery
  runFreeFlow: () => {
    const graph = warehouseGraphInstance;
    const freeRobots = INITIAL_ROBOTS.slice(0, 10).map((r, i) => {
      const aisleIdx = (i % 8) + 1;
      const startNode = `N_A${aisleIdx}_NORTH`;
      const targetNode = (i % 3 === 0) ? 'N_PACK_A' : (i % 3 === 1 ? 'N_PACK_B' : 'N_DISPATCH_1');
      const path = findPathAStar(graph, startNode, targetNode);
      return {
        ...r,
        path,
        oldPath: null,
        currentWaypointIndex: 0,
        currentSpeed: r.speed,
        status: 'moving',
        battery: 92 - (i * 2)
      };
    });

    set({
      scenarioMode: 'free_flow',
      robots: freeRobots,
      congestionZones: [],
      predictiveBottlenecks: [],
      alerts: [
        { id: `ALT_FF_${Date.now()}`, type: 'success', message: 'FREE FLOW MODE: Optimal fleet balance, zero bottlenecks.', time: new Date().toLocaleTimeString() }
      ]
    });
  },

  runHeavyCongestion: () => {
    const graph = warehouseGraphInstance;
    const state = get();

    // Direct 10 robots into Aisle 5 forming a clean high-density single-direction queue
    const queuedRobots = state.robots.map((r, i) => {
      if (['R01', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07', 'R08', 'R09', 'R10'].includes(r.id)) {
        // Stagger positions from North (z = -16) to South (z = 8)
        const zPos = -16 + (i * 2.4);
        const fullAislePath = [
          { id: 'N_A5_NORTH', x: 3, z: -18, aisleId: 'AISLE_05' },
          { id: 'N_A5_N_ENTRY', x: 3, z: -10, aisleId: 'AISLE_05' },
          { id: 'N_A5_MID', x: 3, z: 0, aisleId: 'AISLE_05' },
          { id: 'N_A5_S_ENTRY', x: 3, z: 10, aisleId: 'AISLE_05' },
          { id: 'N_A5_SOUTH', x: 3, z: 18, aisleId: 'AISLE_05' },
          { id: 'N_PACK_A', x: -18, z: 21, aisleId: 'PACKING' }
        ];

        let wpIndex = 0;
        for (let w = 0; w < fullAislePath.length; w++) {
          if (fullAislePath[w].z > zPos) {
            wpIndex = w;
            break;
          }
        }

        return {
          ...r,
          x: 3,
          z: zPos,
          rotation: Math.PI,
          currentSpeed: 0.35,
          status: 'moving',
          path: fullAislePath,
          oldPath: null,
          currentWaypointIndex: wpIndex,
          stuckTime: 0
        };
      }
      return r;
    });

    set({
      scenarioMode: 'extreme',
      robots: queuedRobots,
      cameraPreset: 'congestion',
      isCameraTransitioning: true,
      selectedAisleId: 'AISLE_05',
      aiStatus: 'ANALYZING',
      alerts: [
        {
          id: `ALT_EXT_${Date.now()}`,
          type: 'danger',
          message: 'CRITICAL CONGESTION: Aisle 5 density at 94%. 10+ robots queueing.',
          time: new Date().toLocaleTimeString()
        },
        ...state.alerts.slice(0, 30)
      ]
    });
  },

  runExtremeRecovery: () => {
    get().runHeavyCongestion();
    setTimeout(() => {
      get().triggerAiOptimization();
    }, 3200);
  },

  // Main Demonstration Scenario
  runCongestionDemo: () => {
    get().runHeavyCongestion();
    setTimeout(() => {
      get().triggerAiOptimization();
    }, 2800);
  },

  // Trigger Simulated AI Route Optimization
  triggerAiOptimization: () => {
    const { robots, congestionZones, blockedAisles, predictiveBottlenecks } = get();
    set({ aiStatus: 'OPTIMIZING', optimizationProgress: 60 });

    const result = routeOptimizerInstance.optimizeFleetRoutes(
      warehouseGraphInstance,
      robots,
      congestionZones,
      blockedAisles,
      predictiveBottlenecks
    );

    const timeStr = new Date().toLocaleTimeString();

    set(state => ({
      robots: result.updatedRobots,
      aiDecisionLog: [...result.decisionLog, ...state.aiDecisionLog].slice(0, 40),
      routeCandidateComparisons: result.routeCandidateComparisons || state.routeCandidateComparisons,
      latestAiAction: {
        timestamp: timeStr,
        reroutedCount: result.reroutedCount,
        metrics: result.metrics,
        decisions: result.decisionLog
      },
      aiStatus: 'REROUTED',
      optimizationProgress: 100,
      alerts: [
        {
          id: `ALT_AI_${Date.now()}`,
          type: 'success',
          message: `AI Rerouting Complete: ${result.reroutedCount} robots dynamically reassigned to clear paths.`,
          time: timeStr
        },
        ...state.alerts.slice(0, 30)
      ],
      timelineEvents: [
        { time: timeStr.slice(0, 5), label: `AI Rerouted ${result.reroutedCount} Robots`, type: 'ai' },
        ...state.timelineEvents.slice(0, 10)
      ]
    }));

    setTimeout(() => {
      set({ aiStatus: 'MONITORING' });
    }, 4000);
  },

  // Main Simulation Step (60 FPS Kinematics, Non-Locking Distance Spacing & Anti-Deadlock)
  tick: (delta) => {
    const state = get();
    if (!state.isRunning || state.emergencyStop) return;

    const effectiveDelta = Math.min(delta, 0.1) * state.simSpeed;
    const graph = warehouseGraphInstance;
    const blockedAisles = state.blockedAisles;
    let completedOrdersIncrement = 0;
    const newAlerts = [];

    const updatedRobots = state.robots.map((robot, rIdx) => {
      // 1. If robot is charging
      if (robot.status === 'charging') {
        const newBattery = Math.min(100, robot.battery + (ROBOT_TYPES[robot.type].chargeRate * effectiveDelta * 4));
        if (newBattery >= 99 && robot.battery < 99) {
          const nextTask = generateNewOrderTask(robot, 'N_CHG_HUB_M');
          const newPath = findPathAStar(graph, 'N_CHG_HUB_M', nextTask.sourceNode);
          return {
            ...robot,
            battery: 100,
            status: 'moving',
            hasBox: false,
            load: 0,
            task: nextTask,
            path: newPath.length > 0 ? newPath : robot.path,
            currentWaypointIndex: 0,
            stuckTime: 0
          };
        }
        return { ...robot, battery: newBattery };
      }

      // 2. If robot is performing a PICKING operation at the rack
      if (robot.status === 'picking') {
        const remainingTimer = (robot.actionTimer || 2.2) - effectiveDelta;
        const liftProgress = Math.min(1.0, Math.max(0, 1.0 - (remainingTimer / 2.2)));

        if (remainingTimer <= 0) {
          // Pick completed! Box is now loaded on the robot
          const targetNode = robot.task?.targetNode || 'N_PACK_A';
          const currentNode = robot.task?.sourceNode || 'N_A3_MID';
          const newPath = findPathAStar(graph, currentNode, targetNode);
          const cargoLoad = robot.task?.weightKg || (robot.type === 'FORKLIFT' ? 650 : (robot.type === 'PALLET_ROBOT' ? 450 : 35));

          newAlerts.push({
            id: `ALT_PICK_${Date.now()}_${robot.id}`,
            type: 'info',
            message: `📦 [${robot.id} ${robot.name}] Loaded ${robot.task?.sku || 'Cargo'} from Rack. En route to ${targetNode.replace('N_', '')}.`,
            time: new Date().toLocaleTimeString()
          });

          return {
            ...robot,
            status: 'moving',
            hasBox: true,
            load: cargoLoad,
            actionTimer: 0,
            liftProgress: 1.0,
            dropProgress: 0.0,
            task: {
              ...robot.task,
              stage: 'EN_ROUTE_TO_DROP'
            },
            path: newPath.length > 0 ? newPath : robot.path,
            currentWaypointIndex: 0,
            totalDistance: calculatePathLength(newPath),
            distanceRemaining: calculatePathLength(newPath),
            etaSeconds: Math.round(calculatePathLength(newPath) / robot.speed),
            currentSpeed: 0.4,
            stuckTime: 0
          };
        }

        return {
          ...robot,
          actionTimer: remainingTimer,
          liftProgress,
          currentSpeed: 0
        };
      }

      // 3. If robot is performing a DROPPING / UNLOAD operation at the packing station or dispatch
      if (robot.status === 'dropping') {
        const remainingTimer = (robot.actionTimer || 2.2) - effectiveDelta;
        const dropProgress = Math.min(1.0, Math.max(0, 1.0 - (remainingTimer / 2.2)));

        if (remainingTimer <= 0) {
          // Drop completed! Unloaded to conveyor/buffer, generate next order
          completedOrdersIncrement++;
          const lastTargetNode = robot.task?.targetNode || 'N_PACK_A';
          const newTask = generateNewOrderTask(robot, lastTargetNode);
          const newPath = findPathAStar(graph, lastTargetNode, newTask.sourceNode);

          newAlerts.push({
            id: `ALT_DROP_${Date.now()}_${robot.id}`,
            type: 'success',
            message: `✅ [${robot.id} ${robot.name}] Delivered ${robot.task?.sku || 'Cargo'} to ${lastTargetNode.replace('N_', '')}. Order completed!`,
            time: new Date().toLocaleTimeString()
          });

          return {
            ...robot,
            status: 'moving',
            hasBox: false,
            load: 0,
            actionTimer: 0,
            liftProgress: 0.0,
            dropProgress: 0.0,
            task: newTask,
            path: newPath.length > 0 ? newPath : robot.path,
            currentWaypointIndex: 0,
            totalDistance: calculatePathLength(newPath),
            distanceRemaining: calculatePathLength(newPath),
            etaSeconds: Math.round(calculatePathLength(newPath) / robot.speed),
            currentSpeed: 0.4,
            stuckTime: 0
          };
        }

        return {
          ...robot,
          actionTimer: remainingTimer,
          dropProgress,
          currentSpeed: 0
        };
      }

      // Battery consumption during movement
      const batteryDrain = (ROBOT_TYPES[robot.type].batteryDrainRate * effectiveDelta * ((robot.currentSpeed || 1) / robot.speed));
      const updatedBattery = Math.max(5, robot.battery - batteryDrain);

      // Path following kinematics
      const path = robot.path;
      if (!path || path.length === 0) return { ...robot, battery: updatedBattery };

      let waypointIdx = robot.currentWaypointIndex || 0;
      if (waypointIdx >= path.length) {
        const currentNodeId = path[path.length - 1]?.id || 'N_A1_NORTH';
        const isHeadingToDrop = robot.hasBox;
        const nextTarget = isHeadingToDrop 
          ? (robot.task?.targetNode || 'N_PACK_A')
          : (robot.task?.sourceNode || 'N_A3_MID');
        const newPath = findPathAStar(graph, currentNodeId, nextTarget);

        return {
          ...robot,
          battery: updatedBattery,
          status: 'moving',
          oldPath: null,
          path: newPath.length > 0 ? newPath : path,
          currentWaypointIndex: 0,
          totalDistance: calculatePathLength(newPath),
          distanceRemaining: calculatePathLength(newPath),
          etaSeconds: Math.round(calculatePathLength(newPath) / robot.speed),
          stuckTime: 0
        };
      }

      const targetWaypoint = path[waypointIdx];
      const dx = targetWaypoint.x - robot.x;
      const dz = targetWaypoint.z - robot.z;
      const dist = Math.hypot(dx, dz);

      // 1. Multi-Agent Safety & Dynamic Spacing Control
      let speedFactor = 1.0;
      let isWaitingIntersection = false;
      let repulseX = 0;
      let repulseZ = 0;

      for (let j = 0; j < state.robots.length; j++) {
        if (j === rIdx) continue;
        const other = state.robots[j];
        if (other.status === 'charging') continue;

        const odx = other.x - robot.x;
        const odz = other.z - robot.z;
        const oDist = Math.hypot(odx, odz);

        // Anti-stacking repulsive force (ensures robots NEVER lock on the same coordinate)
        if (oDist < 0.01) {
          const offsetAngle = ((rIdx * 1.7) % 6.28);
          repulseX += Math.cos(offsetAngle) * 0.4;
          repulseZ += Math.sin(offsetAngle) * 0.4;
        } else if (oDist < 1.0) {
          const pushForce = Math.min(1.5, (1.0 - oDist) * 1.6) * effectiveDelta;
          repulseX -= (odx / oDist) * pushForce;
          repulseZ -= (odz / oDist) * pushForce;
        }

        if (oDist < 3.2) {
          const toOtherAngle = Math.atan2(odx, odz);
          let headingDiff = Math.abs((toOtherAngle - robot.rotation) % (Math.PI * 2));
          if (headingDiff > Math.PI) headingDiff = Math.PI * 2 - headingDiff;

          let faceDiff = Math.abs((robot.rotation - other.rotation) % (Math.PI * 2));
          if (faceDiff > Math.PI) faceDiff = Math.PI * 2 - faceDiff;
          const isHeadOn = faceDiff > 1.8;

          if (headingDiff < 1.2) {
            if (isHeadOn) {
              const rightX = -Math.sin(robot.rotation + Math.PI / 2);
              const rightZ = -Math.cos(robot.rotation + Math.PI / 2);
              repulseX += rightX * 0.35 * effectiveDelta;
              repulseZ += rightZ * 0.35 * effectiveDelta;

              if (robot.id > other.id) {
                speedFactor = Math.min(speedFactor, 0.45);
              } else {
                speedFactor = Math.min(speedFactor, 0.85);
              }
            } else {
              if (oDist < 0.7) {
                speedFactor = Math.min(speedFactor, 0.05);
              } else if (oDist < 1.5) {
                speedFactor = Math.min(speedFactor, Math.max(0.2, (oDist - 0.6) / 0.9));
              } else if (oDist < 2.5) {
                speedFactor = Math.min(speedFactor, Math.max(0.5, (oDist - 1.2) / 1.3));
              }
            }
          }

          if (targetWaypoint.type === 'crossover' || targetWaypoint.type === 'junction') {
            const otherTarget = other.path?.[other.currentWaypointIndex];
            if (otherTarget && otherTarget.id === targetWaypoint.id && oDist < 2.8) {
              if (other.id < robot.id) {
                speedFactor = Math.min(speedFactor, 0.25);
                isWaitingIntersection = true;
              }
            }
          }
        }
      }

      // Smooth acceleration / deceleration
      const targetSpeed = robot.speed * speedFactor;
      const curSpeed = robot.currentSpeed || 0;
      const accelRate = 3.2 * effectiveDelta;
      const newSpeed = curSpeed < targetSpeed
        ? Math.min(targetSpeed, curSpeed + accelRate)
        : Math.max(targetSpeed, curSpeed - accelRate * 1.5);

      const moveStep = Math.max(0.005, newSpeed * effectiveDelta);

      // Distance and ETA calculations
      const remainingPath = path.slice(waypointIdx);
      const remainingDist = dist + calculatePathLength(remainingPath);
      const eta = newSpeed > 0.05 ? Math.round(remainingDist / newSpeed) : 99;

      // Anti-deadlock watchdog
      const isStationary = newSpeed < 0.08 || dist < 0.05;
      const currentStuckTime = (robot.stuckTime || 0) + (isStationary ? effectiveDelta : -effectiveDelta * 2);
      const stuckTime = Math.max(0, currentStuckTime);

      // Waypoint arrival tolerance
      const arrivalTolerance = Math.max(moveStep * 1.5, 0.55);

      if (dist <= arrivalTolerance || (dist < 1.5 && stuckTime > 1.8)) {
        // Check if robot arrived at the end of its entire route
        if (waypointIdx >= path.length - 1) {
          if (robot.task?.stage === 'EN_ROUTE_TO_PICK') {
            // Arrived at rack: begin picking animation
            return {
              ...robot,
              status: 'picking',
              task: { ...robot.task, stage: 'PICKING' },
              actionTimer: 2.2,
              liftProgress: 0.0,
              currentSpeed: 0,
              stuckTime: 0
            };
          } else if (robot.task?.stage === 'EN_ROUTE_TO_DROP') {
            // Arrived at delivery location: begin dropping animation
            return {
              ...robot,
              status: 'dropping',
              task: { ...robot.task, stage: 'DROPPING' },
              actionTimer: 2.2,
              dropProgress: 0.0,
              currentSpeed: 0,
              stuckTime: 0
            };
          }
        }

        const nextIdx = waypointIdx + 1;
        return {
          ...robot,
          currentWaypointIndex: nextIdx,
          battery: updatedBattery,
          currentSpeed: Math.max(newSpeed, 0.3),
          distanceRemaining: Math.max(0, remainingDist - dist),
          etaSeconds: eta,
          intersectionWait: false,
          stuckTime: 0
        };
      } else {
        const dirX = dist > 0.001 ? (dx / dist) : 0;
        const dirZ = dist > 0.001 ? (dz / dist) : 0;
        const newX = robot.x + dirX * moveStep + repulseX;
        const newZ = robot.z + dirZ * moveStep + repulseZ;
        const targetAngle = Math.atan2(dirX, dirZ);

        let curAngle = robot.rotation;
        let diff = (targetAngle - curAngle) % (Math.PI * 2);
        if (diff < -Math.PI) diff += Math.PI * 2;
        if (diff > Math.PI) diff -= Math.PI * 2;
        const newRotation = curAngle + diff * Math.min(1.0, effectiveDelta * 6.5);

        return {
          ...robot,
          x: newX,
          z: newZ,
          rotation: newRotation,
          battery: updatedBattery,
          currentSpeed: newSpeed,
          distanceRemaining: remainingDist,
          etaSeconds: eta,
          intersectionWait: isWaitingIntersection,
          stuckTime
        };
      }
    });

    // Update traffic engine & predictive engine
    const trafficResult = trafficEngineInstance.update(updatedRobots, blockedAisles);
    const predictions = predictiveEngineInstance.forecastBottlenecks(updatedRobots, trafficResult.aisleMetrics);

    set(state => ({
      robots: updatedRobots,
      completedOrdersCount: state.completedOrdersCount + completedOrdersIncrement,
      alerts: newAlerts.length > 0 ? [...newAlerts, ...state.alerts].slice(0, 30) : state.alerts,
      aisleMetrics: trafficResult.aisleMetrics,
      congestionZones: trafficResult.congestionZones,
      predictiveBottlenecks: predictions
    }));
  },

  // Reset entire simulation
  resetSimulation: () => {
    warehouseGraphInstance.resetCongestionCosts();
    const blockedAisles = new Set();
    WAREHOUSE_CONFIG.aisles.forEach(a => warehouseGraphInstance.setAisleBlocked(a.id, false));

    set({
      scenarioMode: 'normal',
      blockedAisles,
      obstacles: [{ id: 'OBS_01', x: 15, z: 0, type: 'PALLET_STACK', label: 'Staged Pallet' }],
      aiDecisionLog: [],
      latestAiAction: null,
      predictiveBottlenecks: [],
      selectedAisleId: null,
      selectedRackId: null,
      emergencyStop: false,
      isRunning: true,
      cameraMode: 'orbit',
      cameraPreset: 'overview',
      isCameraTransitioning: true,
      alerts: [
        { id: `ALT_RST_${Date.now()}`, type: 'info', message: 'Warehouse digital twin simulation reset to factory state.', time: new Date().toLocaleTimeString() }
      ]
    });

    get().initSimulation();
  }
}));

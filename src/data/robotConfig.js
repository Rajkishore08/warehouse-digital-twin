// Fleet & Robot Definitions for Warehouse Digital Twin

export const ROBOT_TYPES = {
  AMR: {
    name: 'AMR (Autonomous Mobile Robot)',
    type: 'AMR',
    maxSpeed: 1.5,
    payloadCap: 250, // kg
    dimensions: { width: 1.0, length: 1.2, height: 0.45 },
    batteryDrainRate: 0.04, // % per second at full speed
    chargeRate: 0.45,       // % per second at charger
    color: '#00e5ff'
  },
  AGV: {
    name: 'AGV (Automated Guided Vehicle)',
    type: 'AGV',
    maxSpeed: 1.2,
    payloadCap: 500,
    dimensions: { width: 1.2, length: 1.5, height: 0.5 },
    batteryDrainRate: 0.05,
    chargeRate: 0.40,
    color: '#3d84ff'
  },
  FORKLIFT: {
    name: 'Autonomous High-Lift Forklift',
    type: 'FORKLIFT',
    maxSpeed: 1.1,
    payloadCap: 1500,
    dimensions: { width: 1.3, length: 2.1, height: 2.2 },
    batteryDrainRate: 0.065,
    chargeRate: 0.35,
    color: '#ff9900'
  },
  PALLET_ROBOT: {
    name: 'Heavy Pallet AMR',
    type: 'PALLET_ROBOT',
    maxSpeed: 1.0,
    payloadCap: 1200,
    dimensions: { width: 1.3, length: 1.6, height: 0.55 },
    batteryDrainRate: 0.06,
    chargeRate: 0.35,
    color: '#ffaa00'
  },
  SORTING_ROBOT: {
    name: 'Rapid Sorting Bot',
    type: 'SORTING_ROBOT',
    maxSpeed: 1.8,
    payloadCap: 50,
    dimensions: { width: 0.8, length: 0.9, height: 0.4 },
    batteryDrainRate: 0.035,
    chargeRate: 0.50,
    color: '#9d4edd'
  }
};

// Initial Fleet of 16 Autonomous Industrial Robots
export const INITIAL_ROBOTS = [
  {
    id: 'R01',
    name: 'Titan-01',
    type: 'AMR',
    startNode: 'N_A1_MID',
    x: -21,
    z: 10,
    rotation: Math.PI,
    battery: 88,
    speed: 1.4,
    currentSpeed: 1.4,
    status: 'moving',
    task: {
      id: 'TASK_101',
      title: 'Order Pick #5420',
      sku: 'SKU-7729 (Sensors)',
      sourceNode: 'N_A1_MID',
      targetNode: 'N_PACK_A',
      stage: 'PICKING'
    },
    load: 35
  },
  {
    id: 'R02',
    name: 'Vanguard-02',
    type: 'AGV',
    startNode: 'N_A2_NORTH',
    x: -15,
    z: -10,
    rotation: Math.PI,
    battery: 79,
    speed: 1.2,
    currentSpeed: 1.2,
    status: 'moving',
    task: {
      id: 'TASK_102',
      title: 'Pallet Transfer #2104',
      sku: 'SKU-8821 (Drive Units)',
      sourceNode: 'N_A2_NORTH',
      targetNode: 'N_PACK_B',
      stage: 'TRANSIT'
    },
    load: 120
  },
  {
    id: 'R03',
    name: 'Atlas-03',
    type: 'PALLET_ROBOT',
    startNode: 'N_A3_MID',
    x: -9,
    z: 6,
    rotation: 0,
    battery: 68,
    speed: 1.0,
    currentSpeed: 1.0,
    status: 'moving',
    task: {
      id: 'TASK_103',
      title: 'Pallet Restock #994',
      sku: 'SKU-1002 (Lithium Modules)',
      sourceNode: 'N_A3_MID',
      targetNode: 'N_DOCK_2',
      stage: 'TRANSIT'
    },
    load: 450
  },
  {
    id: 'R04',
    name: 'Mercury-04',
    type: 'SORTING_ROBOT',
    startNode: 'N_A4_NORTH',
    x: -3,
    z: -6,
    rotation: Math.PI,
    battery: 62,
    speed: 1.7,
    currentSpeed: 1.7,
    status: 'moving',
    task: {
      id: 'TASK_104',
      title: 'Express Pick #332',
      sku: 'SKU-3320 (Microcontrollers)',
      sourceNode: 'N_A4_NORTH',
      targetNode: 'N_DISPATCH_1',
      stage: 'PICKING'
    },
    load: 15
  },
  {
    id: 'R05',
    name: 'Hermes-05',
    type: 'AMR',
    startNode: 'N_A5_MID',
    x: 3,
    z: 4,
    rotation: Math.PI,
    battery: 84,
    speed: 1.4,
    currentSpeed: 1.4,
    status: 'moving',
    task: {
      id: 'TASK_105',
      title: 'Order Deliver #789',
      sku: 'SKU-9921 (Optics)',
      sourceNode: 'N_A5_MID',
      targetNode: 'N_PACK_C',
      stage: 'TRANSIT'
    },
    load: 40
  },
  {
    id: 'R06',
    name: 'Scout-06',
    type: 'SORTING_ROBOT',
    startNode: 'N_A1_MID',
    x: -21,
    z: 2,
    rotation: 0,
    battery: 91,
    speed: 1.8,
    currentSpeed: 1.8,
    status: 'moving',
    task: {
      id: 'TASK_106',
      title: 'Fast Sort #1021',
      sku: 'SKU-4410 (Connectors)',
      sourceNode: 'N_A1_NORTH',
      targetNode: 'N_DISPATCH_2',
      stage: 'TRANSIT'
    },
    load: 20
  },
  {
    id: 'R07',
    name: 'Goliath-07',
    type: 'FORKLIFT',
    startNode: 'N_A2_SOUTH',
    x: -15,
    z: 10,
    rotation: 0,
    battery: 74,
    speed: 1.1,
    currentSpeed: 1.1,
    status: 'moving',
    task: {
      id: 'TASK_107',
      title: 'Heavy Pallet Inbound #542',
      sku: 'SKU-0091 (Gearboxes)',
      sourceNode: 'N_DOCK_1',
      targetNode: 'N_A2_MID',
      stage: 'PICKING'
    },
    load: 850
  },
  {
    id: 'R08',
    name: 'Apollo-08',
    type: 'AMR',
    startNode: 'N_A3_NORTH',
    x: -9,
    z: -8,
    rotation: Math.PI,
    battery: 55,
    speed: 1.5,
    currentSpeed: 1.5,
    status: 'moving',
    task: {
      id: 'TASK_108',
      title: 'Pick Order #6612',
      sku: 'SKU-6120 (Alloy Brackets)',
      sourceNode: 'N_A3_MID',
      targetNode: 'N_PACK_B',
      stage: 'TRANSIT'
    },
    load: 50
  },
  {
    id: 'R09',
    name: 'Nova-09',
    type: 'AGV',
    startNode: 'N_A4_MID',
    x: -3,
    z: 0,
    rotation: 0,
    battery: 70,
    speed: 1.2,
    currentSpeed: 1.2,
    status: 'moving',
    task: {
      id: 'TASK_109',
      title: 'Restock Batch #441',
      sku: 'SKU-2341 (Fasteners)',
      sourceNode: 'N_DOCK_2',
      targetNode: 'N_A4_SOUTH',
      stage: 'TRANSIT'
    },
    load: 310
  },
  {
    id: 'R10',
    name: 'Pioneer-10',
    type: 'AMR',
    startNode: 'N_A6_SOUTH',
    x: 9,
    z: 12,
    rotation: -Math.PI / 2,
    battery: 82,
    speed: 1.5,
    currentSpeed: 1.5,
    status: 'moving',
    task: {
      id: 'TASK_110',
      title: 'Pick Order #8819',
      sku: 'SKU-7710 (Servo Motors)',
      sourceNode: 'N_A6_NORTH',
      targetNode: 'N_PACK_C',
      stage: 'TRANSIT'
    },
    load: 45
  },
  {
    id: 'R11',
    name: 'Zephyr-11',
    type: 'SORTING_ROBOT',
    startNode: 'N_A7_NORTH',
    x: 15,
    z: -12,
    rotation: Math.PI,
    battery: 89,
    speed: 1.8,
    currentSpeed: 1.8,
    status: 'moving',
    task: {
      id: 'TASK_111',
      title: 'Sort Dispatch #449',
      sku: 'SKU-5501 (Microchips)',
      sourceNode: 'N_A7_MID',
      targetNode: 'N_DISPATCH_3',
      stage: 'TRANSIT'
    },
    load: 18
  },
  {
    id: 'R12',
    name: 'Forge-12',
    type: 'FORKLIFT',
    startNode: 'N_A8_MID',
    x: 21,
    z: 4,
    rotation: -Math.PI / 2,
    battery: 68,
    speed: 1.1,
    currentSpeed: 1.1,
    status: 'moving',
    task: {
      id: 'TASK_112',
      title: 'Raw Material Delivery',
      sku: 'SKU-1190 (Extrusions)',
      sourceNode: 'N_DOCK_3',
      targetNode: 'N_A8_SOUTH',
      stage: 'TRANSIT'
    },
    load: 920
  },
  {
    id: 'R13',
    name: 'Volt-13',
    type: 'AMR',
    startNode: 'N_CHG_01',
    x: -29,
    z: -8,
    rotation: 0,
    battery: 24,
    speed: 1.4,
    currentSpeed: 0,
    status: 'charging',
    task: {
      id: 'TASK_CHG_13',
      title: 'Fast Top-up Charge',
      sku: 'Battery Recalibration',
      sourceNode: 'N_CHG_01',
      targetNode: 'N_CHG_01',
      stage: 'CHARGING'
    },
    load: 0
  },
  {
    id: 'R14',
    name: 'Spark-14',
    type: 'AMR',
    startNode: 'N_CHG_02',
    x: -29,
    z: -4,
    rotation: 0,
    battery: 31,
    speed: 1.4,
    currentSpeed: 0,
    status: 'charging',
    task: {
      id: 'TASK_CHG_14',
      title: 'Fast Top-up Charge',
      sku: 'Battery Recalibration',
      sourceNode: 'N_CHG_02',
      targetNode: 'N_CHG_02',
      stage: 'CHARGING'
    },
    load: 0
  },
  {
    id: 'R15',
    name: 'Apex-15',
    type: 'PALLET_ROBOT',
    startNode: 'N_A7_SOUTH',
    x: 15,
    z: 14,
    rotation: -Math.PI / 2,
    battery: 86,
    speed: 1.0,
    currentSpeed: 1.0,
    status: 'moving',
    task: {
      id: 'TASK_115',
      title: 'Bulk Pallet Transfer #402',
      sku: 'SKU-8821 (Drive Units)',
      sourceNode: 'N_A7_MID',
      targetNode: 'N_PACK_A',
      stage: 'TRANSIT'
    },
    load: 680
  },
  {
    id: 'R16',
    name: 'Orbit-16',
    type: 'AMR',
    startNode: 'N_A4_NORTH',
    x: -3,
    z: -12,
    rotation: 0,
    battery: 78,
    speed: 1.5,
    currentSpeed: 1.5,
    status: 'moving',
    task: {
      id: 'TASK_116',
      title: 'Express Pick #910',
      sku: 'SKU-9921 (Optics)',
      sourceNode: 'N_A4_MID',
      targetNode: 'N_DISPATCH_1',
      stage: 'TRANSIT'
    },
    load: 30
  }
];

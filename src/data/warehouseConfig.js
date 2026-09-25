// Warehouse 3D Dimension & Zone Configurations

export const WAREHOUSE_CONFIG = {
  dimensions: {
    width: 74,     // X axis (-37 to +37)
    length: 54,    // Z axis (-27 to +27)
    height: 9.5,   // Y axis
  },
  
  aisles: [
    { id: 'AISLE_01', name: 'Aisle 1', x: -21, zMin: -15, zMax: 15, width: 3.2, capacity: 4 },
    { id: 'AISLE_02', name: 'Aisle 2', x: -15, zMin: -15, zMax: 15, width: 3.2, capacity: 4 },
    { id: 'AISLE_03', name: 'Aisle 3', x: -9,  zMin: -15, zMax: 15, width: 3.2, capacity: 4 },
    { id: 'AISLE_04', name: 'Aisle 4', x: -3,  zMin: -15, zMax: 15, width: 3.2, capacity: 4 },
    { id: 'AISLE_05', name: 'Aisle 5', x: 3,   zMin: -15, zMax: 15, width: 3.2, capacity: 4 }, // Target bottleneck aisle for demo
    { id: 'AISLE_06', name: 'Aisle 6', x: 9,   zMin: -15, zMax: 15, width: 3.2, capacity: 4 },
    { id: 'AISLE_07', name: 'Aisle 7', x: 15,  zMin: -15, zMax: 15, width: 3.2, capacity: 4 },
    { id: 'AISLE_08', name: 'Aisle 8', x: 21,  zMin: -15, zMax: 15, width: 3.2, capacity: 4 },
  ],

  // Racks configuration flanking the aisles
  racks: [
    // Flanking Aisle 1
    { id: 'RACK_01_L', x: -23.4, z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A1-L' },
    { id: 'RACK_01_R', x: -18.6, z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A1-R' },
    // Flanking Aisle 2
    { id: 'RACK_02_L', x: -17.4, z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A2-L' },
    { id: 'RACK_02_R', x: -12.6, z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A2-R' },
    // Flanking Aisle 3
    { id: 'RACK_03_L', x: -11.4, z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A3-L' },
    { id: 'RACK_03_R', x: -6.6,  z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A3-R' },
    // Flanking Aisle 4
    { id: 'RACK_04_L', x: -5.4,  z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A4-L' },
    { id: 'RACK_04_R', x: -0.6,  z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A4-R' },
    // Flanking Aisle 5
    { id: 'RACK_05_L', x: 0.6,   z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A5-L' },
    { id: 'RACK_05_R', x: 5.4,   z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A5-R' },
    // Flanking Aisle 6
    { id: 'RACK_06_L', x: 6.6,   z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A6-L' },
    { id: 'RACK_06_R', x: 11.4,  z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A6-R' },
    // Flanking Aisle 7
    { id: 'RACK_07_L', x: 12.6,  z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A7-L' },
    { id: 'RACK_07_R', x: 17.4,  z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A7-R' },
    // Flanking Aisle 8
    { id: 'RACK_08_L', x: 18.6,  z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A8-L' },
    { id: 'RACK_08_R', x: 23.4,  z: 0, length: 28, height: 5.5, levels: 4, bays: 7, label: 'A8-R' },
  ],

  // Special Industrial Zones
  zones: {
    receiving: {
      name: 'Receiving Docks',
      bounds: { xMin: -25, xMax: 25, zMin: -26, zMax: -18 },
      color: '#00a8ff',
      stations: [
        { id: 'DOCK_1', name: 'Inbound Dock 1', x: -16, z: -22 },
        { id: 'DOCK_2', name: 'Inbound Dock 2', x: 0,   z: -22 },
        { id: 'DOCK_3', name: 'Inbound Dock 3', x: 16,  z: -22 },
      ]
    },
    packing: {
      name: 'Packing Station Hub',
      bounds: { xMin: -25, xMax: 0, zMin: 18, zMax: 25 },
      color: '#9d4edd',
      stations: [
        { id: 'PACK_A', name: 'Packing Line Alpha', x: -18, z: 21 },
        { id: 'PACK_B', name: 'Packing Line Beta',  x: -9,  z: 21 },
        { id: 'PACK_C', name: 'Packing Line Gamma', x: -2,  z: 21 },
      ]
    },
    dispatch: {
      name: 'Outbound Dispatch',
      bounds: { xMin: 0, xMax: 25, zMin: 18, zMax: 25 },
      color: '#00e676',
      stations: [
        { id: 'DISPATCH_1', name: 'Dispatch Bay 1', x: 6,  z: 22 },
        { id: 'DISPATCH_2', name: 'Dispatch Bay 2', x: 15, z: 22 },
        { id: 'DISPATCH_3', name: 'Dispatch Bay 3', x: 22, z: 22 },
      ]
    },
    charging: {
      name: 'Autonomous Charging Hub',
      bounds: { xMin: -34, xMax: -26, zMin: -12, zMax: 12 },
      color: '#00f0ff',
      stations: [
        { id: 'CHG_01', name: 'Charger Bay 1', x: -29, z: -8, status: 'available', currentRobotId: null },
        { id: 'CHG_02', name: 'Charger Bay 2', x: -29, z: -4, status: 'available', currentRobotId: null },
        { id: 'CHG_03', name: 'Charger Bay 3', x: -29, z: 0,  status: 'available', currentRobotId: null },
        { id: 'CHG_04', name: 'Charger Bay 4', x: -29, z: 4,  status: 'available', currentRobotId: null },
        { id: 'CHG_05', name: 'Charger Bay 5', x: -29, z: 8,  status: 'available', currentRobotId: null },
      ]
    },
    safetyPedestrian: {
      name: 'Human Pedestrian Safety Crossings',
      zones: [
        { id: 'PED_CROSS_N', x: 0, z: -16.5, width: 50, depth: 1.5 },
        { id: 'PED_CROSS_S', x: 0, z: 16.5,  width: 50, depth: 1.5 },
        { id: 'PED_CROSS_M', x: 0, z: 0,     width: 50, depth: 1.2 },
      ]
    },
    restrictedZone: {
      id: 'RESTRICTED_HAZMAT',
      name: 'HazMat / Maintenance Zone',
      x: 30, z: 0, width: 8, depth: 16,
      color: '#ff9100'
    }
  }
}

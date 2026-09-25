// Task, Inventory and Order Pool Data

export const INVENTORY_CATALOG = [
  { sku: 'SKU-7729', name: 'Precision LiDAR Sensors', rack: 'RACK_05_L', level: 2, bay: 4, stock: 120, aisle: 'Aisle 5', weightKg: 1.2 },
  { sku: 'SKU-8821', name: 'Industrial Drive Units', rack: 'RACK_05_R', level: 1, bay: 2, stock: 45, aisle: 'Aisle 5', weightKg: 18.5 },
  { sku: 'SKU-1002', name: 'Lithium Iron Battery Packs', rack: 'RACK_05_R', level: 3, bay: 6, stock: 80, aisle: 'Aisle 5', weightKg: 25.0 },
  { sku: 'SKU-3320', name: 'ARM Cortex Controller Boards', rack: 'RACK_05_L', level: 4, bay: 1, stock: 350, aisle: 'Aisle 5', weightKg: 0.4 },
  { sku: 'SKU-9921', name: 'Optical Telemetry Cameras', rack: 'RACK_04_L', level: 2, bay: 5, stock: 95, aisle: 'Aisle 4', weightKg: 0.8 },
  { sku: 'SKU-4410', name: 'Gold-plated Harness Connectors', rack: 'RACK_01_R', level: 1, bay: 3, stock: 600, aisle: 'Aisle 1', weightKg: 0.1 },
  { sku: 'SKU-0091', name: 'Planetary Gearboxes (Heavy)', rack: 'RACK_02_L', level: 1, bay: 1, stock: 30, aisle: 'Aisle 2', weightKg: 42.0 },
  { sku: 'SKU-6120', name: 'CNC Milled Alloy Brackets', rack: 'RACK_03_R', level: 3, bay: 3, stock: 180, aisle: 'Aisle 3', weightKg: 3.5 },
  { sku: 'SKU-2341', name: 'M8 Stainless Fastener Kits', rack: 'RACK_04_R', level: 2, bay: 2, stock: 420, aisle: 'Aisle 4', weightKg: 2.0 },
  { sku: 'SKU-7710', name: 'High-Torque Servo Motors', rack: 'RACK_06_L', level: 2, bay: 4, stock: 110, aisle: 'Aisle 6', weightKg: 5.5 },
  { sku: 'SKU-5501', name: 'RF Transceiver ICs', rack: 'RACK_07_R', level: 4, bay: 5, stock: 900, aisle: 'Aisle 7', weightKg: 0.05 },
  { sku: 'SKU-1190', name: 'Heavy Structural Extrusions', rack: 'RACK_08_L', level: 1, bay: 7, stock: 65, aisle: 'Aisle 8', weightKg: 34.0 },
];

export const TASK_TEMPLATES = [
  { type: 'PICK_ORDER', title: 'Pick Order', priority: 'HIGH', estDuration: 45 },
  { type: 'MOVE_PALLET', title: 'Pallet Transfer', priority: 'MEDIUM', estDuration: 60 },
  { type: 'DELIVER_ORDER', title: 'Deliver to Outbound', priority: 'HIGH', estDuration: 40 },
  { type: 'RESTOCK', title: 'Inbound Restock', priority: 'LOW', estDuration: 75 },
  { type: 'CHARGE', title: 'Battery Top-up', priority: 'CRITICAL', estDuration: 90 },
  { type: 'SORT_PACKAGE', title: 'Sort & Consolidate', priority: 'MEDIUM', estDuration: 30 },
];

import React, { useState } from 'react';
import {
  Layers,
  X,
  Radio,
  Cpu,
  Server,
  Activity,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';

const ARCH_LAYERS = [
  {
    id: 'layer_1',
    layerNum: '01',
    name: 'Physical Warehouse & Fleet',
    tech: 'AMRs, AGVs, Automated Forklifts, Racks, Charging Bays',
    desc: 'Physical autonomous assets navigating warehouse aisles carrying pallets, cartons, and totes.',
    protocol: 'CAN-bus / Ethernet / RS-485'
  },
  {
    id: 'layer_2',
    layerNum: '02',
    name: 'Robot Sensors & Perception',
    tech: '360° 2D/3D LiDAR, RealSense RGB-D Depth Cameras, IMU, Wheel Encoders, RFID',
    desc: 'Continuous real-time sensing of environment, obstacle distances, wheel velocities, and battery telemetry.',
    protocol: 'ROS 2 / Micro-ROS / Sensor HAL'
  },
  {
    id: 'layer_3',
    layerNum: '03',
    name: 'Edge Industrial Gateways',
    tech: 'Overhead Antenna Gateway Hubs (Wi-Fi 6E / Private 5G)',
    desc: 'Ingests high-frequency robot telemetry packets with sub-10ms latency and buffers local sector state.',
    protocol: 'MQTT / DDS / gRPC'
  },
  {
    id: 'layer_4',
    layerNum: '04',
    name: 'Real-Time Data Broker',
    tech: 'Low-latency telemetry streaming & message bus',
    desc: 'Distributes position updates, traffic densities, battery states, and active order tickets.',
    protocol: 'WebSockets / Apache Kafka / Protobuf'
  },
  {
    id: 'layer_5',
    layerNum: '05',
    name: 'Warehouse Digital Twin Engine',
    tech: 'Three.js / WebGL / Zustand 60 FPS Simulation Loop',
    desc: 'Maintains live topological graph, physical bounding boxes, dynamic edge costs, and zone allocations.',
    protocol: 'Spatial Graph Model / React Three Fiber'
  },
  {
    id: 'layer_6',
    layerNum: '06',
    name: 'AI Traffic & Predictive Engine',
    tech: 'Density Estimator & 30s Ahead Trajectory Forecaster',
    desc: 'Detects real-time bottlenecks and forecasts aisle convergence before physical congestion occurs.',
    protocol: 'Predictive Analytics Engine'
  },
  {
    id: 'layer_7',
    layerNum: '07',
    name: 'Global AI Route Optimizer',
    tech: 'Multi-Criteria Dynamic A* with Fleet Load Balancing',
    desc: 'Calculates non-conflicting alternative corridors, balancing flow across parallel aisles and chargers.',
    protocol: 'Dynamic Cost Heuristics'
  },
  {
    id: 'layer_8',
    layerNum: '08',
    name: 'Actuator Execution & Robot Dispatch',
    tech: 'Fleet Management System (FMS) / WMS Synchronization',
    desc: 'Dispatches new waypoint splines to robot motion controllers, executing smooth path traversal.',
    protocol: 'Closed-Loop Kinematics'
  }
];

export function ArchitectureModal() {
  const archModalOpen = useWarehouseStore(state => state.archModalOpen);
  const setArchModalOpen = useWarehouseStore(state => state.setArchModalOpen);
  const [selectedLayer, setSelectedLayer] = useState(ARCH_LAYERS[0]);

  if (!archModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(4, 8, 16, 0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setArchModalOpen(false)}
    >
      <div
        className="glass-panel-elevated hud-border-bracket"
        style={{
          width: '900px',
          maxWidth: '95vw',
          maxHeight: '85vh',
          background: 'rgba(10, 18, 32, 0.95)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={22} color="var(--cyan-bright)" />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                ARCHITECTURE VIEW — FULL-STACK INDUSTRIAL DIGITAL TWIN
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                End-to-end data pipeline from physical robot sensors to AI route optimization and dispatch
              </p>
            </div>
          </div>

          <button
            onClick={() => setArchModalOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content: Left Layer Stack + Right Detail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', overflowY: 'auto', flex: 1 }}>
          {/* Architecture Layer Pipeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {ARCH_LAYERS.map((layer, idx) => {
              const isSelected = selectedLayer.id === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: isSelected ? 'rgba(0, 240, 255, 0.18)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? 'var(--cyan-bright)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="mono-text" style={{ fontSize: '11px', fontWeight: '800', color: 'var(--cyan-bright)' }}>
                      [{layer.layerNum}]
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                      {layer.name}
                    </span>
                  </div>

                  <span className="mono-text" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {layer.protocol}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Layer Detail Inspector */}
          <div
            className="glass-panel"
            style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              LAYER SPECIFICATION
            </div>

            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--cyan-bright)' }}>
              {selectedLayer.name}
            </div>

            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>TECHNOLOGY STACK:</div>
              <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600', marginTop: '2px' }}>
                {selectedLayer.tech}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>FUNCTION:</div>
              <div style={{ fontSize: '12px', color: '#e0e8f5', lineHeight: '1.5', marginTop: '2px' }}>
                {selectedLayer.desc}
              </div>
            </div>

            <div style={{ marginTop: 'auto', padding: '10px', background: 'rgba(0, 240, 255, 0.06)', borderRadius: '6px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>COMMUNICATION PROTOCOL:</div>
              <div className="mono-text" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--cyan-bright)', marginTop: '2px' }}>
                {selectedLayer.protocol}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

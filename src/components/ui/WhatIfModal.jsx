import React from 'react';
import {
  Sliders,
  X,
  PlusCircle,
  AlertOctagon,
  BatteryCharging,
  PackageCheck,
  TrendingUp,
  UserCheck,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function WhatIfModal() {
  const whatIfModalOpen = useWarehouseStore(state => state.whatIfModalOpen);
  const setWhatIfModalOpen = useWarehouseStore(state => state.setWhatIfModalOpen);
  const addRobots = useWarehouseStore(state => state.addRobots);
  const toggleBlockAisle = useWarehouseStore(state => state.toggleBlockAisle);
  const blockedAisles = useWarehouseStore(state => state.blockedAisles);
  const runCongestionDemo = useWarehouseStore(state => state.runCongestionDemo);
  const triggerAiOptimization = useWarehouseStore(state => state.triggerAiOptimization);
  const toggleEmergencyStop = useWarehouseStore(state => state.toggleEmergencyStop);
  const emergencyStop = useWarehouseStore(state => state.emergencyStop);
  const robots = useWarehouseStore(state => state.robots);
  const congestionZones = useWarehouseStore(state => state.congestionZones);

  if (!whatIfModalOpen) return null;

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
      onClick={() => setWhatIfModalOpen(false)}
    >
      <div
        className="glass-panel-elevated hud-border-bracket"
        style={{
          width: '780px',
          maxWidth: '95vw',
          maxHeight: '85vh',
          background: 'rgba(10, 18, 32, 0.95)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={22} color="var(--cyan-bright)" />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                WHAT-IF SIMULATION CENTER
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                Inject dynamic stress tests, capacity surges, infrastructure faults, and safety events
              </p>
            </div>
          </div>

          <button
            onClick={() => setWhatIfModalOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Simulation Metric Impact Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <div className="glass-panel" style={{ padding: '10px', background: 'rgba(0, 240, 255, 0.05)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>FLEET SIZE</div>
            <div className="mono-text" style={{ fontSize: '16px', fontWeight: '800', color: 'var(--cyan-bright)' }}>
              {robots.length} Robots
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '10px', background: 'rgba(255, 34, 85, 0.05)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CONGESTION</div>
            <div className="mono-text" style={{ fontSize: '16px', fontWeight: '800', color: congestionZones.length > 0 ? 'var(--red-congested)' : 'var(--green-normal)' }}>
              {congestionZones.length} Zones
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '10px', background: 'rgba(0, 255, 136, 0.05)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>FLEET UTILIZATION</div>
            <div className="mono-text" style={{ fontSize: '16px', fontWeight: '800', color: 'var(--green-normal)' }}>
              {Math.min(98, 70 + robots.length * 1.5).toFixed(0)}%
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '10px', background: 'rgba(255, 204, 0, 0.05)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>AVG CYCLE TIME</div>
            <div className="mono-text" style={{ fontSize: '16px', fontWeight: '800', color: 'var(--yellow-warn)' }}>
              {(2.1 + congestionZones.length * 0.4).toFixed(1)} min
            </div>
          </div>
        </div>

        {/* Scenario Injection Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* Scenario 1: +10 Robots */}
          <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={16} color="var(--cyan-bright)" />
              What If: +10 Autonomous Robots
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Simulates peak holiday warehouse order fulfillment with heavy fleet density.
            </div>
            <button
              className="btn-primary"
              onClick={() => { addRobots(10); setWhatIfModalOpen(false); }}
              style={{ marginTop: 'auto', fontSize: '11px', justifyContent: 'center' }}
            >
              Inject +10 Robots
            </button>
          </div>

          {/* Scenario 2: Close Aisle 5 */}
          <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertOctagon size={16} color="var(--red-congested)" />
              What If: Aisle 5 Maintenance Closure
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Blocks central main artery Aisle 5 and tests AI fleet corridor rerouting.
            </div>
            <button
              className={blockedAisles.has('AISLE_05') ? 'btn-danger' : 'btn-secondary'}
              onClick={() => { toggleBlockAisle('AISLE_05'); setWhatIfModalOpen(false); }}
              style={{ marginTop: 'auto', fontSize: '11px', justifyContent: 'center' }}
            >
              {blockedAisles.has('AISLE_05') ? 'Unblock Aisle 5' : 'Block Aisle 5'}
            </button>
          </div>

          {/* Scenario 3: Traffic Surge */}
          <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} color="var(--orange-reroute)" />
              What If: Heavy Traffic Bottleneck
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Dispatches multi-robot convergence into Aisle 5 to trigger autonomous reroute.
            </div>
            <button
              className="btn-warning"
              onClick={() => { runCongestionDemo(); setWhatIfModalOpen(false); }}
              style={{ marginTop: 'auto', fontSize: '11px', justifyContent: 'center' }}
            >
              Simulate Traffic Spike
            </button>
          </div>

          {/* Scenario 4: Emergency Stop */}
          <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={16} color="var(--yellow-warn)" />
              What If: Safety Intrusion / E-Stop
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Triggers master safety lockout, halting all actuators across the facility.
            </div>
            <button
              className={emergencyStop ? 'btn-danger' : 'btn-secondary'}
              onClick={() => { toggleEmergencyStop(); setWhatIfModalOpen(false); }}
              style={{ marginTop: 'auto', fontSize: '11px', justifyContent: 'center' }}
            >
              {emergencyStop ? 'Resume Operations' : 'Trigger Safety Stop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

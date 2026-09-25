import React, { useState } from 'react';
import { Warehouse } from './components/3d/Warehouse';
import { TopNav } from './components/ui/TopNav';
import { SimulationControls } from './components/ui/SimulationControls';
import { RobotPanel } from './components/ui/RobotPanel';
import { AiPanel } from './components/ui/AiPanel';
import { AlertPanel } from './components/ui/AlertPanel';
import { TaskPanel } from './components/ui/TaskPanel';
import { Timeline } from './components/ui/Timeline';
import { DemoModeOverlay } from './components/ui/DemoModeOverlay';
import { RobotPovHud } from './components/ui/RobotPovHud';
import { LearnModal } from './components/ui/LearnModal';
import { ArchitectureModal } from './components/ui/ArchitectureModal';
import { WhatIfModal } from './components/ui/WhatIfModal';
import { useWarehouseStore } from './store/useWarehouseStore';
import { Bot, BrainCircuit } from 'lucide-react';

export default function App() {
  const [rightTab, setRightTab] = useState('telemetry'); // 'telemetry' | 'ai'
  const isCleanView = useWarehouseStore(state => state.isCleanView);
  const cameraMode = useWarehouseStore(state => state.cameraMode);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#060b14',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. Main 3D Warehouse Canvas (Full background viewport) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Warehouse />
      </div>

      {/* 2. Robot POV Cockpit HUD (Active when in Robot POV) */}
      <RobotPovHud />

      {/* 3. Top Industrial KPI & Header Bar */}
      <div style={{ position: 'relative', zIndex: 20, margin: '14px 16px 0 16px' }}>
        <TopNav />
      </div>

      {/* 4. 12-Step Guided Demo Overlay (Centered below top nav) */}
      <DemoModeOverlay />

      {/* 5. Left Control Panel (Hidden in POV or Clean View unless reopened) */}
      {cameraMode !== 'pov' && !isCleanView && (
        <div
          style={{
            position: 'absolute',
            top: '76px',
            left: '16px',
            zIndex: 20,
            pointerEvents: 'none'
          }}
        >
          <SimulationControls />
        </div>
      )}

      {/* 6. Right Side Telemetry & AI Decision Panel */}
      {cameraMode !== 'pov' && !isCleanView && (
        <div
          style={{
            position: 'absolute',
            top: '76px',
            right: '16px',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            pointerEvents: 'none'
          }}
        >
          {/* Tab switch buttons */}
          <div
            className="glass-panel"
            style={{
              padding: '3px',
              display: 'flex',
              gap: '4px',
              pointerEvents: 'auto'
            }}
          >
            <button
              onClick={() => setRightTab('telemetry')}
              style={{
                flex: 1,
                padding: '5px 10px',
                background: rightTab === 'telemetry' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                border: '1px solid',
                borderColor: rightTab === 'telemetry' ? 'var(--cyan-bright)' : 'transparent',
                borderRadius: '6px',
                color: rightTab === 'telemetry' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Bot size={13} color={rightTab === 'telemetry' ? 'var(--cyan-bright)' : 'var(--text-muted)'} />
              <span>Robot Details</span>
            </button>

            <button
              onClick={() => setRightTab('ai')}
              style={{
                flex: 1,
                padding: '5px 10px',
                background: rightTab === 'ai' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                border: '1px solid',
                borderColor: rightTab === 'ai' ? 'var(--green-normal)' : 'transparent',
                borderRadius: '6px',
                color: rightTab === 'ai' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <BrainCircuit size={13} color={rightTab === 'ai' ? 'var(--green-normal)' : 'var(--text-muted)'} />
              <span>AI Optimizer</span>
            </button>
          </div>

          {/* Tab Content */}
          {rightTab === 'telemetry' ? <RobotPanel /> : <AiPanel />}
        </div>
      )}

      {/* 7. Bottom Dock (Timeline, Live Alerts & Task Pipeline) */}
      {cameraMode !== 'pov' && !isCleanView && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            right: '16px',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            pointerEvents: 'none'
          }}
        >
          <Timeline />
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <AlertPanel />
            <TaskPanel />
          </div>
        </div>
      )}

      {/* 8. Interactive Modals (Learn Mode, Architecture View, What-If Center) */}
      <LearnModal />
      <ArchitectureModal />
      <WhatIfModal />
    </div>
  );
}

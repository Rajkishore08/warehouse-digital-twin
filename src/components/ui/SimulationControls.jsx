import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Camera,
  Layers,
  AlertOctagon,
  BatteryCharging,
  PlusCircle,
  Eye,
  Sliders,
  TrendingDown,
  Activity,
  Minus,
  Plus,
  Compass,
  CheckCircle2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function SimulationControls() {
  const isRunning = useWarehouseStore(state => state.isRunning);
  const setSimRunning = useWarehouseStore(state => state.setSimRunning);
  const simSpeed = useWarehouseStore(state => state.simSpeed);
  const setSimSpeed = useWarehouseStore(state => state.setSimSpeed);
  const resetSimulation = useWarehouseStore(state => state.resetSimulation);
  const cameraPreset = useWarehouseStore(state => state.cameraPreset);
  const setCameraPreset = useWarehouseStore(state => state.setCameraPreset);
  const viewMode = useWarehouseStore(state => state.viewMode);
  const setViewMode = useWarehouseStore(state => state.setViewMode);
  const triggerAiOptimization = useWarehouseStore(state => state.triggerAiOptimization);
  const toggleBlockAisle = useWarehouseStore(state => state.toggleBlockAisle);
  const blockedAisles = useWarehouseStore(state => state.blockedAisles);
  const addRobots = useWarehouseStore(state => state.addRobots);
  const addObstacle = useWarehouseStore(state => state.addObstacle);
  const runFreeFlow = useWarehouseStore(state => state.runFreeFlow);
  const runHeavyCongestion = useWarehouseStore(state => state.runHeavyCongestion);
  const runExtremeRecovery = useWarehouseStore(state => state.runExtremeRecovery);
  const scenarioMode = useWarehouseStore(state => state.scenarioMode);

  const [isMinimized, setIsMinimized] = useState(false);

  const isAisle5Blocked = blockedAisles.has('AISLE_05');

  if (isMinimized) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          pointerEvents: 'auto'
        }}
        onClick={() => setIsMinimized(false)}
      >
        <Sliders size={18} color="var(--cyan-bright)" />
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
          Controls ({simSpeed}x)
        </span>
        <button style={{ background: 'none', border: 'none', color: 'var(--cyan-bright)', cursor: 'pointer', marginLeft: 'auto' }}>
          <Plus size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="glass-panel hud-border-bracket"
      style={{
        width: '320px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        pointerEvents: 'auto'
      }}
    >
      {/* 1. Header with Minimize Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={14} /> SIMULATION ENGINE
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className={`badge ${isRunning ? 'badge-green' : 'badge-yellow'}`}>
            {isRunning ? 'RUNNING' : 'PAUSED'}
          </span>
          <button
            onClick={() => setIsMinimized(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            title="Minimize Panel"
          >
            <Minus size={15} />
          </button>
        </div>
      </div>

      {/* Playback & Reset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className={isRunning ? 'btn-secondary' : 'btn-primary'}
          onClick={() => setSimRunning(!isRunning)}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          {isRunning ? <Pause size={15} /> : <Play size={15} />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        <button
          className="btn-secondary"
          onClick={resetSimulation}
          title="Reset Warehouse Simulation"
          style={{ padding: '8px 12px' }}
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Speed Multipliers (0.25x to 5x) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {[0.25, 0.5, 1, 2, 5].map((speed) => (
          <button
            key={speed}
            onClick={() => setSimSpeed(speed)}
            style={{
              flex: 1,
              padding: '4px 0',
              background: simSpeed === speed ? 'var(--cyan-bright)' : 'rgba(255,255,255,0.06)',
              color: simSpeed === speed ? '#060b14' : 'var(--text-muted)',
              border: '1px solid',
              borderColor: simSpeed === speed ? 'var(--cyan-bright)' : 'rgba(255,255,255,0.1)',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {speed}x
          </button>
        ))}
      </div>

      {/* 2. Warehouse State & Scenario Center */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} /> WAREHOUSE STATES
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {/* Free Flow */}
          <button
            className={scenarioMode === 'free_flow' ? 'btn-primary' : 'btn-secondary'}
            onClick={runFreeFlow}
            style={{ fontSize: '11px', padding: '6px 8px', justifyContent: 'center' }}
          >
            <CheckCircle2 size={13} color="var(--green-normal)" />
            <span>Free Flow</span>
          </button>

          {/* Normal Operations */}
          <button
            className={scenarioMode === 'normal' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => { resetSimulation(); }}
            style={{ fontSize: '11px', padding: '6px 8px', justifyContent: 'center' }}
          >
            <Activity size={13} />
            <span>Normal</span>
          </button>

          {/* Heavy Traffic Surge */}
          <button
            className="btn-secondary"
            onClick={() => addRobots(8)}
            style={{ fontSize: '11px', padding: '6px 8px', justifyContent: 'center' }}
          >
            <PlusCircle size={13} />
            <span>+8 Robots</span>
          </button>

          {/* Extreme Congestion */}
          <button
            className={scenarioMode === 'extreme' ? 'btn-danger' : 'btn-secondary'}
            onClick={runHeavyCongestion}
            style={{ fontSize: '11px', padding: '6px 8px', justifyContent: 'center' }}
          >
            <AlertOctagon size={13} color="var(--red-congested)" />
            <span>Extreme Jam</span>
          </button>
        </div>

        {/* Extreme -> AI Recovery Master Scenario */}
        <button
          className="btn-warning"
          onClick={runExtremeRecovery}
          style={{ width: '100%', justifyContent: 'center', padding: '8px', marginTop: '6px' }}
        >
          <Sparkles size={15} />
          <span>Demo: Extreme ➔ AI Recovery</span>
        </button>
      </div>

      {/* 3. Dynamic Controls (Obstacles, Block Aisle, AI Reroute) */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={14} /> LIVE ACTIONS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* AI Optimizer Trigger */}
          <button
            className="btn-primary"
            onClick={triggerAiOptimization}
            style={{ width: '100%', justifyContent: 'center', fontSize: '11px', padding: '7px' }}
          >
            <Zap size={14} />
            <span>Execute AI Fleet Reroute</span>
          </button>

          {/* Block Aisle 5 */}
          <button
            className={isAisle5Blocked ? 'btn-danger' : 'btn-secondary'}
            onClick={() => toggleBlockAisle('AISLE_05')}
            style={{ width: '100%', justifyContent: 'center', fontSize: '11px', padding: '7px' }}
          >
            <AlertOctagon size={14} />
            <span>{isAisle5Blocked ? 'Unblock Aisle 5' : 'Close Aisle 5 (Blocked)'}</span>
          </button>

          {/* Drop Obstacle */}
          <button
            className="btn-secondary"
            onClick={() => addObstacle(-3, 0)}
            style={{ width: '100%', justifyContent: 'center', fontSize: '11px', padding: '7px' }}
          >
            <PlusCircle size={14} />
            <span>Place Staged Obstacle</span>
          </button>
        </div>
      </div>

      {/* 4. Digital Twin Modes */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={14} /> VIEW MODES
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          {[
            { id: 'standard', label: 'Digital Twin' },
            { id: 'heatmap', label: 'Traffic Heatmap' },
            { id: 'routes', label: 'Routes Only' },
            { id: 'safety', label: 'Safety Zones' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              style={{
                padding: '5px 6px',
                background: viewMode === mode.id ? 'rgba(0, 255, 136, 0.18)' : 'rgba(255,255,255,0.04)',
                border: '1px solid',
                borderColor: viewMode === mode.id ? 'var(--green-normal)' : 'rgba(255,255,255,0.08)',
                borderRadius: '6px',
                color: viewMode === mode.id ? 'var(--green-normal)' : 'var(--text-muted)',
                fontSize: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

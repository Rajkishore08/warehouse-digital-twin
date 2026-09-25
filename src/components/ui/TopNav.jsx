import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Zap,
  Package,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Radio,
  BookOpen,
  Layers,
  Sliders,
  Maximize2,
  Minimize2,
  Route,
  Camera,
  ChevronDown
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';

const CAMERA_PRESETS = [
  { id: 'overview', label: 'Overview' },
  { id: 'top_view', label: 'Top View' },
  { id: 'floor_view', label: 'Warehouse Floor' },
  { id: 'aisle_view', label: 'Aisle View' },
  { id: 'packing', label: 'Packing Area' },
  { id: 'charging', label: 'Charging Area' },
  { id: 'receiving', label: 'Receiving Area' },
  { id: 'dispatch', label: 'Dispatch Area' },
];

export function TopNav() {
  const robots = useWarehouseStore(state => state.robots);
  const congestionZones = useWarehouseStore(state => state.congestionZones);
  const chargingStations = useWarehouseStore(state => state.chargingStations);
  const ordersQueue = useWarehouseStore(state => state.ordersQueue);
  const emergencyStop = useWarehouseStore(state => state.emergencyStop);
  const toggleEmergencyStop = useWarehouseStore(state => state.toggleEmergencyStop);
  const aiStatus = useWarehouseStore(state => state.aiStatus);
  const lightingMode = useWarehouseStore(state => state.lightingMode) || 'night';
  const setLightingMode = useWarehouseStore(state => state.setLightingMode);
  const showDataFlow = useWarehouseStore(state => state.showDataFlow);
  const toggleDataFlow = useWarehouseStore(state => state.toggleDataFlow);
  const showPaths = useWarehouseStore(state => state.showPaths);
  const togglePaths = useWarehouseStore(state => state.togglePaths);
  const isCleanView = useWarehouseStore(state => state.isCleanView);
  const toggleCleanView = useWarehouseStore(state => state.toggleCleanView);
  const startDemoMode = useWarehouseStore(state => state.startDemoMode);
  const setLearnModalOpen = useWarehouseStore(state => state.setLearnModalOpen);
  const setArchModalOpen = useWarehouseStore(state => state.setArchModalOpen);
  const setWhatIfModalOpen = useWarehouseStore(state => state.setWhatIfModalOpen);
  const cameraPreset = useWarehouseStore(state => state.cameraPreset);
  const setCameraPreset = useWarehouseStore(state => state.setCameraPreset);

  const [camDropdownOpen, setCamDropdownOpen] = useState(false);

  const activeRobotsCount = robots.filter(r => r.status !== 'charging' && r.status !== 'stopped').length;
  const chargingCount = chargingStations.filter(s => s.status === 'occupied').length;
  const congestedCount = congestionZones.length;

  return (
    <header className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', zIndex: 50 }}>
      {/* Title & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #00f0ff 0%, #0066ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)'
          }}
        >
          <Cpu size={18} color="#060b14" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1 style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '0.6px', color: '#ffffff', margin: 0 }}>
              SMART WAREHOUSE DIGITAL TWIN
            </h1>
            <span className="badge badge-cyan" style={{ fontSize: '9px' }}>
              FLEET AI
            </span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Autonomous Logistics Control</span>
            <span>•</span>
            <span style={{ color: aiStatus === 'OPTIMIZING' ? 'var(--orange-reroute)' : 'var(--green-normal)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: aiStatus === 'OPTIMIZING' ? '#ff7700' : '#00ff88', display: 'inline-block' }}></span>
              AI: {aiStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Center Fleet KPIs (Hidden in Clean View if desired, or compact) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* KPI: Active Robots */}
        <div className="glass-panel" style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)' }}>
          <Activity size={15} color="var(--cyan-bright)" />
          <div>
            <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Robots</div>
            <div style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--cyan-bright)' }}>
              {activeRobotsCount} <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>/{robots.length}</span>
            </div>
          </div>
        </div>

        {/* KPI: Orders Queue */}
        <div className="glass-panel" style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)' }}>
          <Package size={15} color="#c77dff" />
          <div>
            <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Orders</div>
            <div style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
              {ordersQueue.length} <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>jobs</span>
            </div>
          </div>
        </div>

        {/* KPI: Congestion Zones */}
        <div
          className={`glass-panel ${congestedCount > 0 ? 'congested-alert-pulse' : ''}`}
          style={{
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: congestedCount > 0 ? 'rgba(255, 34, 85, 0.15)' : 'rgba(255,255,255,0.03)',
            borderColor: congestedCount > 0 ? 'var(--red-congested)' : 'var(--border-subtle)'
          }}
        >
          <AlertTriangle size={15} color={congestedCount > 0 ? 'var(--red-congested)' : 'var(--green-normal)'} />
          <div>
            <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Bottlenecks</div>
            <div style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: congestedCount > 0 ? 'var(--red-congested)' : 'var(--green-normal)' }}>
              {congestedCount} <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>zones</span>
            </div>
          </div>
        </div>

        {/* KPI: Charging Stations */}
        <div className="glass-panel" style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)' }}>
          <Zap size={15} color="#00f0ff" />
          <div>
            <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Charging</div>
            <div style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
              {chargingCount} <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls: Cameras + Paths + Lighting + Clean View + E-Stop */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Camera Presets Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-secondary"
            onClick={() => setCamDropdownOpen(!camDropdownOpen)}
            style={{ fontSize: '11px', padding: '5px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Camera size={13} color="var(--cyan-bright)" />
            <span>Cam: {cameraPreset.replace('_', ' ').toUpperCase()}</span>
            <ChevronDown size={12} />
          </button>

          {camDropdownOpen && (
            <div
              className="glass-panel-elevated"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '180px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                zIndex: 100,
                background: 'rgba(8, 14, 26, 0.96)'
              }}
            >
              {CAMERA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setCameraPreset(preset.id);
                    setCamDropdownOpen(false);
                  }}
                  style={{
                    padding: '6px 10px',
                    textAlign: 'left',
                    background: cameraPreset === preset.id ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    color: cameraPreset === preset.id ? 'var(--cyan-bright)' : 'var(--text-main)',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Show Paths Toggle */}
        <button
          className="btn-secondary"
          onClick={togglePaths}
          title="Toggle Navigation Graph Network"
          style={{
            fontSize: '11px',
            padding: '5px 8px',
            borderColor: showPaths ? 'var(--cyan-bright)' : 'rgba(255,255,255,0.1)',
            color: showPaths ? 'var(--cyan-bright)' : 'var(--text-muted)'
          }}
        >
          <Route size={13} />
          <span>Paths</span>
        </button>

        {/* Day / Evening / Night Toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '2px' }}>
          <button
            onClick={() => setLightingMode('day')}
            title="Day Shift Mode"
            style={{
              background: lightingMode === 'day' ? 'var(--cyan-bright)' : 'transparent',
              color: lightingMode === 'day' ? '#060b14' : 'var(--text-muted)',
              border: 'none',
              padding: '3px 5px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Sun size={12} />
          </button>
          <button
            onClick={() => setLightingMode('night')}
            title="Night Shift Mode"
            style={{
              background: lightingMode === 'night' ? '#0066ff' : 'transparent',
              color: lightingMode === 'night' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              padding: '3px 5px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Moon size={12} />
          </button>
        </div>

        {/* Clean View / Presentation View Toggle */}
        <button
          className={isCleanView ? 'btn-primary' : 'btn-secondary'}
          onClick={toggleCleanView}
          title="Toggle Fullscreen Clean Presentation View"
          style={{ fontSize: '11px', padding: '5px 8px' }}
        >
          {isCleanView ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          <span>{isCleanView ? 'Exit Clean' : 'Clean View'}</span>
        </button>

        {/* Demo Mode Trigger */}
        <button
          className="btn-warning"
          onClick={startDemoMode}
          title="Launch Guided 12-Step Walkthrough"
          style={{ fontSize: '11px', padding: '5px 10px' }}
        >
          <Sparkles size={13} />
          <span>Demo</span>
        </button>

        {/* Learn & What-If */}
        <button
          className="btn-secondary"
          onClick={() => setLearnModalOpen(true)}
          style={{ fontSize: '11px', padding: '5px 8px' }}
        >
          <BookOpen size={13} />
        </button>

        <button
          className="btn-secondary"
          onClick={() => setWhatIfModalOpen(true)}
          style={{ fontSize: '11px', padding: '5px 8px' }}
        >
          <Sliders size={13} />
        </button>

        {/* Emergency Stop Cutoff */}
        <button
          className={emergencyStop ? 'btn-danger congested-alert-pulse' : 'btn-secondary'}
          onClick={toggleEmergencyStop}
          style={{
            borderColor: emergencyStop ? 'var(--red-congested)' : 'rgba(255, 34, 85, 0.4)',
            color: emergencyStop ? '#ffffff' : '#ff7799',
            fontSize: '11px',
            padding: '5px 10px'
          }}
        >
          <ShieldAlert size={13} color={emergencyStop ? '#ffffff' : '#ff2255'} />
          <span>{emergencyStop ? 'RESUME' : 'E-STOP'}</span>
        </button>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import {
  Bot,
  Battery,
  Gauge,
  MapPin,
  Package,
  Navigation,
  Crosshair,
  Zap,
  Radio,
  Eye,
  Activity,
  ArrowRight,
  Minus,
  Plus,
  Compass
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function RobotPanel() {
  const selectedRobotId = useWarehouseStore(state => state.selectedRobotId);
  const setSelectedRobotId = useWarehouseStore(state => state.setSelectedRobotId);
  const robots = useWarehouseStore(state => state.robots);
  const cameraMode = useWarehouseStore(state => state.cameraMode);
  const enterRobotFollow = useWarehouseStore(state => state.enterRobotFollow);
  const enterRobotPov = useWarehouseStore(state => state.enterRobotPov);
  const exitRobotCam = useWarehouseStore(state => state.exitRobotCam);

  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'sensors'
  const [isMinimized, setIsMinimized] = useState(false);

  const robot = robots.find(r => r.id === selectedRobotId) || robots[0];
  if (!robot) return null;

  const path = robot.path || [];
  const currentIdx = robot.currentWaypointIndex || 0;
  const isFollowing = cameraMode === 'follow';
  const isPov = cameraMode === 'pov';

  let statusBadgeClass = 'badge-green';
  if (robot.status === 'rerouting') statusBadgeClass = 'badge-orange';
  else if (robot.status === 'charging') statusBadgeClass = 'badge-cyan';
  else if (robot.status === 'waiting') statusBadgeClass = 'badge-yellow';
  else if (robot.status === 'stopped' || robot.status === 'obstacle') statusBadgeClass = 'badge-red';

  // Calculate live route progress percentage
  const totalWaypoints = path.length || 1;
  const progressPercent = Math.min(100, Math.round((currentIdx / totalWaypoints) * 100));

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
        <Bot size={18} color="var(--cyan-bright)" />
        <span style={{ fontSize: '12px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
          {robot.id} ({robot.battery.toFixed(0)}%)
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
        width: '340px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'auto',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto'
      }}
    >
      {/* Header with Robot Selector & Minimize */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={18} color="var(--cyan-bright)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              ROBOT {robot.id} <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '500' }}>({robot.name})</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Type: {robot.type}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className={`badge ${statusBadgeClass}`}>
            {robot.status.toUpperCase()}
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

      {/* Fleet quick switch buttons */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
        {robots.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRobotId(r.id)}
            style={{
              padding: '3px 6px',
              background: r.id === robot.id ? 'var(--cyan-bright)' : 'rgba(255,255,255,0.06)',
              color: r.id === robot.id ? '#060b14' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {r.id}
          </button>
        ))}
      </div>

      {/* Camera Action Buttons (Follow vs Robot POV) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <button
          className={isFollowing ? 'btn-primary' : 'btn-secondary'}
          onClick={() => (isFollowing ? exitRobotCam() : enterRobotFollow(robot.id))}
          style={{ fontSize: '11px', padding: '6px 8px', justifyContent: 'center' }}
        >
          <Crosshair size={14} />
          <span>{isFollowing ? 'Unfollow' : 'Follow Robot'}</span>
        </button>

        <button
          className={isPov ? 'btn-warning' : 'btn-secondary'}
          onClick={() => (isPov ? exitRobotCam() : enterRobotPov(robot.id))}
          style={{ fontSize: '11px', padding: '6px 8px', justifyContent: 'center' }}
        >
          <Eye size={14} />
          <span>{isPov ? 'Exit POV' : 'Robot POV'}</span>
        </button>
      </div>

      {/* View Switch: Telemetry vs Sensor Suite */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => setActiveTab('telemetry')}
          style={{
            flex: 1,
            padding: '4px 8px',
            background: activeTab === 'telemetry' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255,255,255,0.04)',
            border: '1px solid',
            borderColor: activeTab === 'telemetry' ? 'var(--cyan-bright)' : 'rgba(255,255,255,0.08)',
            borderRadius: '4px',
            color: activeTab === 'telemetry' ? '#ffffff' : 'var(--text-muted)',
            fontSize: '10px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Live Telemetry
        </button>
        <button
          onClick={() => setActiveTab('sensors')}
          style={{
            flex: 1,
            padding: '4px 8px',
            background: activeTab === 'sensors' ? 'rgba(157, 78, 221, 0.2)' : 'rgba(255,255,255,0.04)',
            border: '1px solid',
            borderColor: activeTab === 'sensors' ? '#9d4edd' : 'rgba(255,255,255,0.08)',
            borderRadius: '4px',
            color: activeTab === 'sensors' ? '#c77dff' : 'var(--text-muted)',
            fontSize: '10px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Sensors & IoT
        </button>
      </div>

      {/* Tab 1: Live Telemetry */}
      {activeTab === 'telemetry' && (
        <>
          {/* Telemetry Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {/* Battery */}
            <div className="glass-panel" style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Battery size={13} /> Battery</span>
                <span style={{ fontWeight: '700', color: robot.battery < 25 ? 'var(--red-congested)' : 'var(--green-normal)', fontFamily: 'var(--font-mono)' }}>
                  {robot.battery.toFixed(0)}%
                </span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${robot.battery}%`,
                    height: '100%',
                    background: robot.battery < 25 ? 'var(--red-congested)' : (robot.battery < 50 ? 'var(--yellow-warn)' : 'var(--green-normal)'),
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Speed */}
            <div className="glass-panel" style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Gauge size={13} /> Speed</span>
                <span style={{ fontWeight: '700', color: 'var(--cyan-bright)', fontFamily: 'var(--font-mono)' }}>
                  {(robot.currentSpeed || 0).toFixed(2)} m/s
                </span>
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>
                Max: {robot.speed} m/s
              </div>
            </div>

            {/* Coordinates */}
            <div className="glass-panel" style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                <MapPin size={13} /> Position
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: '#ffffff', marginTop: '2px' }}>
                X: {robot.x.toFixed(1)} | Z: {robot.z.toFixed(1)}
              </div>
            </div>

            {/* ETA & Distance */}
            <div className="glass-panel" style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                <Compass size={13} /> Distance / ETA
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: '#ffffff', marginTop: '2px' }}>
                {robot.distanceRemaining?.toFixed(1) || '0'}m • {robot.etaSeconds || 0}s
              </div>
            </div>
          </div>

          {/* Active Task Assignment */}
          <div className="glass-panel" style={{ padding: '10px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Navigation size={13} color="var(--cyan-bright)" /> Active Task & Payload
              </span>
              <span style={{
                fontSize: '9px',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '800',
                background: robot.status === 'picking' ? 'rgba(0, 240, 255, 0.2)' : (robot.status === 'dropping' ? 'rgba(255, 170, 0, 0.2)' : (robot.hasBox ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.08)')),
                color: robot.status === 'picking' ? 'var(--cyan-bright)' : (robot.status === 'dropping' ? '#ffaa00' : (robot.hasBox ? '#00ff88' : 'var(--text-muted)'))
              }}>
                {robot.status === 'picking' ? `📥 PICKING ${(robot.liftProgress * 100).toFixed(0)}%` : (robot.status === 'dropping' ? `📤 UNLOADING ${(robot.dropProgress * 100).toFixed(0)}%` : (robot.hasBox ? '📦 LOADED' : '🚚 EMPTY TRANSIT'))}
              </span>
            </div>

            {/* Cargo Box Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', marginBottom: '6px' }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                background: robot.task?.boxColor || '#c19a6b',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: robot.hasBox ? `0 0 8px ${robot.task?.boxColor || '#c19a6b'}` : 'none',
                flexShrink: 0
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {robot.task?.title || 'Warehouse Transport'}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--cyan-bright)', fontFamily: 'var(--font-mono)' }}>
                  {robot.task?.sku || 'SKU-LOGISTICS'} • {robot.load > 0 ? `${robot.load.toFixed(0)} kg payload` : 'No payload'}
                </div>
              </div>
            </div>

            {/* Stage Path: Pick Rack -> Drop Destination */}
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: robot.task?.stage === 'EN_ROUTE_TO_PICK' || robot.status === 'picking' ? 'var(--cyan-bright)' : 'var(--text-muted)' }}>
                Pick: {robot.task?.pickNode?.replace('N_', '') || 'RACK'}
              </span>
              <ArrowRight size={10} color="rgba(255,255,255,0.3)" />
              <span style={{ color: robot.task?.stage === 'EN_ROUTE_TO_DROP' || robot.status === 'dropping' ? '#ffaa00' : 'var(--text-muted)' }}>
                Drop: {robot.task?.targetNode?.replace('N_', '') || 'PACK_A'}
              </span>
            </div>
          </div>

          {/* Route Progress Bar */}
          <div className="glass-panel" style={{ padding: '10px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
              <span>Route Progress</span>
              <span className="mono-text" style={{ color: 'var(--cyan-bright)', fontVariantNumeric: 'tabular-nums' }}>{progressPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--cyan-bright) 0%, var(--green-normal) 100%)'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
              {path.map((node, idx) => {
                const isPassed = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <React.Fragment key={`${node.id || 'N'}_${idx}`}>
                    <span
                      style={{
                        fontSize: '9px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 5px',
                        borderRadius: '4px',
                        background: isCurrent ? 'var(--cyan-bright)' : (isPassed ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255,255,255,0.06)'),
                        color: isCurrent ? '#060b14' : (isPassed ? '#00ff88' : 'var(--text-muted)'),
                        fontWeight: isCurrent ? '800' : '500',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {node.id?.replace('N_', '') || `W${idx}`}
                    </span>
                    {idx < path.length - 1 && <ArrowRight size={10} color="rgba(255,255,255,0.2)" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Tab 2: Sensors & IoT */}
      {activeTab === 'sensors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { name: '360° LiDAR Scanner', status: 'ACTIVE', rate: '25,000 pts/s' },
            { name: 'RGB-D Depth Camera', status: 'ACTIVE', rate: '60 FPS @ 1080p' },
            { name: '6-DOF IMU (Gyro/Acc)', status: 'ACTIVE', rate: '200 Hz Sampling' },
            { name: 'Optical Wheel Encoders', status: 'ACTIVE', rate: '2,048 PPR Dual' },
            { name: 'RFID Pallet Tag Scanner', status: 'READY', rate: 'EPC Gen2 UHF' },
            { name: 'Battery Thermal & Bus', status: 'NORMAL', rate: '31.4°C • 48.2V DC' }
          ].map((sensor, idx) => (
            <div
              key={idx}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>
                  {sensor.name}
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                  {sensor.rate}
                </div>
              </div>
              <span className="badge badge-green" style={{ fontSize: '9px' }}>
                {sensor.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

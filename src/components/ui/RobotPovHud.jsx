import React from 'react';
import {
  Eye,
  LogOut,
  Gauge,
  Battery,
  Navigation,
  Radio,
  MapPin,
  Bot
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function RobotPovHud() {
  const cameraMode = useWarehouseStore(state => state.cameraMode);
  const selectedRobotId = useWarehouseStore(state => state.selectedRobotId);
  const robots = useWarehouseStore(state => state.robots);
  const exitRobotCam = useWarehouseStore(state => state.exitRobotCam);

  if (cameraMode !== 'pov') return null;

  const robot = robots.find(r => r.id === selectedRobotId) || robots[0];
  if (!robot) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 45,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px'
      }}
    >
      {/* Top Bar with POV Badge & Exit Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left Telemetry HUD Badge */}
        <div
          className="glass-panel-elevated hud-border-bracket"
          style={{
            padding: '12px 18px',
            background: 'rgba(6, 12, 24, 0.85)',
            borderColor: 'var(--cyan-bright)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.35)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={20} color="var(--cyan-bright)" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                ROBOT POV: {robot.id} <span style={{ color: 'var(--cyan-bright)', fontSize: '11px' }}>({robot.type})</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Heading: {((robot.rotation * 180) / Math.PI).toFixed(0)}° • Task: {robot.task?.title}
              </div>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)' }} />

          {/* Speed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gauge size={16} color="var(--cyan-bright)" />
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>SPEED</div>
              <div className="mono-text" style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
                {(robot.currentSpeed || 0).toFixed(2)} m/s
              </div>
            </div>
          </div>

          {/* Battery */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Battery size={16} color={robot.battery < 25 ? 'var(--red-congested)' : 'var(--green-normal)'} />
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>BATTERY</div>
              <div className="mono-text" style={{ fontSize: '13px', fontWeight: '800', color: robot.battery < 25 ? 'var(--red-congested)' : 'var(--green-normal)' }}>
                {robot.battery.toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Destination & Distance */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation size={16} color="#c77dff" />
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>DESTINATION</div>
              <div className="mono-text" style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
                {robot.task?.targetNode?.replace('N_', '') || 'AUTO'} ({robot.distanceRemaining?.toFixed(1) || '0'}m)
              </div>
            </div>
          </div>
        </div>

        {/* Right Exit Button */}
        <button
          className="btn-danger"
          onClick={exitRobotCam}
          style={{
            pointerEvents: 'auto',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '700',
            boxShadow: '0 0 20px rgba(255, 34, 85, 0.6)'
          }}
        >
          <LogOut size={16} />
          <span>EXIT ROBOT POV</span>
        </button>
      </div>

      {/* Bottom Minimal Sensor Health Diagnostics Strip */}
      <div
        className="glass-panel"
        style={{
          alignSelf: 'center',
          padding: '6px 16px',
          background: 'rgba(6, 12, 24, 0.75)',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)'
        }}
      >
        <span style={{ color: 'var(--green-normal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff88' }} />
          LiDAR 360° ACTIVE
        </span>
        <span style={{ color: 'var(--green-normal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff88' }} />
          RGB-D DEPTH ACTIVE
        </span>
        <span style={{ color: 'var(--green-normal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff88' }} />
          6-DOF IMU ACTIVE
        </span>
        <span style={{ color: 'var(--green-normal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff88' }} />
          WHEEL ENCODERS 2048 PPR
        </span>
      </div>
    </div>
  );
}

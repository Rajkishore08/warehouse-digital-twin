import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ROBOT_TYPES } from '../../data/robotConfig';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function Robot({ robot, isSelected }) {
  const lidarRef = useRef();
  const strobeRef = useRef();
  const wheelRef = useRef();
  const pulseRef = useRef();
  const setSelectedRobotId = useWarehouseStore(state => state.setSelectedRobotId);

  // Animate spinning LiDAR sensor and warning strobes
  useFrame(({ clock }, delta) => {
    if (lidarRef.current) {
      lidarRef.current.rotation.y += delta * 14;
    }
    if (strobeRef.current) {
      strobeRef.current.rotation.y += delta * 10;
    }
    if (wheelRef.current && (robot.currentSpeed || 0) > 0.1) {
      wheelRef.current.rotation.x += delta * (robot.currentSpeed || 1) * 8;
    }
    if (pulseRef.current) {
      pulseRef.current.rotation.z += delta * 1.5;
    }
  });

  const typeConfig = ROBOT_TYPES[robot.type] || ROBOT_TYPES.AMR;
  const { width, length, height } = typeConfig.dimensions;

  const isPicking = robot.status === 'picking';
  const isDropping = robot.status === 'dropping';
  const hasCargo = robot.hasBox || isPicking || isDropping;
  const boxColor = robot.task?.boxColor || '#c68b59';
  const liftP = robot.liftProgress ?? (robot.hasBox ? 1.0 : 0.0);
  const dropP = robot.dropProgress ?? 0.0;

  // Status-driven glow colors
  let statusColor = '#00ff88'; // green = moving
  if (robot.status === 'rerouting') statusColor = '#ff7700'; // orange = rerouting
  else if (robot.status === 'charging') statusColor = '#00f0ff'; // cyan = charging
  else if (robot.status === 'waiting') statusColor = '#ffcc00'; // yellow = waiting
  else if (robot.status === 'obstacle' || robot.status === 'stopped') statusColor = '#ff2255'; // red = stopped
  else if (isPicking) statusColor = '#ffaa00'; // amber = picking
  else if (isDropping) statusColor = '#00e5ff'; // cyan = dropping
  else if (robot.status === 'idle') statusColor = '#8fa3bf'; // grey

  return (
    <group
      position={[robot.x, 0, robot.z]}
      rotation={[0, robot.rotation || 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedRobotId(isSelected ? null : robot.id);
      }}
    >
      {/* 1. Selection & LiDAR Ground Scan Projection */}
      <mesh
        ref={pulseRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.045, 0]}
      >
        <ringGeometry args={[length * 0.7, length * 0.78, 32]} />
        <meshBasicMaterial
          color={isSelected ? '#00f0ff' : statusColor}
          transparent
          opacity={isSelected ? 0.95 : 0.35}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Underglow LED Ground Lighting */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[width * 1.4, length * 1.4]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* 2. Visual Laser Scanner Projection during Picking Operation */}
      {isPicking && (
        <group position={[0, height + 0.3, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[width * 0.6, 0.2, 0]}>
            <planeGeometry args={[0.08, 2.2]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
          <pointLight distance={4} intensity={2.5} color="#00ff88" />
        </group>
      )}

      {/* 3. Procedural Robot Chassis Body according to Industrial Model */}
      
      {/* MODEL: AMR (Autonomous Mobile Robot) */}
      {robot.type === 'AMR' && (
        <group position={[0, height / 2, 0]}>
          {/* Main sleek chassis body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height * 0.7, length]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Upper tech deck plate with lifting platform */}
          <mesh position={[0, height * 0.38 + (isPicking ? liftP * 0.05 : 0), 0]}>
            <boxGeometry args={[width * 0.85, 0.05, length * 0.85]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* LED Perimeter status ring */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width + 0.04, 0.06, length + 0.04]} />
            <meshBasicMaterial color={statusColor} />
          </mesh>
          {/* Spinning LiDAR Puck */}
          <group ref={lidarRef} position={[0, height * 0.55, -length * 0.25]}>
            <mesh>
              <cylinderGeometry args={[0.15, 0.15, 0.16, 16]} />
              <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.14]}>
              <boxGeometry args={[0.04, 0.06, 0.08]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
          </group>
          
          {/* Dynamic Cargo Payload Box */}
          {hasCargo && (
            <group
              position={[
                0,
                height * 0.55 + (isPicking ? liftP * 0.2 : (isDropping ? (1 - dropP) * 0.2 : 0.2)),
                length * 0.1 + (isDropping ? dropP * 0.7 : 0)
              ]}
              scale={isDropping ? Math.max(0.05, 1 - dropP * 0.9) : (isPicking ? Math.min(1.0, 0.3 + liftP * 0.7) : 1.0)}
            >
              {/* Main Carton Body */}
              <mesh castShadow>
                <boxGeometry args={[0.72, 0.45, 0.65]} />
                <meshStandardMaterial color={boxColor} roughness={0.75} />
              </mesh>
              {/* Sealing Tape on Top */}
              <mesh position={[0, 0.23, 0]}>
                <boxGeometry args={[0.12, 0.01, 0.66]} />
                <meshStandardMaterial color="#8b5a2b" roughness={0.4} />
              </mesh>
              {/* White Shipping Label & Barcode */}
              <mesh position={[0.365, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[0.25, 0.18]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0.368, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[0.2, 0.06]} />
                <meshBasicMaterial color="#111111" />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* MODEL: AGV (Automated Guided Vehicle) */}
      {robot.type === 'AGV' && (
        <group position={[0, height / 2, 0]}>
          {/* Heavy rugged industrial chassis */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, length]} />
            <meshStandardMaterial color="#182234" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Front safety bumper with hazard warning stripes */}
          <mesh position={[0, -height * 0.2, length * 0.52]}>
            <boxGeometry args={[width * 1.05, height * 0.4, 0.1]} />
            <meshStandardMaterial color="#ffaa00" roughness={0.4} />
          </mesh>
          {/* Corner warning beacons */}
          {[[-width/2, length/2], [width/2, length/2], [-width/2, -length/2], [width/2, -length/2]].map(([cx, cz], i) => (
            <mesh key={i} position={[cx * 0.9, height * 0.52, cz * 0.9]}>
              <cylinderGeometry args={[0.06, 0.06, 0.12]} />
              <meshBasicMaterial color={statusColor} />
            </mesh>
          ))}
          {/* Top load plate */}
          <mesh position={[0, height * 0.55, 0]}>
            <boxGeometry args={[width * 0.9, 0.1, length * 0.9]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Dynamic Cargo Tote / Heavy Box */}
          {hasCargo && (
            <group
              position={[
                0,
                height * 0.65 + (isPicking ? liftP * 0.25 : (isDropping ? (1 - dropP) * 0.25 : 0.25)),
                isDropping ? dropP * 0.8 : 0
              ]}
              scale={isDropping ? Math.max(0.05, 1 - dropP * 0.9) : (isPicking ? Math.min(1.0, 0.3 + liftP * 0.7) : 1.0)}
            >
              <mesh castShadow>
                <boxGeometry args={[0.95, 0.5, 1.1]} />
                <meshStandardMaterial color={boxColor} roughness={0.6} metalness={0.1} />
              </mesh>
              {/* Shipping Label on front */}
              <mesh position={[0, 0, 0.56]}>
                <planeGeometry args={[0.3, 0.2]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0, 0, 0.562]}>
                <planeGeometry args={[0.24, 0.08]} />
                <meshBasicMaterial color="#111111" />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* MODEL: FORKLIFT (Autonomous High-Lift Forklift with Animated Mast) */}
      {robot.type === 'FORKLIFT' && (
        <group position={[0, 0, 0]}>
          {/* Counterbalanced main vehicle chassis */}
          <mesh position={[0, 0.45, -0.2]} castShadow>
            <boxGeometry args={[width, 0.7, 1.4]} />
            <meshStandardMaterial color="#ff9900" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Heavy rear counterweight */}
          <mesh position={[0, 0.5, -0.85]}>
            <boxGeometry args={[width * 0.95, 0.8, 0.4]} />
            <meshStandardMaterial color="#222b38" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Operator safety roll cage / cabin frame */}
          <mesh position={[0, 1.35, -0.3]}>
            <boxGeometry args={[0.9, 1.1, 0.9]} />
            <meshStandardMaterial color="#111a26" wireframe={true} />
          </mesh>
          {/* Roof Amber Strobe Beacon */}
          <group ref={strobeRef} position={[0, 1.95, -0.3]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.08, 0.12, 12]} />
              <meshBasicMaterial color="#ffaa00" />
            </mesh>
          </group>
          {/* Vertical Lifting Mast Columns */}
          <group position={[0, 1.1, 0.65]}>
            <mesh position={[-0.35, 0, 0]}>
              <boxGeometry args={[0.08, 2.0, 0.1]} />
              <meshStandardMaterial color="#334155" metalness={0.9} />
            </mesh>
            <mesh position={[0.35, 0, 0]}>
              <boxGeometry args={[0.08, 2.0, 0.1]} />
              <meshStandardMaterial color="#334155" metalness={0.9} />
            </mesh>

            {/* Dynamic Animated Fork Carriage (Raises up the mast during pick!) */}
            <group
              position={[
                0,
                isPicking
                  ? (liftP < 0.5 ? -0.6 + liftP * 2 * 1.3 : -0.6 + (1 - (liftP - 0.5) * 2) * 1.3)
                  : (isDropping ? -0.6 + (1 - dropP) * 0.4 : -0.6),
                0
              ]}
            >
              <mesh position={[0, 0, 0.08]}>
                <boxGeometry args={[0.9, 0.15, 0.08]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
              {/* Left & Right Steel Lifting Forks */}
              <mesh position={[-0.25, -0.1, 0.5]}>
                <boxGeometry args={[0.1, 0.05, 1.0]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh position={[0.25, -0.1, 0.5]}>
                <boxGeometry args={[0.1, 0.05, 1.0]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
              </mesh>

              {/* Heavy Pallet & Cargo Loaded on Forks */}
              {hasCargo && (
                <group
                  position={[0, 0.05, 0.5]}
                  scale={isDropping ? Math.max(0.05, 1 - dropP * 0.85) : 1.0}
                >
                  {/* Wooden Euro Pallet */}
                  <mesh position={[0, 0.05, 0]}>
                    <boxGeometry args={[0.9, 0.1, 0.9]} />
                    <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
                  </mesh>
                  {/* Cargo Crate */}
                  <mesh position={[0, 0.45, 0]} castShadow>
                    <boxGeometry args={[0.8, 0.7, 0.8]} />
                    <meshStandardMaterial color={boxColor} roughness={0.6} />
                  </mesh>
                </group>
              )}
            </group>
          </group>
        </group>
      )}

      {/* MODEL: PALLET ROBOT */}
      {robot.type === 'PALLET_ROBOT' && (
        <group position={[0, height / 2, 0]}>
          {/* Heavy low-profile lift chassis */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height * 0.6, length]} />
            <meshStandardMaterial color="#0b1320" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Hydraulic Turntable Plate */}
          <mesh position={[0, height * 0.35 + (isPicking ? liftP * 0.08 : 0), 0]}>
            <cylinderGeometry args={[width * 0.45, width * 0.45, 0.06, 24]} />
            <meshStandardMaterial color="#ffaa00" metalness={0.7} />
          </mesh>
          {/* Status band */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width + 0.05, 0.08, length + 0.05]} />
            <meshBasicMaterial color={statusColor} />
          </mesh>

          {/* Dynamic Heavy Shrink-Wrapped Pallet Stack */}
          {hasCargo && (
            <group
              position={[
                0,
                height * 0.4 + (isPicking ? liftP * 0.15 : (isDropping ? (1 - dropP) * 0.15 : 0.15)),
                isDropping ? dropP * 0.7 : 0
              ]}
              scale={isDropping ? Math.max(0.05, 1 - dropP * 0.9) : (isPicking ? Math.min(1.0, 0.3 + liftP * 0.7) : 1.0)}
            >
              <mesh position={[0, 0.06, 0]}>
                <boxGeometry args={[1.2, 0.12, 1.4]} />
                <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
              </mesh>
              <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[1.05, 0.75, 1.25]} />
                <meshStandardMaterial color={boxColor} roughness={0.5} metalness={0.1} />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* MODEL: SORTING ROBOT */}
      {robot.type === 'SORTING_ROBOT' && (
        <group position={[0, height / 2, 0]}>
          {/* Compact rapid pod */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[width * 0.55, width * 0.5, height, 24]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.15} />
          </mesh>
          {/* Top sorting conveyor tray (tilts sideways when dropping!) */}
          <group
            position={[0, height * 0.55, 0]}
            rotation={[0.08, 0, isDropping ? dropP * 0.4 : 0]}
          >
            <mesh>
              <boxGeometry args={[width * 0.85, 0.08, length * 0.85]} />
              <meshStandardMaterial color="#9d4edd" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Express Parcel on Tray */}
            {hasCargo && (
              <group
                position={[
                  isDropping ? dropP * 0.6 : 0,
                  0.15,
                  isDropping ? dropP * 0.4 : 0
                ]}
                scale={isDropping ? Math.max(0.05, 1 - dropP * 0.85) : (isPicking ? Math.min(1.0, 0.3 + liftP * 0.7) : 1.0)}
              >
                <mesh castShadow>
                  <boxGeometry args={[0.42, 0.22, 0.38]} />
                  <meshStandardMaterial color="#e76f51" roughness={0.7} />
                </mesh>
                {/* Courier Shipping Label */}
                <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[0.2, 0.14]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
            )}
          </group>
          {/* Status Light Ring */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[width * 0.56, width * 0.56, 0.05, 24]} />
            <meshBasicMaterial color={statusColor} />
          </mesh>
        </group>
      )}

      {/* 4. Floating 3D Telemetry HUD Tag with Live Pick/Drop Status */}
      <group position={[0, robot.type === 'FORKLIFT' ? 2.6 : height + 1.15, 0]}>
        <Html position={[0, 0, 0]} center distanceFactor={22} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: isSelected ? 'rgba(0, 240, 255, 0.28)' : 'rgba(7, 11, 20, 0.88)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${isSelected ? '#00f0ff' : statusColor}`,
              borderRadius: '6px',
              padding: '2px 8px',
              boxShadow: isSelected ? '0 0 16px rgba(0, 240, 255, 0.5)' : '0 2px 8px rgba(0,0,0,0.6)',
              transform: 'scale(0.85)',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: '700',
                  fontSize: '11px',
                  color: isSelected ? '#00f0ff' : '#ffffff'
                }}
              >
                {robot.id}
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: robot.battery < 25 ? '#ff2255' : (robot.battery < 50 ? '#ffaa00' : '#00ff88'),
                  fontWeight: '600'
                }}
              >
                {robot.battery.toFixed(0)}%
              </span>
            </div>
            
            {/* Live Operational Stage Label */}
            {isPicking && (
              <span style={{ fontSize: '8px', color: '#ffaa00', fontWeight: '800', letterSpacing: '0.5px' }}>
                📥 PICKING ({Math.round(liftP * 100)}%)
              </span>
            )}
            {isDropping && (
              <span style={{ fontSize: '8px', color: '#00e5ff', fontWeight: '800', letterSpacing: '0.5px' }}>
                📤 UNLOADING ({Math.round(dropP * 100)}%)
              </span>
            )}
            {!isPicking && !isDropping && hasCargo && (
              <span style={{ fontSize: '8px', color: '#00ff88', fontWeight: '700', letterSpacing: '0.5px' }}>
                📦 {robot.task?.sku?.split(' ')[0] || 'LOADED'} ({robot.load || 0}kg)
              </span>
            )}
            {!isPicking && !isDropping && !hasCargo && robot.status === 'moving' && (
              <span style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>
                🚚 TO PICK
              </span>
            )}
            {robot.status === 'rerouting' && (
              <span style={{ fontSize: '8px', color: '#ff7700', fontWeight: '700', letterSpacing: '0.5px' }}>
                REROUTED
              </span>
            )}
            {robot.status === 'charging' && (
              <span style={{ fontSize: '8px', color: '#00f0ff', fontWeight: '700', letterSpacing: '0.5px' }}>
                ⚡ CHARGING
              </span>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

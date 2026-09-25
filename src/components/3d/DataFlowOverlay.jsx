import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useWarehouseStore } from '../../store/useWarehouseStore';

const EDGE_GATEWAYS = [
  { id: 'GW_NORTH', name: 'Edge Gateway #01 (Inbound)', x: -12, y: 7.8, z: -18 },
  { id: 'GW_CENTRAL', name: 'Edge Gateway #02 (Mid Matrix)', x: 0, y: 7.8, z: 0 },
  { id: 'GW_SOUTH', name: 'Edge Gateway #03 (Outbound)', x: 12, y: 7.8, z: 18 },
  { id: 'GW_CHG', name: 'Edge Gateway #04 (Charging Spine)', x: -26, y: 7.8, z: 0 },
];

export function DataFlowOverlay() {
  const robots = useWarehouseStore(state => state.robots);
  const showDataFlow = useWarehouseStore(state => state.showDataFlow);
  const dataFlowPulseRef = useRef();

  useFrame(({ clock }) => {
    if (dataFlowPulseRef.current) {
      dataFlowPulseRef.current.rotation.y = clock.getElapsedTime() * 2;
    }
  });

  if (!showDataFlow) return null;

  return (
    <group>
      {/* 1. Overhead Industrial Edge Gateway Antennas */}
      {EDGE_GATEWAYS.map(gw => (
        <group key={gw.id} position={[gw.x, gw.y, gw.z]}>
          {/* Gateway Dome Enclosure */}
          <mesh>
            <cylinderGeometry args={[0.35, 0.45, 0.4, 16]} />
            <meshStandardMaterial color="#0c182b" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Cyan Transceiver Pulsing Ring */}
          <mesh position={[0, -0.2, 0]}>
            <torusGeometry args={[0.4, 0.03, 8, 24]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          {/* Status Antenna Whip */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6]} />
            <meshStandardMaterial color="#ffffff" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color="#00ff88" />
          </mesh>

          {/* 3D Label */}
          <Text
            position={[0, -0.6, 0]}
            fontSize={0.28}
            color="#00f0ff"
            anchorX="center"
            anchorY="middle"
          >
            {gw.name}
          </Text>
        </group>
      ))}

      {/* 2. Real-Time Telemetry Laser Data Streams (Robots -> Nearest Edge Gateway) */}
      {robots.slice(0, 10).map(robot => {
        if (robot.status === 'charging' || robot.status === 'stopped') return null;

        // Find nearest Edge Gateway
        let nearestGw = EDGE_GATEWAYS[0];
        let minDist = Infinity;
        EDGE_GATEWAYS.forEach(gw => {
          const dx = gw.x - robot.x;
          const dz = gw.z - robot.z;
          const d = dx * dx + dz * dz;
          if (d < minDist) {
            minDist = d;
            nearestGw = gw;
          }
        });

        const points = [
          new THREE.Vector3(robot.x, 0.8, robot.z),
          new THREE.Vector3(nearestGw.x, nearestGw.y - 0.2, nearestGw.z)
        ];

        return (
          <group key={`stream_${robot.id}`}>
            {/* Wireless Stream Line */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color="#00f0ff"
                transparent
                opacity={0.35}
                linewidth={1}
              />
            </line>
          </group>
        );
      })}
    </group>
  );
}

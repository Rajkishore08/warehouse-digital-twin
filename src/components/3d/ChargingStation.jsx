import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function ChargingStation() {
  const chargingStations = useWarehouseStore(state => state.chargingStations);
  const robots = useWarehouseStore(state => state.robots);

  const arcRef = useRef();

  useFrame(({ clock }) => {
    if (arcRef.current) {
      arcRef.current.rotation.y = clock.getElapsedTime() * 3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {chargingStations.map((station) => {
        // Check if any robot is physically at this station
        const dockedRobot = robots.find(r => r.status === 'charging' && Math.abs(r.x - station.x) < 1.5 && Math.abs(r.z - station.z) < 1.5);
        const isOccupied = !!dockedRobot || station.status === 'occupied';
        const isOffline = station.status === 'offline';

        let padColor = '#00f0ff'; // cyan
        let statusText = 'AVAILABLE';
        if (isOffline) {
          padColor = '#ff2255';
          statusText = 'OFFLINE';
        } else if (isOccupied) {
          padColor = '#00ff88';
          statusText = `CHARGING (${dockedRobot?.id || 'R13'})`;
        }

        return (
          <group key={station.id} position={[station.x, 0, station.z]}>
            {/* Induction Charging Floor Pad */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
              <planeGeometry args={[2.0, 2.0]} />
              <meshStandardMaterial
                color="#0c182b"
                roughness={0.4}
                metalness={0.8}
                emissive={padColor}
                emissiveIntensity={0.25}
              />
            </mesh>

            {/* Glowing Pad Coil Rings */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[0.5, 0.7, 32]} />
              <meshBasicMaterial color={padColor} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[0.2, 0.35, 32]} />
              <meshBasicMaterial color={padColor} />
            </mesh>

            {/* Vertical Power Tower Terminal */}
            <group position={[-1.2, 1.2, 0]}>
              {/* Pillar Body */}
              <mesh castShadow>
                <boxGeometry args={[0.3, 2.4, 0.6]} />
                <meshStandardMaterial color="#08101e" metalness={0.85} roughness={0.2} />
              </mesh>
              {/* LED Charging Power Gauge */}
              <mesh position={[0.16, 0.2, 0]}>
                <planeGeometry args={[0.05, 1.4]} />
                <meshBasicMaterial color={padColor} />
              </mesh>
              {/* Status Beacon on top */}
              <mesh position={[0, 1.25, 0]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color={padColor} />
              </mesh>
            </group>

            {/* Dynamic Energy Charging Arcs when robot is docked */}
            {isOccupied && (
              <group position={[0, 0.4, 0]} ref={arcRef}>
                <mesh>
                  <torusGeometry args={[0.6, 0.02, 8, 24]} />
                  <meshBasicMaterial color="#00ffff" transparent opacity={0.7} />
                </mesh>
              </group>
            )}

            {/* 3D Label */}
            <Text
              position={[-1.2, 2.7, 0]}
              rotation={[0, Math.PI / 2, 0]}
              fontSize={0.28}
              color={padColor}
              anchorX="center"
              anchorY="middle"
            >
              {station.name.toUpperCase()}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

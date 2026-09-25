import React from 'react';
import { Text } from '@react-three/drei';
import { WAREHOUSE_CONFIG } from '../../data/warehouseConfig';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function SafetyZones() {
  const viewMode = useWarehouseStore(state => state.viewMode);
  const isSafetyView = viewMode === 'safety' || viewMode === 'standard';

  const { pedestrianCrossings, restrictedZone } = {
    pedestrianCrossings: WAREHOUSE_CONFIG.zones.safetyPedestrian.zones,
    restrictedZone: WAREHOUSE_CONFIG.zones.restrictedZone
  };

  return (
    <group position={[0, 0.007, 0]}>
      {/* 1. Pedestrian Safety Crosswalks (Zebra Stripes) */}
      {pedestrianCrossings.map((cross) => (
        <group key={cross.id} position={[cross.x, 0, cross.z]}>
          {/* Base strip */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[cross.width, cross.depth]} />
            <meshBasicMaterial color="#1a2942" transparent opacity={0.5} />
          </mesh>

          {/* Yellow Hazard Zebra Crossings */}
          {Array.from({ length: Math.floor(cross.width / 2.5) }).map((_, i) => {
            const xOffset = -cross.width / 2 + (i + 0.5) * 2.5;
            return (
              <mesh key={i} position={[xOffset, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.2, cross.depth * 0.85]} />
                <meshBasicMaterial color="#ffcc00" transparent opacity={0.4} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* 2. Restricted HazMat / Maintenance Area */}
      <group position={[restrictedZone.x, 0, restrictedZone.z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[restrictedZone.width, restrictedZone.depth]} />
          <meshBasicMaterial color="#ff5500" transparent opacity={0.15} />
        </mesh>
        {/* Perimeter safety border */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
          <ringGeometry args={[restrictedZone.depth * 0.45, restrictedZone.depth * 0.48, 4, 1, Math.PI / 4]} />
          <meshBasicMaterial color="#ff5500" transparent opacity={0.6} />
        </mesh>

        <Text
          position={[0, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          fontSize={0.7}
          color="#ffaa00"
          anchorX="center"
          anchorY="middle"
        >
          ⛔ RESTRICTED ZONE: NO ROBOT ENTRY
        </Text>
      </group>
    </group>
  );
}

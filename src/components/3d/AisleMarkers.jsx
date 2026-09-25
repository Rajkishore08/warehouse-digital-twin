import React from 'react';
import { Text } from '@react-three/drei';
import { WAREHOUSE_CONFIG } from '../../data/warehouseConfig';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function AisleMarkers() {
  const aisleMetrics = useWarehouseStore(state => state.aisleMetrics);
  const selectedAisleId = useWarehouseStore(state => state.selectedAisleId);
  const setSelectedAisleId = useWarehouseStore(state => state.setSelectedAisleId);
  const toggleBlockAisle = useWarehouseStore(state => state.toggleBlockAisle);

  return (
    <group position={[0, 6.8, 0]}>
      {WAREHOUSE_CONFIG.aisles.map((aisle, idx) => {
        const metric = aisleMetrics.find(m => m.id === aisle.id);
        const isSelected = selectedAisleId === aisle.id;
        const status = metric?.status || 'normal';
        const density = metric?.trafficDensity || 0;
        const robotCount = metric?.robotCount || 0;

        let statusColor = '#00ff88'; // green
        let statusText = 'NORMAL';
        if (status === 'blocked') {
          statusColor = '#ff2255';
          statusText = 'BLOCKED';
        } else if (status === 'congested') {
          statusColor = '#ff2255';
          statusText = `CONGESTED (${robotCount})`;
        } else if (status === 'moderate') {
          statusColor = '#ffaa00';
          statusText = `MODERATE (${robotCount})`;
        }

        return (
          <group
            key={aisle.id}
            position={[aisle.x, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAisleId(isSelected ? null : aisle.id);
            }}
          >
            {/* Overhead Steel Truss Gantry Span */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[3.6, 0.25, 0.25]} />
              <meshStandardMaterial color="#0b172a" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Glowing Digital Aisle Signboard */}
            <mesh position={[0, -0.6, 0]}>
              <boxGeometry args={[2.8, 0.9, 0.1]} />
              <meshStandardMaterial
                color="#070d18"
                metalness={0.5}
                roughness={0.4}
                emissive={isSelected ? '#00f0ff' : '#001a33'}
                emissiveIntensity={isSelected ? 0.4 : 0.1}
              />
            </mesh>

            {/* LED Status Light Bar */}
            <mesh position={[0, -0.2, 0.06]}>
              <boxGeometry args={[2.6, 0.08, 0.04]} />
              <meshBasicMaterial color={statusColor} />
            </mesh>

            {/* Aisle Title (e.g. AISLE 05) */}
            <Text
              position={[0, -0.52, 0.06]}
              fontSize={0.34}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {`AISLE 0${idx + 1}`}
            </Text>

            {/* Live Traffic Density & Status Badge */}
            <Text
              position={[0, -0.82, 0.06]}
              fontSize={0.22}
              color={statusColor}
              anchorX="center"
              anchorY="middle"
            >
              {statusText}
            </Text>

            {/* North & South Hanger Cables */}
            <mesh position={[0, 0.9, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

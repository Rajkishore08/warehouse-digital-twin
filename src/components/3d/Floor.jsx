import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { WAREHOUSE_CONFIG } from '../../data/warehouseConfig';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function Floor() {
  const { width, length } = WAREHOUSE_CONFIG.dimensions;
  const viewMode = useWarehouseStore(state => state.viewMode);
  const heatmapVisible = useWarehouseStore(state => state.heatmapVisible);
  const aisleMetrics = useWarehouseStore(state => state.aisleMetrics);
  const lightingMode = useWarehouseStore(state => state.lightingMode) || 'night';

  const isDay = lightingMode === 'day';
  const isEvening = lightingMode === 'evening';

  // Custom procedural concrete grid pattern
  const gridTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base concrete dark tone
    ctx.fillStyle = isDay ? '#cbd5e1' : (isEvening ? '#1f293d' : '#0b1220');
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle concrete noise/texture
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const alpha = isDay ? Math.random() * 0.08 : Math.random() * 0.04;
      ctx.fillStyle = isDay ? `rgba(0, 0, 0, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Grid expansion joints
    ctx.strokeStyle = isDay ? 'rgba(30, 41, 59, 0.15)' : 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 1024; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1024);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1024, i);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(12, 9);
    return texture;
  }, [isDay, isEvening]);

  return (
    <group position={[0, 0, 0]}>
      {/* Primary Concrete Warehouse Slab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          map={gridTexture}
          roughness={isDay ? 0.65 : 0.8}
          metalness={isDay ? 0.1 : 0.25}
          color={isDay ? '#e2e8f0' : (isEvening ? '#1a2233' : '#0d1628')}
        />
      </mesh>

      {/* Industrial Safety Perimeter Yellow Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[Math.min(width, length) * 0.48, Math.min(width, length) * 0.485, 4, 1, Math.PI / 4]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.6} />
      </mesh>

      {/* Main East-West Navigation Highway Lines (North, Mid Crossover, South) */}
      {[-18, 0, 18].map((zPos, idx) => {
        const isMidCrossover = zPos === 0;
        return (
          <group key={`hwy_${idx}`} position={[0, 0.006, zPos]}>
            {/* Crossover highlighted asphalt zone for middle passage */}
            {isMidCrossover && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
                <planeGeometry args={[50, 4.8]} />
                <meshBasicMaterial color="#00e5ff" transparent opacity={0.04} />
              </mesh>
            )}

            {/* Highway Centerline */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[52, 0.12]} />
              <meshBasicMaterial color="#00e5ff" transparent opacity={0.35} />
            </mesh>

            {/* Boundary Safety Lines */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, isMidCrossover ? 2.2 : 1.2]}>
              <planeGeometry args={[52, 0.06]} />
              <meshBasicMaterial color="#ffcc00" transparent opacity={isMidCrossover ? 0.5 : 0.25} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, isMidCrossover ? -2.2 : -1.2]}>
              <planeGeometry args={[52, 0.06]} />
              <meshBasicMaterial color="#ffcc00" transparent opacity={isMidCrossover ? 0.5 : 0.25} />
            </mesh>

            {/* Text badge for Middle Crossway */}
            {isMidCrossover && (
              <Text
                position={[0, 0.012, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.85}
                color="#00e5ff"
                anchorX="center"
                anchorY="middle"
              >
                ◀ CENTRAL CROSS-AISLE CORRIDOR (CROSSOVER AISLES 1—8) ▶
              </Text>
            )}
          </group>
        );
      })}

      {/* Longitudinal Aisle Lane Markings */}
      {WAREHOUSE_CONFIG.aisles.map(aisle => {
        const metric = aisleMetrics.find(m => m.id === aisle.id);
        const isCongested = metric?.status === 'congested';
        const isBlocked = metric?.status === 'blocked';

        let laneColor = '#00f0ff';
        let laneOpacity = 0.25;
        if (isBlocked) {
          laneColor = '#ff2255';
          laneOpacity = 0.6;
        } else if (isCongested) {
          laneColor = '#ff5500';
          laneOpacity = 0.55;
        }

        return (
          <group key={aisle.id} position={[aisle.x, 0.008, 0]}>
            {/* Center Guide Line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.1, 30]} />
              <meshBasicMaterial color={laneColor} transparent opacity={laneOpacity} />
            </mesh>

            {/* Left & Right Safety Limits */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.4, 0, 0]}>
              <planeGeometry args={[0.06, 30]} />
              <meshBasicMaterial color="#ffbb00" transparent opacity={0.2} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.4, 0, 0]}>
              <planeGeometry args={[0.06, 30]} />
              <meshBasicMaterial color="#ffbb00" transparent opacity={0.2} />
            </mesh>

            {/* Aisle Floor Text Badge */}
            <Text
              position={[0, 0.01, -16]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={1.1}
              color={isCongested ? '#ff2255' : '#00f0ff'}
              anchorX="center"
              anchorY="middle"
            >
              {aisle.name.toUpperCase()}
            </Text>
          </group>
        );
      })}

      {/* Zone Floor Labels */}
      <Text
        position={[0, 0.015, -24]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.8}
        color="#00a8ff"
        anchorX="center"
        anchorY="middle"
      >
        ▼ INBOUND RECEIVING DOCKS (D1 - D3) ▼
      </Text>

      <Text
        position={[-10, 0.015, 23.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.5}
        color="#c77dff"
        anchorX="center"
        anchorY="middle"
      >
        ■ PACKING STATIONS (A - C)
      </Text>

      <Text
        position={[14, 0.015, 23.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.5}
        color="#00e676"
        anchorX="center"
        anchorY="middle"
      >
        ▲ OUTBOUND DISPATCH (BAYS 1 - 3)
      </Text>

      <Text
        position={[-29, 0.015, -10.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={1.2}
        color="#00f0ff"
        anchorX="center"
        anchorY="middle"
      >
        ⚡ AUTONOMOUS CHARGING HUB (C1 - C5)
      </Text>
    </group>
  );
}

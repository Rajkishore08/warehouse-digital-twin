import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { WAREHOUSE_CONFIG } from '../../data/warehouseConfig';
import { useWarehouseStore } from '../../store/useWarehouseStore';

// Palette of realistic warehouse cargo carton and container colors
const CARGO_COLORS = [
  '#d4a373', // Craft cardboard
  '#c68b59', // Dark cardboard
  '#1d3557', // Navy tote
  '#457b9d', // Blue container
  '#2a9d8f', // Teal box
  '#e76f51', // Orange bin
  '#4a5568', // Industrial gray
];

export function Racks() {
  const selectedRackId = useWarehouseStore(state => state.selectedRackId);
  const setSelectedRackId = useWarehouseStore(state => state.setSelectedRackId);
  const viewMode = useWarehouseStore(state => state.viewMode);

  // Generate boxes placement across racks
  const { rackStructures, cargoBoxes } = useMemo(() => {
    const racks = [];
    const boxes = [];

    WAREHOUSE_CONFIG.racks.forEach((rack) => {
      const { id, x, z, length, height, levels, bays, label } = rack;
      const baySpacing = length / bays;
      const levelHeight = height / levels;

      racks.push({
        id,
        x,
        z,
        length,
        height,
        levels,
        bays,
        label,
        baySpacing,
        levelHeight
      });

      // Populate cargo boxes randomly with deterministic seed
      for (let b = 0; b < bays; b++) {
        for (let l = 0; l < levels; l++) {
          // 85% occupancy
          const hash = Math.sin(x * 12.9898 + b * 78.233 + l * 45.123) * 43758.5453;
          const rand = hash - Math.floor(hash);
          if (rand > 0.15) {
            const boxZ = z - length / 2 + (b + 0.5) * baySpacing;
            const boxY = (l + 0.5) * levelHeight + 0.15;
            const colorIdx = Math.floor(Math.abs(hash) * CARGO_COLORS.length) % CARGO_COLORS.length;

            boxes.push({
              id: `BOX_${id}_B${b}_L${l}`,
              rackId: id,
              x,
              y: boxY,
              z: boxZ,
              width: 0.9,
              height: levelHeight * 0.75,
              depth: baySpacing * 0.78,
              color: CARGO_COLORS[colorIdx]
            });
          }
        }
      }
    });

    return { rackStructures: racks, cargoBoxes: boxes };
  }, []);

  return (
    <group>
      {/* 1. Industrial Steel Uprights & Horizontal Beams */}
      {rackStructures.map((rack) => {
        const isSelected = selectedRackId === rack.id;
        const beamColor = isSelected ? '#00f0ff' : '#1e3a5f';
        const uprightColor = isSelected ? '#00e5ff' : '#0f1f33';

        return (
          <group
            key={rack.id}
            position={[rack.x, 0, rack.z]}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRackId(isSelected ? null : rack.id);
            }}
          >
            {/* Shelf levels horizontal orange/blue load beams */}
            {Array.from({ length: rack.levels + 1 }).map((_, lIdx) => {
              const yPos = lIdx * rack.levelHeight;
              return (
                <group key={`level_${lIdx}`} position={[0, yPos, 0]}>
                  {/* Front load beam */}
                  <mesh position={[0.5, 0, 0]}>
                    <boxGeometry args={[0.08, 0.12, rack.length]} />
                    <meshStandardMaterial color="#ff7700" metalness={0.7} roughness={0.3} />
                  </mesh>
                  {/* Back load beam */}
                  <mesh position={[-0.5, 0, 0]}>
                    <boxGeometry args={[0.08, 0.12, rack.length]} />
                    <meshStandardMaterial color="#ff7700" metalness={0.7} roughness={0.3} />
                  </mesh>
                  {/* Wire decking/shelf support grid */}
                  <mesh position={[0, -0.04, 0]}>
                    <boxGeometry args={[1.0, 0.04, rack.length]} />
                    <meshStandardMaterial color={beamColor} metalness={0.8} roughness={0.4} />
                  </mesh>
                </group>
              );
            })}

            {/* Vertical upright frame columns */}
            {Array.from({ length: rack.bays + 1 }).map((_, bIdx) => {
              const zPos = -rack.length / 2 + bIdx * rack.baySpacing;
              return (
                <group key={`upright_${bIdx}`} position={[0, rack.height / 2, zPos]}>
                  <mesh position={[0.5, 0, 0]}>
                    <boxGeometry args={[0.1, rack.height, 0.1]} />
                    <meshStandardMaterial color={uprightColor} metalness={0.8} roughness={0.3} />
                  </mesh>
                  <mesh position={[-0.5, 0, 0]}>
                    <boxGeometry args={[0.1, rack.height, 0.1]} />
                    <meshStandardMaterial color={uprightColor} metalness={0.8} roughness={0.3} />
                  </mesh>
                  {/* Diagonal cross bracing */}
                  <mesh rotation={[0, 0, Math.PI / 4]}>
                    <boxGeometry args={[0.04, 1.2, 0.04]} />
                    <meshStandardMaterial color="#0f2238" metalness={0.8} roughness={0.4} />
                  </mesh>
                </group>
              );
            })}

            {/* End-of-rack heavy duty yellow safety collision protectors / crash bollards */}
            {[-rack.length / 2, rack.length / 2].map((zEnd, endIdx) => (
              <group key={`protector_${endIdx}`} position={[0, 0, zEnd]}>
                {/* Front corner yellow post */}
                <mesh position={[0.55, 0.4, 0]}>
                  <cylinderGeometry args={[0.07, 0.07, 0.8, 12]} />
                  <meshStandardMaterial color="#ffcc00" roughness={0.3} metalness={0.2} />
                </mesh>
                {/* Back corner yellow post */}
                <mesh position={[-0.55, 0.4, 0]}>
                  <cylinderGeometry args={[0.07, 0.07, 0.8, 12]} />
                  <meshStandardMaterial color="#ffcc00" roughness={0.3} metalness={0.2} />
                </mesh>
                {/* Connecting lower crash bar */}
                <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.045, 0.045, 1.1, 12]} />
                  <meshStandardMaterial color="#ffcc00" roughness={0.3} metalness={0.2} />
                </mesh>
                {/* Black hazard stripe on crash bar */}
                <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.045, 0.045, 1.1, 12]} />
                  <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
                </mesh>
              </group>
            ))}

            {/* Overhead Rack Label Tag */}
            <Text
              position={[0, rack.height + 0.5, 0]}
              rotation={[0, Math.PI / 2, 0]}
              fontSize={0.6}
              color={isSelected ? '#00f0ff' : '#8fa3bf'}
              anchorX="center"
              anchorY="middle"
            >
              {rack.label}
            </Text>
          </group>
        );
      })}

      {/* 2. Stored Cargo Pallets & Boxes */}
      {cargoBoxes.map((box) => (
        <group key={box.id} position={[box.x, box.y, box.z]}>
          {/* Wooden pallet base */}
          <mesh position={[0, -box.height / 2 + 0.05, 0]}>
            <boxGeometry args={[box.width, 0.08, box.depth]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
          </mesh>

          {/* Main cargo box / container */}
          <mesh
            position={[0, 0.05, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRackId(box.rackId);
            }}
          >
            <boxGeometry args={[box.width * 0.92, box.height * 0.85, box.depth * 0.92]} />
            <meshStandardMaterial
              color={box.color}
              roughness={0.6}
              metalness={0.1}
              emissive={viewMode === 'inventory' ? box.color : '#000000'}
              emissiveIntensity={viewMode === 'inventory' ? 0.25 : 0}
            />
          </mesh>

          {/* Barcode / shipping label sticker */}
          <mesh position={[box.width * 0.47, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.25, 0.15]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

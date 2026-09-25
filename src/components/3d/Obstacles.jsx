import React from 'react';
import { useWarehouseStore } from '../../store/useWarehouseStore';
import { Text } from '@react-three/drei';

export function Obstacles() {
  const obstacles = useWarehouseStore(state => state.obstacles);
  const removeObstacle = useWarehouseStore(state => state.removeObstacle);

  return (
    <group>
      {obstacles.map((obs) => (
        <group
          key={obs.id}
          position={[obs.x, 0, obs.z]}
          onClick={(e) => {
            e.stopPropagation();
            removeObstacle(obs.id);
          }}
        >
          {/* Staged dropped wooden pallet */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[1.2, 0.16, 1.2]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
          </mesh>

          {/* Dropped crate */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.9, 0.8, 0.9]} />
            <meshStandardMaterial color="#c68b59" roughness={0.7} />
          </mesh>

          {/* Safety Cones surrounding the obstacle */}
          {[[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]].map(([cx, cz], i) => (
            <group key={i} position={[cx, 0, cz]}>
              <mesh position={[0, 0.25, 0]}>
                <coneGeometry args={[0.15, 0.5, 12]} />
                <meshStandardMaterial color="#ff5500" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.02, 0]}>
                <boxGeometry args={[0.3, 0.04, 0.3]} />
                <meshStandardMaterial color="#ff5500" />
              </mesh>
            </group>
          ))}

          {/* Floating Label */}
          <Text
            position={[0, 1.3, 0]}
            fontSize={0.25}
            color="#ffaa00"
            anchorX="center"
            anchorY="middle"
          >
            ⚠️ OBSTACLE (Click to clear)
          </Text>
        </group>
      ))}
    </group>
  );
}

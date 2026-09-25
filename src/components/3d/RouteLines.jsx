import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function RouteLines() {
  const robots = useWarehouseStore(state => state.robots);
  const selectedRobotId = useWarehouseStore(state => state.selectedRobotId);
  const viewMode = useWarehouseStore(state => state.viewMode);
  const showRouteFlow = useWarehouseStore(state => state.showRouteFlow) ?? true;

  const flowOffsetRef = useRef(0);

  useFrame((_, delta) => {
    flowOffsetRef.current = (flowOffsetRef.current + delta * 2.5) % 1.0;
  });

  return (
    <group position={[0, 0.05, 0]}>
      {robots.map((robot) => {
        const isSelected = selectedRobotId === robot.id;
        const showAllRoutes = viewMode === 'routes' || viewMode === 'standard';

        if (!isSelected && !showAllRoutes) return null;

        const path = robot.path || [];
        const oldPath = robot.oldPath || null;
        const currentIdx = robot.currentWaypointIndex || 0;

        // Active path points starting from robot current coordinates
        const activePoints = [
          new THREE.Vector3(robot.x, 0.05, robot.z),
          ...path.slice(currentIdx).map(node => new THREE.Vector3(node.x, 0.05, node.z))
        ];

        // Old / Rerouted path points
        const oldPoints = oldPath
          ? oldPath.map(node => new THREE.Vector3(node.x, 0.05, node.z))
          : null;

        let activeColor = isSelected ? '#00f0ff' : '#00ff88';
        if (robot.status === 'rerouting') {
          activeColor = '#00ff88'; // Glowing optimized green
        }

        return (
          <group key={`route_${robot.id}`}>
            {/* 1. Old / Pre-optimization Route (Rendered in Red/Orange Dashed Line) */}
            {oldPoints && oldPoints.length > 1 && (
              <group>
                <line>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={oldPoints.length}
                      array={new Float32Array(oldPoints.flatMap(p => [p.x, p.y + 0.02, p.z]))}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineDashedMaterial
                    color="#ff2255"
                    dashSize={0.8}
                    gapSize={0.4}
                    linewidth={3}
                    transparent
                    opacity={isSelected ? 0.95 : 0.65}
                  />
                </line>

                {/* Old Route Waypoint cross markers */}
                {oldPoints.map((p, idx) => (
                  <mesh key={`old_wp_${idx}`} position={[p.x, 0.07, p.z]}>
                    <ringGeometry args={[0.2, 0.28, 16]} />
                    <meshBasicMaterial color="#ff2255" side={THREE.DoubleSide} />
                  </mesh>
                ))}
              </group>
            )}

            {/* 2. Active Optimized Route (Rendered in Glowing Green/Cyan Beam) */}
            {activePoints.length > 1 && (
              <group>
                <line>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={activePoints.length}
                      array={new Float32Array(activePoints.flatMap(p => [p.x, p.y, p.z]))}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial
                    color={activeColor}
                    linewidth={isSelected ? 3 : 1}
                    transparent
                    opacity={isSelected ? 0.95 : (robot.status === 'rerouting' ? 0.85 : 0.4)}
                  />
                </line>

                {/* Waypoint indicator rings */}
                {activePoints.slice(1).map((p, idx) => (
                  <mesh
                    key={`act_wp_${idx}`}
                    position={[p.x, 0.06, p.z]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <ringGeometry args={[0.18, 0.28, 16]} />
                    <meshBasicMaterial
                      color={activeColor}
                      transparent
                      opacity={isSelected ? 0.9 : 0.4}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                ))}

                {/* Destination Target Beacon Ring */}
                {activePoints.length > 1 && (
                  <mesh
                    position={[activePoints[activePoints.length - 1].x, 0.08, activePoints[activePoints.length - 1].z]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <ringGeometry args={[0.4, 0.55, 32]} />
                    <meshBasicMaterial
                      color={activeColor}
                      transparent
                      opacity={isSelected ? 0.95 : 0.5}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                )}
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}

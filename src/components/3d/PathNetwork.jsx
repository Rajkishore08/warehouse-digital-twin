import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { warehouseGraphInstance } from '../../simulation/warehouseGraph';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function PathNetwork() {
  const showPaths = useWarehouseStore(state => state.showPaths);
  const arrowOffsetRef = useRef(0);

  useFrame((_, delta) => {
    arrowOffsetRef.current = (arrowOffsetRef.current + delta * 2) % 1.0;
  });

  const { nodes, edges } = useMemo(() => {
    const graph = warehouseGraphInstance;
    const n = graph.getAllNodes();
    const e = graph.getAllEdges();
    return { nodes: n, edges: e };
  }, []);

  return (
    <group position={[0, 0.02, 0]}>
      {/* 1. Permanent Realistic Floor Navigation Guide Markings */}
      {/* North, Middle, South Main Highways */}
      {[-18, 0, 18].map((z, i) => (
        <group key={`hwy_track_${i}`} position={[0, 0.005, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[52, 1.8]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.06} />
          </mesh>
        </group>
      ))}

      {/* Charging Hub Access Corridor */}
      <group position={[-25, 0.005, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 36]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.07} />
        </mesh>
      </group>

      {/* 2. Technical Digital Navigation Network (Toggled by [SHOW PATHS]) */}
      {showPaths && (
        <group>
          {/* Glowing Junction Nodes */}
          {nodes.map(node => (
            <group key={`node_${node.id}`} position={[node.x, 0.06, node.z]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.25, 0.38, 16]} />
                <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.1, 12, 12]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}

          {/* Connected Corridor Edge Tracks */}
          {edges.map((edge, idx) => {
            const fromNode = warehouseGraphInstance.getNode(edge.from);
            const toNode = warehouseGraphInstance.getNode(edge.to);
            if (!fromNode || !toNode) return null;

            const points = [
              new THREE.Vector3(fromNode.x, 0.05, fromNode.z),
              new THREE.Vector3(toNode.x, 0.05, toNode.z)
            ];

            return (
              <line key={`edge_${idx}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial
                  color={edge.isBlocked ? '#ff2255' : (edge.congestionCost > 0 ? '#ff7700' : '#00a8ff')}
                  transparent
                  opacity={edge.isBlocked ? 0.9 : 0.45}
                  linewidth={1}
                />
              </line>
            );
          })}
        </group>
      )}
    </group>
  );
}

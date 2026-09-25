import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function CongestionZone() {
  const congestionZones = useWarehouseStore(state => state.congestionZones);
  const predictiveBottlenecks = useWarehouseStore(state => state.predictiveBottlenecks) || [];
  const aisleMetrics = useWarehouseStore(state => state.aisleMetrics);
  const heatmapVisible = useWarehouseStore(state => state.heatmapVisible);
  const viewMode = useWarehouseStore(state => state.viewMode);
  const blockedAisles = useWarehouseStore(state => state.blockedAisles);

  const pulseMeshRef = useRef();
  const predPulseRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pulseMeshRef.current) {
      pulseMeshRef.current.scale.y = 1 + Math.sin(t * 4) * 0.15;
    }
    if (predPulseRef.current) {
      predPulseRef.current.scale.y = 1 + Math.sin(t * 3) * 0.12;
    }
  });

  const shouldRenderHeatmap = heatmapVisible || viewMode === 'heatmap';

  return (
    <group>
      {/* 1. Traffic Density Heatmap Strip on Floor */}
      {shouldRenderHeatmap && aisleMetrics.map((metric) => {
        const density = metric.trafficDensity || 0;
        let heatmapColor = '#00ff88';
        if (metric.isBlocked) {
          heatmapColor = '#ff2255';
        } else if (density >= 0.75) {
          heatmapColor = '#ff2255'; // red
        } else if (density >= 0.5) {
          heatmapColor = '#ffaa00'; // orange/yellow
        } else if (density >= 0.25) {
          heatmapColor = '#00e5ff'; // cyan
        }

        return (
          <mesh
            key={`heat_${metric.id}`}
            position={[metric.x, 0.02, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[2.8, 30]} />
            <meshBasicMaterial
              color={heatmapColor}
              transparent
              opacity={metric.isBlocked ? 0.6 : (0.2 + density * 0.5)}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      {/* 2. 3D Volumetric Hologram Alert Zone for Congested Aisles */}
      {congestionZones.map((zone) => {
        const metric = aisleMetrics.find(m => m.id === zone.aisleId);
        if (!metric) return null;

        return (
          <group key={`congest_3d_${zone.aisleId}`} position={[metric.x, 2.5, 0]}>
            {/* Volumetric Holographic Warning Bounding Box */}
            <mesh ref={pulseMeshRef}>
              <boxGeometry args={[3.2, 5.0, 28]} />
              <meshStandardMaterial
                color="#ff2255"
                transparent
                opacity={0.18}
                wireframe={false}
                side={THREE.DoubleSide}
                emissive="#ff0044"
                emissiveIntensity={0.6}
              />
            </mesh>

            {/* Wireframe Outline */}
            <mesh>
              <boxGeometry args={[3.2, 5.0, 28]} />
              <meshBasicMaterial
                color="#ff2255"
                wireframe={true}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* Floating 3D Hologram Alert Billboard */}
            <Html position={[0, 3.2, 0]} center distanceFactor={28} style={{ pointerEvents: 'none' }}>
              <div
                style={{
                  background: 'rgba(255, 34, 85, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid #ffffff',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  color: '#ffffff',
                  boxShadow: '0 0 25px rgba(255, 34, 85, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  animation: 'pulseGlowRed 1.5s infinite ease-in-out'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', fontSize: '13px', letterSpacing: '0.5px' }}>
                  <span>⚠️ CONGESTION DETECTED</span>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', marginTop: '2px', opacity: 0.95 }}>
                  {metric.name} • {zone.robotCount} Robots ({(zone.density * 100).toFixed(0)}% Cap)
                </div>
                <div style={{ fontSize: '10px', color: '#ffe6eb', fontWeight: '600', marginTop: '2px' }}>
                  Speed: {zone.averageSpeed.toFixed(1)} m/s • Queue: {zone.queueLength} units
                </div>
              </div>
            </Html>
          </group>
        );
      })}

      {/* 3. 3D Simulated Predictive Congestion Zone (Amber Warning) */}
      {predictiveBottlenecks.map((pred) => (
        <group key={`pred_3d_${pred.aisleId}`} position={[pred.x, 2.5, 0]}>
          <mesh ref={predPulseRef}>
            <boxGeometry args={[3.0, 4.5, 26]} />
            <meshStandardMaterial
              color="#ffaa00"
              transparent
              opacity={0.15}
              wireframe={false}
              side={THREE.DoubleSide}
              emissive="#ff8800"
              emissiveIntensity={0.5}
            />
          </mesh>

          <mesh>
            <boxGeometry args={[3.0, 4.5, 26]} />
            <meshBasicMaterial color="#ffaa00" wireframe={true} transparent opacity={0.65} />
          </mesh>

          <Html position={[0, 3.0, 0]} center distanceFactor={28} style={{ pointerEvents: 'none' }}>
            <div
              style={{
                background: 'rgba(255, 170, 0, 0.88)',
                backdropFilter: 'blur(8px)',
                border: '2px solid #ffffff',
                borderRadius: '8px',
                padding: '5px 12px',
                color: '#060b14',
                boxShadow: '0 0 20px rgba(255, 170, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontWeight: '800'
              }}
            >
              <div style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                🔮 PREDICTED BOTTLENECK (in {pred.predictedTimeSec}s)
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', marginTop: '1px' }}>
                {pred.name} • Confidence: {pred.confidence}
              </div>
            </div>
          </Html>
        </group>
      ))}

      {/* 4. Blocked Aisle 3D Barricade / Hologram */}
      {Array.from(blockedAisles).map((aisleId) => {
        const metric = aisleMetrics.find(m => m.id === aisleId);
        if (!metric) return null;

        return (
          <group key={`blocked_3d_${aisleId}`} position={[metric.x, 2.0, 0]}>
            {/* Red Translucent Wall */}
            <mesh>
              <boxGeometry args={[3.0, 4.0, 28]} />
              <meshStandardMaterial
                color="#ff0044"
                transparent
                opacity={0.25}
                emissive="#ff0000"
                emissiveIntensity={0.5}
              />
            </mesh>

            {/* Floating Blocked Tag */}
            <Html position={[0, 2.6, 0]} center distanceFactor={28} style={{ pointerEvents: 'none' }}>
              <div
                style={{
                  background: 'rgba(255, 0, 50, 0.9)',
                  border: '2px solid #ffcc00',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '12px',
                  textAlign: 'center',
                  boxShadow: '0 0 20px rgba(255, 0, 0, 0.8)'
                }}
              >
                ⛔ AISLE CLOSED / BLOCKED
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

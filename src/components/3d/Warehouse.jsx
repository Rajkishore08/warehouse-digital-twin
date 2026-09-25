import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Floor } from './Floor';
import { Racks } from './Racks';
import { AisleMarkers } from './AisleMarkers';
import { RobotFleet } from './RobotFleet';
import { RouteLines } from './RouteLines';
import { CongestionZone } from './CongestionZone';
import { ChargingStation } from './ChargingStation';
import { Obstacles } from './Obstacles';
import { SafetyZones } from './SafetyZones';
import { Environment } from './Environment';
import { DataFlowOverlay } from './DataFlowOverlay';
import { PathNetwork } from './PathNetwork';
import { CameraController } from './CameraController';
import { useWarehouseStore } from '../../store/useWarehouseStore';

function SimulationTicker() {
  const tick = useWarehouseStore(state => state.tick);

  useFrame((_, delta) => {
    tick(delta);
  });

  return null;
}

export function Warehouse() {
  const controlsRef = useRef();
  const initSimulation = useWarehouseStore(state => state.initSimulation);
  const addObstacle = useWarehouseStore(state => state.addObstacle);
  const setUserCameraFree = useWarehouseStore(state => state.setUserCameraFree);
  const lightingMode = useWarehouseStore(state => state.lightingMode) || 'night';

  useEffect(() => {
    initSimulation();
  }, [initSimulation]);

  const bgColor = lightingMode === 'day' ? '#dbeafe' : (lightingMode === 'evening' ? '#1e1b2e' : '#060a12');
  const fogColor = lightingMode === 'day' ? '#dbeafe' : (lightingMode === 'evening' ? '#1e1b2e' : '#070d18');
  const fogNear = lightingMode === 'day' ? 75 : 60;
  const fogFar = lightingMode === 'day' ? 260 : 230;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [0, 42, 38], fov: 48, near: 0.5, far: 350 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onPointerDown={(e) => {
          if (e.altKey && e.point) {
            addObstacle(e.point.x, e.point.z);
          }
        }}
      >
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          maxPolarAngle={Math.PI / 2.05}
          minDistance={3}
          maxDistance={140}
          dampingFactor={0.08}
          onStart={() => setUserCameraFree()}
        />

        <CameraController controlsRef={controlsRef} />
        <SimulationTicker />

        <Environment />
        <Floor />
        <PathNetwork />
        <Racks />
        <AisleMarkers />
        <SafetyZones />
        <ChargingStation />
        <Obstacles />
        <CongestionZone />
        <DataFlowOverlay />
        <RouteLines />
        <RobotFleet />
      </Canvas>
    </div>
  );
}

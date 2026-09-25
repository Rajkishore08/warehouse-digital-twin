import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { WAREHOUSE_CONFIG } from '../../data/warehouseConfig';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function Environment() {
  const { width, length, height } = WAREHOUSE_CONFIG.dimensions;
  const lightingMode = useWarehouseStore(state => state.lightingMode) || 'night';

  const conveyorRef = useRef();

  useFrame((_, delta) => {
    if (conveyorRef.current) {
      conveyorRef.current.position.x = ((conveyorRef.current.position.x + delta * 1.5 + 2) % 4) - 2;
    }
  });

  // Lighting configurations for Day, Evening, and Night modes
  const isDay = lightingMode === 'day';
  const isEvening = lightingMode === 'evening';
  const isNight = lightingMode === 'night';

  const ambientColor = isDay ? '#ffffff' : (isEvening ? '#ffd2a6' : '#93c5fd');
  const ambientIntensity = isDay ? 1.4 : (isEvening ? 0.7 : 0.65);

  const sunColor = isDay ? '#fffbf0' : (isEvening ? '#ff8c42' : '#60a5fa');
  const sunIntensity = isDay ? 2.8 : (isEvening ? 1.4 : 0.95);

  const wallColor = isDay ? '#64748b' : (isEvening ? '#1e2238' : '#0f172a');
  const columnColor = isDay ? '#334155' : (isEvening ? '#1b263b' : '#1e293b');

  return (
    <group>
      {/* 1. Dynamic Industrial Lighting Rig */}
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      
      {/* Primary Directional Sun / Moon Light with High-Resolution Shadows */}
      <directionalLight
        position={isDay ? [35, 55, 30] : [25, 48, 22]}
        intensity={sunIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.0001}
        color={sunColor}
      />

      {/* Secondary Sky/Rim Daylight Fill Light */}
      <directionalLight
        position={[-35, 40, -25]}
        intensity={isDay ? 1.1 : (isEvening ? 0.6 : 0.7)}
        color={isDay ? '#dbeafe' : '#06b6d4'}
      />

      {/* Natural Hemisphere Ambient Dome */}
      <hemisphereLight
        skyColor={isDay ? '#bae6fd' : (isEvening ? '#ffaa66' : '#1e3a8a')}
        groundColor={isDay ? '#e2e8f0' : (isEvening ? '#151522' : '#090d16')}
        intensity={isDay ? 1.2 : 0.65}
      />

      {/* Overhead High-Bay LED Light Matrix (Dense Grid over Aisles & Highways) */}
      {[-18, 0, 18].flatMap((z) =>
        [-24, -12, 0, 12, 24].map((x, idx) => (
          <group key={`light_${x}_${z}_${idx}`} position={[x, height - 0.4, z]}>
            {/* Fixture casing */}
            <mesh>
              <boxGeometry args={[1.8, 0.22, 0.5]} />
              <meshStandardMaterial color={isDay ? '#475569' : '#0a121e'} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Luminous LED Face */}
            <mesh position={[0, -0.12, 0]}>
              <planeGeometry args={[1.6, 0.4]} />
              <meshBasicMaterial color={isDay ? '#fffdf5' : '#f0f9ff'} />
            </mesh>
            {/* Crisp downward illumination */}
            <pointLight
              distance={26}
              intensity={isDay ? 0.8 : 2.2}
              color={isDay ? '#fff8e7' : '#f0f9ff'}
              decay={1.8}
            />
          </group>
        ))
      )}

      {/* Night Mode: Dedicated Aisle Floor Spotlights for Aisles 1-8 */}
      {isNight && WAREHOUSE_CONFIG.aisles.map((aisle) => (
        <group key={`spot_${aisle.id}`} position={[aisle.x, height - 0.8, 0]}>
          <pointLight
            distance={24}
            intensity={1.6}
            color="#e0f2fe"
            decay={1.6}
          />
        </group>
      ))}

      {/* Day Mode: Architectural Glass Roof Skylights */}
      {isDay && [-15, 0, 15].map((z, idx) => (
        <group key={`skylight_${idx}`} position={[0, height - 0.05, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[36, 4]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
          </mesh>
        </group>
      ))}

      {/* 2. Warehouse Structural Steel Columns / Pillars */}
      {[-28, 0, 28].flatMap((x) =>
        [-20, 0, 20].map((z, idx) => (
          <group key={`col_${x}_${z}_${idx}`} position={[x, height / 2, z]}>
            {/* Main H-beam steel column */}
            <mesh castShadow>
              <boxGeometry args={[0.6, height, 0.6]} />
              <meshStandardMaterial color={columnColor} metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Safety Yellow/Black Hazard Wrap at base */}
            <mesh position={[0, -height / 2 + 0.6, 0]}>
              <boxGeometry args={[0.75, 1.2, 0.75]} />
              <meshStandardMaterial color="#ffcc00" roughness={0.4} />
            </mesh>
            <mesh position={[0, -height / 2 + 0.6, 0]}>
              <boxGeometry args={[0.77, 0.3, 0.77]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
          </group>
        ))
      )}

      {/* 3. Overhead Industrial HVAC Ducts & Fire Sprinkler Pipes */}
      {[-12, 6].map((x, idx) => (
        <group key={`duct_${idx}`} position={[x, height - 0.8, 0]}>
          {/* Main ventilation duct */}
          <mesh>
            <boxGeometry args={[1.2, 0.8, length]} />
            <meshStandardMaterial color={isDay ? '#64748b' : '#33475b'} metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Red fire sprinkler pipe running along duct */}
          <mesh position={[0.8, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, length, 16]} />
            <meshStandardMaterial color="#cc1122" roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* 4. Warehouse Perimeter Walls & Rolling Shutter Doors */}
      <mesh position={[0, height / 2, -length / 2]}>
        <boxGeometry args={[width, height, 0.4]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, height / 2, length / 2]}>
        <boxGeometry args={[width, height, 0.4]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.4, height, length]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.4, height, length]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* Inbound Dock Doors & Exterior Logistics Trucks */}
      {[-16, 0, 16].map((x, i) => (
        <group key={`dock_door_${i}`} position={[x, 0, -length / 2]}>
          {/* Shutter door */}
          <mesh position={[0, 2.5, 0.22]}>
            <boxGeometry args={[4.8, 5.0, 0.1]} />
            <meshStandardMaterial color="#ff7700" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 5.1, 0.22]}>
            <boxGeometry args={[5.2, 0.3, 0.15]} />
            <meshBasicMaterial color="#ffcc00" />
          </mesh>

          {/* Exterior Semi-Truck Trailer Backed Up Outside Dock */}
          <group position={[0, 2.2, -7.5]}>
            <mesh>
              <boxGeometry args={[3.2, 4.0, 12]} />
              <meshStandardMaterial color="#f0f4f8" metalness={0.5} roughness={0.4} />
            </mesh>
            {/* Truck Tractor Cab */}
            <mesh position={[0, -0.5, -7.5]}>
              <boxGeometry args={[3.0, 3.2, 4.0]} />
              <meshStandardMaterial color="#0066ff" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        </group>
      ))}

      {/* 5. Industrial Roller Conveyor Lines in Packing Area */}
      <group position={[-10, 0.6, 21]}>
        {/* Conveyor Bed */}
        <mesh>
          <boxGeometry args={[16, 0.3, 1.2]} />
          <meshStandardMaterial color="#1a2332" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Steel Leg Supports */}
        {[-7, -3.5, 0, 3.5, 7].map((cx, idx) => (
          <mesh key={idx} position={[cx, -0.3, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6]} />
            <meshStandardMaterial color="#0a121e" metalness={0.9} />
          </mesh>
        ))}
        {/* Moving Parcels on Conveyor */}
        <group ref={conveyorRef}>
          {[-6, -3, 0, 3, 6].map((bx, idx) => (
            <mesh key={idx} position={[bx, 0.3, 0]}>
              <boxGeometry args={[0.7, 0.35, 0.6]} />
              <meshStandardMaterial color="#c68b59" roughness={0.7} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 6. Safety Accessories: Fire Extinguishers & Illuminated Emergency Exits */}
      {[[-width / 2 + 0.3, 2, -10], [width / 2 - 0.3, 2, 10]].map(([ex, ey, ez], i) => (
        <group key={`ext_${i}`} position={[ex, ey, ez]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.6, 16]} />
            <meshStandardMaterial color="#e60000" roughness={0.3} metalness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Green Illuminated Emergency Exit Signs */}
      {[[-width / 2 + 0.3, 4.5, 0], [width / 2 - 0.3, 4.5, 0]].map(([ex, ey, ez], i) => (
        <group key={`exit_${i}`} position={[ex, ey, ez]}>
          <mesh>
            <boxGeometry args={[0.1, 0.4, 0.9]} />
            <meshBasicMaterial color="#00e676" />
          </mesh>
        </group>
      ))}

      {/* Ceiling Structural Trusses */}
      {[-20, -10, 0, 10, 20].map((z, idx) => (
        <group key={`truss_${idx}`} position={[0, height - 0.2, z]}>
          <mesh>
            <boxGeometry args={[width, 0.3, 0.3]} />
            <meshStandardMaterial color="#0d1b2e" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

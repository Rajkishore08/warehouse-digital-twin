import React from 'react';
import { useWarehouseStore } from '../../store/useWarehouseStore';
import { Robot } from './Robot';

export function RobotFleet() {
  const robots = useWarehouseStore(state => state.robots);
  const selectedRobotId = useWarehouseStore(state => state.selectedRobotId);

  return (
    <group>
      {robots.map((robot) => (
        <Robot
          key={robot.id}
          robot={robot}
          isSelected={selectedRobotId === robot.id}
        />
      ))}
    </group>
  );
}

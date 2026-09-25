import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function CameraController({ controlsRef }) {
  const { camera } = useThree();
  const cameraMode = useWarehouseStore(state => state.cameraMode); // 'orbit' | 'follow' | 'pov'
  const cameraPreset = useWarehouseStore(state => state.cameraPreset);
  const isCameraTransitioning = useWarehouseStore(state => state.isCameraTransitioning);
  const selectedRobotId = useWarehouseStore(state => state.selectedRobotId);
  const robots = useWarehouseStore(state => state.robots);

  const targetCamPos = useRef(new THREE.Vector3(0, 42, 38));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioningRef = useRef(false);

  // Compute preset positions when cameraPreset or cameraMode changes
  useEffect(() => {
    if (cameraMode === 'pov' || cameraMode === 'follow') {
      isTransitioningRef.current = true;
      if (controlsRef.current) {
        controlsRef.current.enabled = (cameraMode !== 'pov');
      }
      return;
    }

    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }

    switch (cameraPreset) {
      case 'overview':
        targetCamPos.current.set(0, 42, 38);
        targetLookAt.current.set(0, 0, 0);
        isTransitioningRef.current = true;
        break;
      case 'top_view':
        targetCamPos.current.set(0, 56, 0.1);
        targetLookAt.current.set(0, 0, 0);
        isTransitioningRef.current = true;
        break;
      case 'floor_view':
        targetCamPos.current.set(0, 4.5, 26);
        targetLookAt.current.set(0, 1.2, 0);
        isTransitioningRef.current = true;
        break;
      case 'aisle_view':
      case 'congestion':
        targetCamPos.current.set(3, 7, 22);
        targetLookAt.current.set(3, 1.2, 0);
        isTransitioningRef.current = true;
        break;
      case 'packing':
        targetCamPos.current.set(-10, 12, 32);
        targetLookAt.current.set(-10, 0.5, 21);
        isTransitioningRef.current = true;
        break;
      case 'charging':
        targetCamPos.current.set(-28, 12, 16);
        targetLookAt.current.set(-29, 0.5, 0);
        isTransitioningRef.current = true;
        break;
      case 'receiving':
        targetCamPos.current.set(0, 14, -34);
        targetLookAt.current.set(0, 0.5, -22);
        isTransitioningRef.current = true;
        break;
      case 'dispatch':
        targetCamPos.current.set(14, 12, 32);
        targetLookAt.current.set(14, 0.5, 22);
        isTransitioningRef.current = true;
        break;
      case 'free':
        isTransitioningRef.current = false;
        break;
      default:
        break;
    }
  }, [cameraPreset, cameraMode]);

  useFrame((_, delta) => {
    const robot = robots.find(r => r.id === selectedRobotId);

    // 1. ROBOT POV (First-Person View)
    if (cameraMode === 'pov' && robot) {
      const heading = robot.rotation || 0;
      const eyeHeight = robot.type === 'FORKLIFT' ? 1.55 : 0.68;

      // Camera sits right at the robot sensor/head
      const eyeX = robot.x + Math.sin(heading) * 0.3;
      const eyeZ = robot.z + Math.cos(heading) * 0.3;
      const eyeY = eyeHeight;

      // Look straight ahead along robot heading
      const lookX = robot.x + Math.sin(heading) * 16;
      const lookZ = robot.z + Math.cos(heading) * 16;
      const lookY = eyeHeight;

      const povLerp = Math.min(1.0, delta * 14);
      camera.position.lerp(new THREE.Vector3(eyeX, eyeY, eyeZ), povLerp);
      camera.lookAt(lookX, lookY, lookZ);

      if (controlsRef.current) {
        controlsRef.current.target.set(lookX, lookY, lookZ);
      }
      return;
    }

    // 2. ROBOT FOLLOW MODE (Third-Person Behind Robot)
    if (cameraMode === 'follow' && robot) {
      const heading = robot.rotation || 0;
      const camDist = 6.5;
      const camHeight = 3.6;

      // Position behind robot
      const backX = robot.x - Math.sin(heading) * camDist;
      const backZ = robot.z - Math.cos(heading) * camDist;
      const backY = camHeight;

      const lookX = robot.x + Math.sin(heading) * 2;
      const lookZ = robot.z + Math.cos(heading) * 2;
      const lookY = 0.8;

      const followLerp = Math.min(1.0, delta * 5);
      camera.position.lerp(new THREE.Vector3(backX, backY, backZ), followLerp);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(new THREE.Vector3(lookX, lookY, lookZ), followLerp);
        controlsRef.current.update();
      }
      return;
    }

    // 3. SMOOTH CAMERA PRESET TRANSITION (Only runs when transitioning)
    if (isTransitioningRef.current) {
      const lerpFactor = Math.min(1.0, delta * 3.5);
      camera.position.lerp(targetCamPos.current, lerpFactor);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, lerpFactor);
        controlsRef.current.update();
      }

      // If camera reached target, stop transitioning to give user full manual Orbit control
      if (camera.position.distanceTo(targetCamPos.current) < 0.08) {
        isTransitioningRef.current = false;
      }
    }
  });

  return null;
}

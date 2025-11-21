'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface R3FHelmetLayerProps {
  finish: 'glossy' | 'matte' | 'chrome' | 'brushed_metal';
  shellColor?: string;
  facemaskColor?: string;
  hardwareColor?: string;
  chinstrapColor?: string;
  paddingColor?: string;
  visible?: boolean;
}

function HelmetModel({ finish, colors }: {
  finish: string;
  colors: Record<string, string>;
}) {
  const modelPath = `/models/helmet_${finish}.glb`;
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<any>();

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Z-fighting fix
        child.material.polygonOffset = true;
        child.material.polygonOffsetFactor = 1;
        child.material.polygonOffsetUnits = 1;

        // Apply zone-specific colors
        const objectName = child.name || child.parent?.name || '';

        let color = '#808080'; // Default gray

        if (objectName.includes('Shell')) {
          color = colors.shell;
        } else if (objectName.includes('Facemask')) {
          color = colors.facemask;
        } else if (objectName.includes('Hardware')) {
          color = colors.hardware;
        } else if (objectName.includes('Chinstrap')) {
          color = colors.chinstrap;
        } else if (objectName.includes('Padding')) {
          color = colors.padding;
        }

        child.material.color = new THREE.Color(color);
        child.material.needsUpdate = true;
      }
    });
  }, [scene, colors]);

  return <primitive ref={groupRef} object={scene} scale={2} />;
}

export function R3FHelmetLayer({
  finish,
  shellColor = '#1a5fb4',
  facemaskColor = '#1a5fb4',
  hardwareColor = '#1a5fb4',
  chinstrapColor = '#1a5fb4',
  paddingColor = '#1a5fb4',
  visible = true,
}: R3FHelmetLayerProps) {
  if (!visible) return null;

  const colors = {
    shell: shellColor,
    facemask: facemaskColor,
    hardware: hardwareColor,
    chinstrap: chinstrapColor,
    padding: paddingColor,
  };

  return (
    <div
      className="absolute inset-0 z-10"
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'normal'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{
          pointerEvents: 'auto',
          background: 'transparent'
        }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />

        <HelmetModel finish={finish} colors={colors} />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          target={[0, 0, 0]}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />

        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}

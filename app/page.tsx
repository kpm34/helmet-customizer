'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import * as THREE from 'three';
import { useHelmetStore, type HelmetConfig } from '@/store/helmetStore';
import { HelmetCustomizer } from './components/HelmetCustomizer';
import { getFinishProperties } from '@/lib/constants';

// Map zone names to object names in the GLB model
const ZONE_OBJECT_MAPPING = {
  shell: ['Shell_Combined', 'Shell', 'shell'],
  facemask: ['Facemask_Combined', 'Facemask', 'facemask'],
  hardware: ['Hardware_Combined', 'Hardware', 'hardware'],
  chinstrap: ['Chinstrap_Combined', 'Chinstrap', 'chinstrap'],
  padding: ['Padding_Combined', 'Padding', 'padding'],
};

function HelmetModel({ position, scale, rotation, config }: {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  config: HelmetConfig;
}) {
  const { scene } = useGLTF('/models/helmet_glossy_VERSION_A.glb');

  // Apply zone-specific colors AND finishes to the helmet materials
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Ensure we have a MeshStandardMaterial or convert to one
        if (!(child.material instanceof THREE.MeshStandardMaterial)) {
          child.material = new THREE.MeshStandardMaterial({
            color: child.material.color,
            map: child.material.map,
            normalMap: child.material.normalMap,
          });
        }

        // Z-fighting fix
        child.material.polygonOffset = true;
        child.material.polygonOffsetFactor = 1;
        child.material.polygonOffsetUnits = 1;

        // Apply zone-specific colors and finishes
        const objectName = child.name || child.parent?.name || '';

        // Find which zone this object belongs to
        for (const [zone, objectNames] of Object.entries(ZONE_OBJECT_MAPPING)) {
          if (objectNames.some(name => objectName.includes(name))) {
            const zoneConfig = config[zone as keyof HelmetConfig];
            if (zoneConfig) {
              // Apply color
              child.material.color = new THREE.Color(zoneConfig.color);

              // Apply finish properties (metalness & roughness)
              const finishProps = getFinishProperties(zoneConfig.finish);
              child.material.metalness = finishProps.metalness;
              child.material.roughness = finishProps.roughness;

              // Enhanced material properties for better appearance
              child.material.envMapIntensity = 1.0; // Environment map reflection
              child.material.clearcoat = 0.0; // No clearcoat by default
              child.material.clearcoatRoughness = 0.0;

              // Adjust properties based on finish type
              if (zoneConfig.finish === 'glossy') {
                child.material.clearcoat = 0.5; // Add clearcoat for glossy
                child.material.clearcoatRoughness = 0.1;
              } else if (zoneConfig.finish === 'matte') {
                child.material.envMapIntensity = 0.3; // Reduce reflections for matte
              }

              child.material.needsUpdate = true;
            }
            break;
          }
        }
      }
    });
  }, [scene, config]);

  return <primitive object={scene} position={position} scale={scale} rotation={rotation} />;
}

export default function Home() {
  // Position, scale, and rotation controls
  const [position, setPosition] = useState<[number, number, number]>([-0.5, 0, 0]);
  const [scale, setScale] = useState(0.35);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  // Get full helmet config from Zustand store (colors + finishes)
  const config = useHelmetStore((state) => state.config);

  return (
    <main className="w-full h-screen bg-gray-900 relative">
      {/* R3F Layer - Behind Spline (z-0) */}
      <div className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
        <Canvas
          camera={{
            position: [0, 2, 8],
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          style={{
            pointerEvents: 'none',
            background: 'transparent'
          }}
          gl={{ alpha: true }}
        >
          {/* Improved balanced lighting setup */}
          <ambientLight intensity={0.8} />

          {/* Key light - front right */}
          <directionalLight position={[5, 5, 5]} intensity={0.8} />

          {/* Fill light - front left */}
          <directionalLight position={[-5, 3, 5]} intensity={0.4} />

          {/* Top light - reduces gradient on top of helmet */}
          <directionalLight position={[0, 10, 0]} intensity={0.6} />

          {/* Back light - subtle rim lighting */}
          <directionalLight position={[0, 3, -5]} intensity={0.3} />

          {/* The helmet with adjustable position, scale, rotation, colors AND finishes */}
          <HelmetModel position={position} scale={scale} rotation={rotation} config={config} />

          <Environment preset="studio" intensity={0.5} />
        </Canvas>
      </div>

      {/* Spline Scene Layer - Front (z-10) */}
      <div className="absolute inset-0 z-10">
        <Spline
          scene="/scene-new.splinecode"
          wasmPath="/"
        />
      </div>

      {/* Helmet Customizer Panel */}
      <HelmetCustomizer />
    </main>
  );
}

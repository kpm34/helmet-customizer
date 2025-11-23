'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import * as THREE from 'three';
import { useHelmetStore, type HelmetConfig } from '@/store/helmetStore';
import { HelmetCustomizer } from './components/HelmetCustomizer';
import { getFinishProperties } from '@/lib/constants';
import type { Application } from '@splinetool/runtime';
import { RotateCw } from 'lucide-react';

// Tone mapping component for better PBR rendering
function ToneMapping() {
  const { gl } = useThree();

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2; // Slightly brighter for better detail
  }, [gl]);

  return null;
}

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

              // Enhanced material properties optimized for spherical geometry
              child.material.clearcoat = 0.0; // No clearcoat by default
              child.material.clearcoatRoughness = 0.0;

              // Adjust properties based on finish type to preserve surface detail
              if (zoneConfig.finish === 'glossy') {
                child.material.envMapIntensity = 1.5; // Strong reflections for glossy
                child.material.clearcoat = 0.5;
                child.material.clearcoatRoughness = 0.1;
              } else if (zoneConfig.finish === 'matte') {
                child.material.envMapIntensity = 0.4; // Minimal reflections for matte
              } else if (zoneConfig.finish === 'chrome' || zoneConfig.finish === 'brushed') {
                child.material.envMapIntensity = 2.0; // Maximum reflections for metallic
              } else if (zoneConfig.finish === 'satin') {
                child.material.envMapIntensity = 1.0; // Moderate reflections for satin
                child.material.clearcoat = 0.3;
                child.material.clearcoatRoughness = 0.2;
              } else {
                child.material.envMapIntensity = 1.0; // Default balanced reflections
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

  // Set rotation functions in store for UI access
  const setRotationX = (x: number) => setRotation([x, rotation[1], rotation[2]]);
  const setRotationY = (y: number) => setRotation([rotation[0], y, rotation[2]]);
  const setRotationZ = (z: number) => setRotation([rotation[0], rotation[1], z]);

  // Disable all scroll and zoom
  useEffect(() => {
    const preventScroll = (e: WheelEvent) => {
      e.preventDefault();
    };

    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    // Prevent mouse wheel scroll
    window.addEventListener('wheel', preventScroll, { passive: false });

    // Prevent touch gestures (pinch zoom)
    document.addEventListener('gesturestart', preventGesture);
    document.addEventListener('gesturechange', preventGesture);
    document.addEventListener('gestureend', preventGesture);

    return () => {
      window.removeEventListener('wheel', preventScroll);
      document.removeEventListener('gesturestart', preventGesture);
      document.removeEventListener('gesturechange', preventGesture);
      document.removeEventListener('gestureend', preventGesture);
    };
  }, []);

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
          {/* Strong lighting for PBR materials - Spline and R3F are separate render contexts */}
          <ambientLight intensity={0.8} />

          {/* Hemisphere light for natural fill */}
          <hemisphereLight args={['#ffffff', '#444444', 0.5]} />

          {/* Strong key light from front-right */}
          <directionalLight position={[5, 5, 8]} intensity={1.2} castShadow />

          {/* Fill lights for even illumination on curved surfaces */}
          <directionalLight position={[-5, 3, 5]} intensity={0.6} />
          <pointLight position={[0, 5, 0]} intensity={0.8} distance={15} decay={2} />

          {/* Rim light for edge definition */}
          <directionalLight position={[-3, -2, -5]} intensity={0.4} />

          {/* The helmet with adjustable position, scale, rotation, colors AND finishes */}
          <HelmetModel position={position} scale={scale} rotation={rotation} config={config} />

          {/* Studio environment with enhanced intensity for better PBR/matcap detail */}
          <Environment preset="studio" background={false} />

          {/* Tone mapping for realistic PBR rendering */}
          <ToneMapping />
        </Canvas>
      </div>

      {/* Spline Scene Layer - Front (z-10) */}
      <div className="absolute inset-0 z-10">
        <Spline
          scene="/scene-new.splinecode"
          wasmPath="/"
        />
      </div>

      {/* Rotation Controls - Floating Panel (Top Left) */}
      <div className="fixed top-4 left-4 z-30 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-2xl w-72">
        <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2 mb-3">
          <RotateCw className="w-3.5 h-3.5 text-blue-400" />
          Rotation Controls
        </div>

        <div className="space-y-3">
          {/* X Rotation */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs text-gray-400">Rotate X</label>
              <span className="text-xs text-gray-500 font-mono">{rotation[0].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-3.14"
              max="3.14"
              step="0.01"
              value={rotation[0]}
              onChange={(e) => setRotationX(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-blue-500/20 via-blue-500/40 to-blue-500/20"
            />
          </div>

          {/* Y Rotation */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs text-gray-400">Rotate Y</label>
              <span className="text-xs text-gray-500 font-mono">{rotation[1].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-3.14"
              max="3.14"
              step="0.01"
              value={rotation[1]}
              onChange={(e) => setRotationY(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-purple-500/20 via-purple-500/40 to-purple-500/20"
            />
          </div>

          {/* Z Rotation */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs text-gray-400">Rotate Z</label>
              <span className="text-xs text-gray-500 font-mono">{rotation[2].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-3.14"
              max="3.14"
              step="0.01"
              value={rotation[2]}
              onChange={(e) => setRotationZ(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-green-500/20 via-green-500/40 to-green-500/20"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={() => setRotation([0, 0, 0])}
            className="w-full mt-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs font-medium transition-colors"
          >
            Reset Rotation
          </button>
        </div>
      </div>

      {/* Helmet Customizer Panel */}
      <HelmetCustomizer />
    </main>
  );
}

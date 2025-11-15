'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { HelmetCustomization, FINISH_PRESETS, hexToRGB } from '@/lib/helmet-config';

interface HelmetModelProps {
  customization: HelmetCustomization;
}

function HelmetModel({ customization }: HelmetModelProps) {
  const gltf = useLoader(GLTFLoader, '/models/helmet_for_spline.glb');
  const modelRef = useRef<THREE.Group>(null);
  const [patternTexture, setPatternTexture] = useState<THREE.Texture | null>(null);

  // Load pattern texture if selected
  useEffect(() => {
    if (customization.pattern && customization.pattern !== 'none') {
      const textureLoader = new THREE.TextureLoader();
      const patternPath = `/patterns/${customization.pattern === 'camo' ? 'camo_pattern.png' : 'tiger_stripe.png'}`;

      textureLoader.load(patternPath, (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setPatternTexture(texture);
      });
    } else {
      setPatternTexture(null);
    }
  }, [customization.pattern]);

  // Apply customization to materials
  useEffect(() => {
    if (!gltf || !modelRef.current) return;

    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const meshName = child.name;

        // Apply to Shell (UV01_Shell)
        if (meshName === 'UV01_Shell' || meshName.includes('Shell')) {
          const material = child.material as THREE.MeshStandardMaterial;

          // Set base color
          const shellRGB = hexToRGB(customization.shellColor);
          material.color.setRGB(shellRGB[0], shellRGB[1], shellRGB[2]);

          // Apply finish preset
          const shellFinish = FINISH_PRESETS[customization.shellFinish];
          if (shellFinish) {
            material.metalness = shellFinish.metallic;
            material.roughness = shellFinish.roughness;
            // Note: Three.js doesn't have direct specular control in PBR workflow
            // Specular is controlled by metalness + roughness combination
          }

          // Apply pattern overlay if selected
          if (patternTexture) {
            material.map = patternTexture;
            material.needsUpdate = true;
          } else {
            material.map = null;
            material.needsUpdate = true;
          }
        }

        // Apply to Facemask (Facemask_Complete)
        if (meshName === 'Facemask_Complete' || meshName.includes('Facemask')) {
          const material = child.material as THREE.MeshStandardMaterial;

          // Set base color
          const facemaskRGB = hexToRGB(customization.facemaskColor);
          material.color.setRGB(facemaskRGB[0], facemaskRGB[1], facemaskRGB[2]);

          // Apply finish preset
          const facemaskFinish = FINISH_PRESETS[customization.facemaskFinish];
          if (facemaskFinish) {
            material.metalness = facemaskFinish.metallic;
            material.roughness = facemaskFinish.roughness;
          }
        }
      }
    });
  }, [gltf, customization, patternTexture]);

  if (!gltf) return null;

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={[1, 1, 1]}
      position={[0, -0.5, 0]}
    />
  );
}

function Scene({ customization }: { customization: HelmetCustomization }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(3, 1, 3);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />
      <HelmetModel customization={customization} />
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
      <Environment preset="studio" />
    </>
  );
}

interface HelmetViewerProps {
  customization: HelmetCustomization;
  className?: string;
}

export default function HelmetViewer({ customization, className = '' }: HelmetViewerProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        camera={{ position: [3, 1, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene customization={customization} />
      </Canvas>
    </div>
  );
}

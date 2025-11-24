'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, Decal, useTexture } from '@react-three/drei';
import { useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { useHelmetStore, type HelmetConfig, type PatternConfig } from '@/store/helmetStore';
import { getFinishProperties } from '@/lib/constants';

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

function HelmetModel({ config, pattern }: { config: HelmetConfig; pattern: PatternConfig }) {
  const { scene, nodes } = useGLTF('/models/helmet_glossy_VERSION_A.glb');

  // Load stripe textures
  const stripeTextures = useTexture({
    stripe_single: '/patterns/stripe_single.png',
    stripe_double: '/patterns/stripe_double.png',
  });

  // Set texture properties
  useEffect(() => {
    Object.values(stripeTextures).forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    });
  }, [stripeTextures]);

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
              } else if (zoneConfig.finish === 'chrome') {
                child.material.envMapIntensity = 2.0; // Maximum reflections for chrome
              } else if (zoneConfig.finish === 'brushed') {
                child.material.envMapIntensity = 1.3; // Reduced from 2.0 to soften harsh transitions
              } else if (zoneConfig.finish === 'satin') {
                child.material.envMapIntensity = 0.9; // Reduced from 1.0 to soften transition
                child.material.clearcoat = 0.2; // Reduced from 0.3
                child.material.clearcoatRoughness = 0.3; // Increased from 0.2 for softer effect
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

  // Find shell mesh for pattern decals
  let shellMesh = null;
  // @ts-ignore
  if (nodes.Shell) shellMesh = nodes.Shell;
  // @ts-ignore
  else if (nodes.Shell_Combined) shellMesh = nodes.Shell_Combined;

  // Determine if we have a stripe pattern
  const hasStripePattern = pattern.type === 'stripe_single' || pattern.type === 'stripe_double';
  const stripeTexture = hasStripePattern
    ? stripeTextures[pattern.type as 'stripe_single' | 'stripe_double']
    : null;

  // Debug logging
  useEffect(() => {
    if (hasStripePattern) {
      console.log('Stripe pattern active:', {
        type: pattern.type,
        color: pattern.color,
        intensity: pattern.intensity,
        hasTexture: !!stripeTexture,
        hasShellMesh: !!shellMesh,
      });
    }
  }, [hasStripePattern, pattern, stripeTexture, shellMesh]);

  return (
    <>
      <primitive object={scene} />

      {/* Stripe pattern overlay as decal */}
      {hasStripePattern && stripeTexture && shellMesh && (
        <Decal
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[3, 3, 3]}
          mesh={{ current: shellMesh } as any}
        >
          <meshStandardMaterial
            transparent
            map={stripeTexture}
            polygonOffset
            polygonOffsetFactor={-10}
            color={new THREE.Color(pattern.color)}
            opacity={pattern.intensity}
            roughness={0.1}
            metalness={0.0}
            depthWrite={false}
            alphaTest={0.1}
          />
        </Decal>
      )}
    </>
  );
}

export default function HelmetScene({ rotation }: { rotation: [number, number, number] }) {
  const config = useHelmetStore((state) => state.config);
  const pattern = useHelmetStore((state) => state.pattern);

  return (
    <Canvas
      camera={{
        position: [0, 2, 8],
        fov: 50,
        near: 0.1,
        far: 1000
      }}
      style={{
        background: 'transparent'
      }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.8} />
      <hemisphereLight args={['#ffffff', '#444444', 0.5]} />
      <directionalLight position={[5, 5, 8]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 3, 5]} intensity={0.6} />
      <pointLight position={[0, 5, 0]} intensity={0.8} distance={15} decay={2} />
      <directionalLight position={[-3, -2, -5]} intensity={0.4} />

      <Suspense fallback={null}>
        <group rotation={rotation} position={[-0.5, 0, 0]} scale={0.35}>
           <HelmetModel config={config} pattern={pattern} />
        </group>
        <Environment preset="studio" background={false} />
        <ToneMapping />
      </Suspense>
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={12}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}

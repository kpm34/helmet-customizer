'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, useTexture, TransformControls, Line } from '@react-three/drei';
import { useEffect, Suspense, useState, useRef } from 'react';
import * as THREE from 'three';
import { useHelmetStore, type HelmetConfig, type PatternConfig } from '@/store/helmetStore';
import { getFinishProperties } from '@/lib/constants';

// Debug mode - set to true to enable drag controls and console logging
const DEBUG_MODE = true;

// Enable stripe control point dragging (set to false to lock stripe in place)
const ENABLE_STRIPE_CONTROLS = false;

// Stripe Curve Component - follows helmet contour using Bézier curve
function StripeCurve({
  pattern,
  controlPoints,
  setControlPoints
}: {
  pattern: PatternConfig;
  controlPoints: THREE.Vector3[];
  setControlPoints: (points: THREE.Vector3[]) => void;
}) {
  const [texture] = useTexture([pattern.type === 'stripe_single' ? '/patterns/stripe_single.png' : '/patterns/stripe_double.png']);

  // Create Bézier curve from control points
  const curve = new THREE.CubicBezierCurve3(
    controlPoints[0],
    controlPoints[1],
    controlPoints[2],
    controlPoints[3]
  );

  // Generate points along the curve
  const points = curve.getPoints(50);

  // Create geometry for the stripe tube
  const tubeGeometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points),
    50, // tubular segments
    0.15, // radius (stripe width)
    8, // radial segments
    false // closed
  );

  return (
    <>
      {/* The actual stripe tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          map={texture}
          color={new THREE.Color(pattern.color)}
          transparent
          opacity={pattern.intensity}
          roughness={0.2}
          metalness={0.0}
        />
      </mesh>

      {/* Debug: Control point markers */}
      {DEBUG_MODE && controlPoints.map((point, index) => (
        <group key={index} position={point}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial
              color={['red', 'orange', 'yellow', 'green'][index]}
              transparent
              opacity={0.7}
            />
          </mesh>
          {/* Labels */}
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>
      ))}

      {/* Debug: Curve visualization */}
      {DEBUG_MODE && (
        <Line
          points={points}
          color="cyan"
          lineWidth={2}
          dashed={false}
        />
      )}
    </>
  );
}

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
  const { scene, nodes } = useGLTF('/models/helmet_matte_FINAL.glb');

  // Bézier control points for stripe curve (front to back along helmet)
  const [controlPoints, setControlPoints] = useState<THREE.Vector3[]>([
    new THREE.Vector3(0, 1.5, 2.5),   // Front (red)
    new THREE.Vector3(0, 2.8, 1.2),   // Front-top control (orange)
    new THREE.Vector3(0, 3.2, -0.5),  // Back-top control (yellow)
    new THREE.Vector3(0, 2.2, -2.0),  // Back (green)
  ]);

  const controlPointRefs = useRef<(THREE.Group | null)[]>([null, null, null, null]);

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
      texture.center.set(0.5, 0.5); // Center the texture
      texture.repeat.set(1, 1); // Ensure no tiling
      texture.rotation = 0; // Reset rotation
    });
  }, [stripeTextures]);

  // Apply zone-specific colors AND finishes to the helmet materials
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Ensure we have a MeshPhysicalMaterial or convert to one
        if (!(child.material instanceof THREE.MeshPhysicalMaterial)) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: child.material.color,
            map: child.material.map,
            normalMap: child.material.normalMap,
            roughness: 0.5,
            metalness: 0.5,
          });
        }

        // Z-fighting fix
        child.material.polygonOffset = true;
        child.material.polygonOffsetFactor = 1;
        child.material.polygonOffsetUnits = 1;

        // Apply zone-specific colors and finishes
        // Check both object name and parent name against zone mapping to handle GLB hierarchy variations
        const objectName = child.name || '';
        const parentName = child.parent?.name || '';

        // Find which zone this object belongs to
        for (const [zone, objectNames] of Object.entries(ZONE_OBJECT_MAPPING)) {
          // Check if object name OR parent name contains any of the zone identifiers
          const isMatch = objectNames.some(name => 
            objectName.includes(name) || parentName.includes(name)
          );

          if (isMatch) {
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
              child.material.sheen = 0.0;

              // Adjust properties based on finish type to preserve surface detail
              if (zoneConfig.finish === 'glossy') {
                child.material.envMapIntensity = 1.0;
                child.material.clearcoat = 1.0;
                child.material.clearcoatRoughness = 0.05;
              } else if (zoneConfig.finish === 'matte') {
                child.material.envMapIntensity = 0.5;
                child.material.roughness = 0.8;
                child.material.metalness = 0.0;
              } else if (zoneConfig.finish === 'chrome') {
                child.material.envMapIntensity = 1.0;
                child.material.roughness = 0.0;
                child.material.metalness = 1.0;
              } else if (zoneConfig.finish === 'brushed') {
                child.material.envMapIntensity = 0.8;
                child.material.roughness = 0.4;
                child.material.metalness = 0.6;
                child.material.clearcoat = 0.1;
                child.material.clearcoatRoughness = 0.4;
              } else if (zoneConfig.finish === 'satin') {
                child.material.envMapIntensity = 0.7;
                child.material.roughness = 0.5;
                child.material.metalness = 0.2;
                child.material.clearcoat = 0.2;
                child.material.clearcoatRoughness = 0.5;
                child.material.sheen = 0.5;
                child.material.sheenRoughness = 0.5;
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
  const [shellMesh, setShellMesh] = useState<THREE.Mesh | null>(null);

  useEffect(() => {
    let foundShell: THREE.Mesh | null = null;
    scene.traverse((child: any) => {
      if (child.isMesh && (child.name.toLowerCase().includes('shell') || child.parent?.name?.toLowerCase().includes('shell'))) {
        foundShell = child;
      }
    });
    setShellMesh(foundShell);
  }, [scene]);

  // Determine if we have a stripe pattern
  const hasStripePattern = pattern.type === 'stripe_single' || pattern.type === 'stripe_double';
  const stripeTexture = hasStripePattern
    ? stripeTextures[pattern.type as 'stripe_single' | 'stripe_double']
    : null;

  // Debug logging - log control point positions
  useEffect(() => {
    if (DEBUG_MODE && hasStripePattern) {
      console.log('🎯 STRIPE BÉZIER CONTROL POINTS:', {
        point0_front: controlPoints[0].toArray(),
        point1_frontTop: controlPoints[1].toArray(),
        point2_backTop: controlPoints[2].toArray(),
        point3_back: controlPoints[3].toArray(),
        type: pattern.type,
        color: pattern.color,
        intensity: pattern.intensity,
      });
      console.log('📋 Copy this for code:', `[
  new THREE.Vector3(${controlPoints[0].x.toFixed(2)}, ${controlPoints[0].y.toFixed(2)}, ${controlPoints[0].z.toFixed(2)}),
  new THREE.Vector3(${controlPoints[1].x.toFixed(2)}, ${controlPoints[1].y.toFixed(2)}, ${controlPoints[1].z.toFixed(2)}),
  new THREE.Vector3(${controlPoints[2].x.toFixed(2)}, ${controlPoints[2].y.toFixed(2)}, ${controlPoints[2].z.toFixed(2)}),
  new THREE.Vector3(${controlPoints[3].x.toFixed(2)}, ${controlPoints[3].y.toFixed(2)}, ${controlPoints[3].z.toFixed(2)}),
]`);
    }
  }, [controlPoints, hasStripePattern, pattern]);

  // Original debug logging
  useEffect(() => {
    if (hasStripePattern) {
      console.log('Stripe pattern active:', {
        type: pattern.type,
        color: pattern.color,
        intensity: pattern.intensity,
        hasTexture: !!stripeTexture,
        hasShellMesh: !!shellMesh,
        shellMeshName: shellMesh?.name,
        shellMeshParent: shellMesh?.parent?.name
      });
      // Force decal update
      if (stripeTexture) {
         stripeTexture.needsUpdate = true;
      }
    }
  }, [hasStripePattern, pattern, stripeTexture, shellMesh]);

  return (
    <>
      <primitive object={scene} />

      {/* Stripe pattern using Bézier curve */}
      {hasStripePattern && stripeTexture && (
        <>
          <StripeCurve
            pattern={pattern}
            controlPoints={controlPoints}
            setControlPoints={setControlPoints}
          />

          {/* Debug: Transform controls for each control point */}
          {DEBUG_MODE && ENABLE_STRIPE_CONTROLS && controlPoints.map((point, index) => (
            <group
              key={index}
              ref={(el) => {
                controlPointRefs.current[index] = el;
              }}
              position={point}
            >
              <TransformControls
                object={controlPointRefs.current[index]!}
                mode="translate"
                size={0.5}
                onObjectChange={() => {
                  if (controlPointRefs.current[index]) {
                    const pos = controlPointRefs.current[index]!.position;
                    const newPoints = [...controlPoints];
                    newPoints[index] = new THREE.Vector3(pos.x, pos.y, pos.z);
                    setControlPoints(newPoints);
                  }
                }}
              />
            </group>
          ))}
        </>
      )}

      {/* Debug: Visual reference markers at key positions */}
      {DEBUG_MODE && (
        <>
          {/* Center marker (origin) */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>

          {/* Helmet outline reference points */}
          <mesh position={[0, 3, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="purple" />
          </mesh>

          <mesh position={[0, 2, 2.5]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="blue" />
          </mesh>

          <mesh position={[0, 2, -2.5]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="magenta" />
          </mesh>
        </>
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
        <Environment preset="studio" background={false} blur={0.8} />
        <ToneMapping />
      </Suspense>
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={12}
        target={[0, 0, 0]}
        makeDefault
      />
    </Canvas>
  );
}

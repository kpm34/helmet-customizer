'use client';

import { useRef, useState } from 'react';
import Spline from '@splinetool/react-spline/next';
import type { Application } from '@splinetool/runtime';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export default function Home() {
  const splineRef = useRef<Application>();
  const helmetRef = useRef<THREE.Object3D>();
  const [helmetLoaded, setHelmetLoaded] = useState(false);

  function onLoad(spline: Application) {
    splineRef.current = spline;

    // Adjust camera zoom
    const camera = spline.findObjectByName('Camera');
    if (camera) {
      console.log('✓ Camera found');
      camera.position.z += 3;
    }

    // List all objects in scene for debugging
    console.log('=== SPLINE SCENE OBJECTS ===');
    if ((spline as any)._scene) {
      const scene = (spline as any)._scene;
      scene.traverse((obj: any) => {
        console.log(`Object: "${obj.name}" | Type: ${obj.type}`);
      });
    }

    // Load helmet GLB and replace placeholder
    loadHelmetGLB(spline);
  }

  function loadHelmetGLB(spline: Application) {
    console.log('🔍 Starting helmet GLB loading...');

    // Find placeholder mesh
    const placeholder = spline.findObjectByName('football') || spline.findObjectByName('mesh_0');

    if (!placeholder) {
      console.error('❌ Placeholder mesh not found (looking for "football" or "mesh_0")');
      console.log('💡 TIP: Check console above for list of all scene objects');
      setHelmetLoaded(false);
      return;
    }

    console.log('✓ Placeholder found:', placeholder.name);
    console.log('  Position:', placeholder.position);
    console.log('  Rotation:', placeholder.rotation);
    console.log('  Scale:', placeholder.scale);

    // Load our helmet GLB
    const loader = new GLTFLoader();
    console.log('📦 Loading GLB from: /models/helmet_for_spline.glb');

    loader.load(
      '/models/helmet_for_spline.glb',
      (gltf) => {
        console.log('✅ GLB loaded successfully!');
        const helmet = gltf.scene;

        // Match placeholder transform
        helmet.position.set(placeholder.position.x, placeholder.position.y, placeholder.position.z);
        helmet.rotation.set(placeholder.rotation.x, placeholder.rotation.y, placeholder.rotation.z);
        helmet.scale.set(placeholder.scale.x, placeholder.scale.y, placeholder.scale.z);

        console.log('🎨 Helmet transform matched to placeholder');

        // Add helmet to Spline scene
        (spline as any)._scene.add(helmet);
        console.log('➕ Helmet added to scene');

        // Hide placeholder
        placeholder.visible = false;
        console.log('👁️ Placeholder hidden');

        // Store helmet reference
        helmetRef.current = helmet;
        setHelmetLoaded(true);

        console.log('✓ Helmet GLB loaded and replaced placeholder');
      },
      (progress) => {
        if (progress.total > 0) {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`📊 Loading helmet: ${percent.toFixed(0)}%`);
        }
      },
      (error) => {
        console.error('❌ Error loading helmet GLB:', error);
        console.error('❌ Error details:', error.message || error);
        setHelmetLoaded(false);
      }
    );
  }

  return (
    <main className="w-full h-screen overflow-hidden relative">
      <Spline
        scene="/scene.splinecode"
        wasmPath="/"
        onLoad={onLoad}
      />

      {/* Loading indicator */}
      {!helmetLoaded && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm text-gray-700">Loading helmet model...</p>
        </div>
      )}

      {/* Success indicator */}
      {helmetLoaded && (
        <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm text-white font-medium">✓ Helmet loaded</p>
        </div>
      )}
    </main>
  );
}

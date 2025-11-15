'use client';

import { useRef, useState } from 'react';
import Spline from '@splinetool/react-spline/next';
import type { Application } from '@splinetool/runtime';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ConsolePanel from './components/ConsolePanel';

export default function Home() {
  const splineRef = useRef<Application>();
  const [helmetLoaded, setHelmetLoaded] = useState(false);

  function onLoad(spline: Application) {
    splineRef.current = spline;
    console.log('🎬 Spline scene loaded');

    // List all objects in scene for debugging
    console.log('=== ALL SCENE OBJECTS ===');
    const allObjects = spline.getAllObjects();
    allObjects.forEach(obj => {
      console.log(`  - ${obj.name} (${obj.uuid})`);
    });

    // Adjust camera zoom
    const camera = spline.findObjectByName('Camera');
    if (camera) {
      console.log('✓ Camera found');
      camera.position.z += 3;
    }

    // Find the placeholder football
    const placeholder = spline.findObjectByName('Mesh_0')
                     || spline.findObjectByName('football')
                     || spline.findObjectByName('mesh_0');

    if (!placeholder) {
      console.error('❌ Placeholder not found');
      console.log('💡 Available objects:', allObjects.map(o => o.name).join(', '));
      return;
    }

    console.log('✓ Placeholder found:', placeholder.name);
    console.log('  - Position:', placeholder.position);
    console.log('  - Rotation:', placeholder.rotation);
    console.log('  - Scale:', placeholder.scale);

    // Load helmet GLB at runtime
    loadHelmetGLB(spline, placeholder);
  }

  function loadHelmetGLB(spline: Application, placeholder: any) {
    console.log('📦 Loading helmet GLB...');

    const loader = new GLTFLoader();
    loader.load(
      '/models/helmet_for_spline.glb',
      (gltf) => {
        console.log('✅ GLB loaded successfully!');
        const helmet = gltf.scene;

        // Access Spline's internal THREE.js scene
        const splineScene = (spline as any)._scene;

        if (!splineScene) {
          console.error('❌ Could not access Spline scene');
          return;
        }

        // Match placeholder transform
        helmet.position.set(
          placeholder.position.x,
          placeholder.position.y,
          placeholder.position.z
        );
        helmet.rotation.set(
          placeholder.rotation.x,
          placeholder.rotation.y,
          placeholder.rotation.z
        );
        helmet.scale.set(
          placeholder.scale.x,
          placeholder.scale.y,
          placeholder.scale.z
        );

        // Add helmet to Spline's THREE.js scene
        splineScene.add(helmet);
        console.log('➕ Helmet added to scene');

        // Hide placeholder
        placeholder.visible = false;
        console.log('👁️ Placeholder hidden');

        // Log helmet structure for debugging
        console.log('🔍 Helmet structure:');
        helmet.traverse((child: any) => {
          if (child.isMesh) {
            console.log(`  - Mesh: ${child.name}`);
          }
        });

        setHelmetLoaded(true);
        console.log('✅ Helmet loaded and visible!');
      },
      (progress) => {
        if (progress.total > 0) {
          const percent = ((progress.loaded / progress.total) * 100).toFixed(0);
          console.log(`📊 Loading: ${percent}%`);
        }
      },
      (error) => {
        console.error('❌ Error loading helmet GLB:', error);
        setHelmetLoaded(false);
      }
    );
  }

  return (
    <main className="w-full h-screen overflow-hidden relative" suppressHydrationWarning>
      <Spline
        scene="/scene.splinecode"
        wasmPath="/"
        onLoad={onLoad}
      />

      {/* Console Panel for debugging */}
      <ConsolePanel />
    </main>
  );
}

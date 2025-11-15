'use client';

import { useRef, useState } from 'react';
import Spline from '@splinetool/react-spline/next';
import type { Application } from '@splinetool/runtime';
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
    const football = spline.findObjectByName('football')
                  || spline.findObjectByName('mesh_0')
                  || spline.findObjectByName('Mesh_0');

    if (football) {
      console.log('✓ Football placeholder found:', football.name);
    }

    // Find the helmet (should already be in scene from Spline import)
    const helmet = spline.findObjectByName('Helmet')
                || spline.findObjectByName('helmet')
                || spline.findObjectByName('helmet_for_spline');

    if (!helmet) {
      console.error('❌ Helmet not found in scene');
      console.log('💡 Available objects:', allObjects.map(o => o.name).join(', '));
      setHelmetLoaded(false);
      return;
    }

    console.log('✓ Helmet found:', helmet.name);
    console.log('  - Position:', helmet.position);
    console.log('  - Initial visibility:', helmet.visible);

    // Toggle visibility: Hide football, show helmet
    if (football) {
      football.visible = false;
      console.log('👁️ Football placeholder hidden');
    }

    helmet.visible = true;
    console.log('✅ Helmet is now visible!');

    setHelmetLoaded(true);
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

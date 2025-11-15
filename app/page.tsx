'use client';

import { useRef, useState } from 'react';
import Spline from '@splinetool/react-spline/next';
import type { Application } from '@splinetool/runtime';

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
    console.log('  - Visible:', helmet.visible);

    // Make helmet visible (in case it was hidden in Spline)
    helmet.visible = true;
    // helmet.show(); // Alternative method

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
    </main>
  );
}

'use client';

import { useRef, useState } from 'react';
import Spline from '@splinetool/react-spline/next';
import type { Application } from '@splinetool/runtime';

export default function Home() {
  const splineRef = useRef<Application>();
  const [helmetLoaded, setHelmetLoaded] = useState(false);

  async function onLoad(spline: Application) {
    splineRef.current = spline;
    console.log('🎬 Spline scene loaded');

    // Adjust camera zoom
    const camera = spline.findObjectByName('Camera');
    if (camera) {
      console.log('✓ Camera found');
      camera.position.z += 3;
    }

    // Find placeholder mesh
    const placeholderName = 'football' || 'mesh_0' || 'Mesh_0';
    const placeholder = spline.findObjectByName('football')
                     || spline.findObjectByName('mesh_0')
                     || spline.findObjectByName('Mesh_0');

    if (!placeholder) {
      console.error('❌ Placeholder mesh not found');
      setHelmetLoaded(false);
      return;
    }

    console.log('✓ Placeholder found:', placeholder.name);

    // Load helmet using Spline's native swapGeometry method
    try {
      console.log('📦 Loading helmet geometry...');

      // Note: helmet.splinegeometry file must be created first in Spline Editor
      // by importing helmet_for_spline.glb and exporting as geometry
      await spline.swapGeometry(placeholder.name, '/models/helmet.splinegeometry');

      console.log('✅ Helmet geometry loaded successfully!');
      setHelmetLoaded(true);
    } catch (error) {
      console.error('❌ Error loading helmet geometry:', error);
      console.log('💡 Make sure helmet.splinegeometry exists in /public/models/');
      console.log('💡 Create it by: Import GLB in Spline Editor → Right-click → Export Geometry');
      setHelmetLoaded(false);
    }
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

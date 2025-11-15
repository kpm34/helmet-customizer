'use client';

import { useRef } from 'react';
import Spline from '@splinetool/react-spline/next';
import type { Application } from '@splinetool/runtime';

export default function Home() {
  const splineRef = useRef<Application>();

  function onLoad(spline: Application) {
    splineRef.current = spline;

    // Access camera and adjust zoom
    const camera = spline.findObjectByName('Camera');
    if (camera) {
      console.log('Camera found:', camera);
      // Zoom out by moving camera back
      camera.position.z += 3; // Adjust this value to zoom out more/less
    }
  }

  return (
    <main className="w-full h-screen overflow-hidden">
      <Spline
        scene="/scene.splinecode"
        wasmPath="/"
        onLoad={onLoad}
      />
    </main>
  );
}

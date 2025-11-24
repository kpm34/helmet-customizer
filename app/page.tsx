'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Spline from '@splinetool/react-spline';
import { HelmetCustomizer } from './components/HelmetCustomizer';
import { RotateCw } from 'lucide-react';

// Dynamic import with SSR disabled to prevent R3F/WebGL errors during build
const HelmetScene = dynamic(() => import('./components/HelmetScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-gray-500">Loading 3D Scene...</div>
});

export default function Home() {
  // Rotation state shared between UI controls and 3D scene
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  // Set rotation functions for UI access
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
        <HelmetScene rotation={rotation} />
      </div>

      {/* Spline Scene Layer - Front (z-10) */}
      <div className="absolute inset-0 z-10">
        <Spline
          scene="/scene-new.splinecode"
          wasmPath="/"
        />
      </div>

      {/* Rotation Controls - Floating Panel (Top Left) */}
      <div className="fixed top-4 left-4 z-30 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-2xl w-72 pointer-events-auto">
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
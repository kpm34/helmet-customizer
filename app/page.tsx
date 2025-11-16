'use client';

import { useRef, useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import ConsolePanel from './components/ConsolePanel';
import { CustomizationPanel } from './components/CustomizationPanel';
import { useHelmetStore } from '@/store/helmetStore';
import { changeZoneColor, applyZoneFinish } from '@/lib/spline-helmet';

export default function Home() {
  const splineRef = useRef<Application>();
  const [helmetLoaded, setHelmetLoaded] = useState(false);
  const [showHelmet, setShowHelmet] = useState(true);

  // Get Zustand store config
  const config = useHelmetStore((state) => state.config);

  // Sync Zustand store changes to Spline
  useEffect(() => {
    if (!splineRef.current || !helmetLoaded) return;

    console.log('🔄 Syncing Zustand state to Spline...');

    // Update all zone colors
    Object.entries(config).forEach(([zone, zoneConfig]) => {
      changeZoneColor(splineRef.current!, zone as any, zoneConfig.color);
      applyZoneFinish(splineRef.current!, zone as any, zoneConfig.finish);
    });
  }, [config, helmetLoaded]);

  function onLoad(spline: Application) {
    splineRef.current = spline;
    console.log('🎬 Spline scene loaded');

    // List all objects in scene for debugging
    console.log('=== ALL SCENE OBJECTS ===');
    const allObjects = spline.getAllObjects();
    allObjects.forEach(obj => {
      console.log(`  - ${obj.name} (${obj.uuid})`);
    });

    // Camera controls are disabled in Spline Editor - no lock needed!
    const camera = spline.findObjectByName('Camera');
    if (camera) {
      console.log('✓ Camera found - controls disabled in Spline');
    }

    // Hide circular ring/spiral background objects
    // Only hiding decorative elements, keeping floor/platform
    const objectsToHide = [
      // Rings and ellipses (decorative background elements)
      'Ellipse', 'Ellipse 2', 'Ellipse 3', 'Ellipse 4', 'Ellipse 5',
      'Ellipse 6', 'Ellipse 7', 'Ellipse 8', 'Ellipse 9', 'Ellipse 10',
      'Circle', 'Circle 2', 'Circle 3',
      'Ring', 'Ring 2', 'Ring 3',
      'Torus', 'Torus 2', 'Torus 3',
      'Spiral', 'Spiral 2', 'Spiral 3',
      // Background elements
      'Background', 'background',
      'Boolean', 'Boolean 2', 'Boolean 3',
      // Shape primitives that might be background elements
      'Shape', 'Shape 2', 'Shape 3',
      'Curve', 'Curve 2', 'Curve 3',
      'Path', 'Path 2', 'Path 3',
    ];

    let hiddenCount = 0;
    objectsToHide.forEach(name => {
      const obj = spline.findObjectByName(name);
      if (obj) {
        obj.visible = false;
        hiddenCount++;
        console.log(`🙈 Hidden object: ${name}`);
      }
    });

    console.log(`✅ Total objects hidden: ${hiddenCount}`);

    // Find the helmet (should be in scene now)
    const helmet = spline.findObjectByName('helmet_for_spline')
                || spline.findObjectByName('Helmet')
                || spline.findObjectByName('helmet');

    // Find the placeholder football
    const placeholder = spline.findObjectByName('Mesh_0')
                     || spline.findObjectByName('football')
                     || spline.findObjectByName('mesh_0');

    if (placeholder) {
      console.log('✓ Football found:', placeholder.name);
      console.log('  - Initial visibility:', placeholder.visible);
    }

    if (!helmet) {
      console.error('❌ Helmet not found in scene');
      console.log('💡 Available objects:', allObjects.map(o => o.name).join(', '));
      setHelmetLoaded(false);
      return;
    }

    console.log('✓ Helmet found:', helmet.name);
    console.log('  - Position:', helmet.position);
    console.log('  - Initial visibility:', helmet.visible);

    // Set initial visibility: Show helmet, hide football
    helmet.visible = true;
    console.log('✅ Helmet is now visible!');

    if (placeholder) {
      placeholder.visible = false;
      console.log('👁️ Football hidden:', placeholder.name);
    } else {
      console.log('⚠️ Football object not found - check object name in console list above');
    }

    // Log available Spline events (if any are configured in editor)
    try {
      const splineEvents = spline.getSplineEvents();
      if (splineEvents && Object.keys(splineEvents).length > 0) {
        console.log('🎬 Available Spline Events:', splineEvents);
      } else {
        console.log('ℹ️ No Spline events configured in editor (can add in Spline Editor → Events panel)');
      }
    } catch (e) {
      console.log('ℹ️ Spline events not available');
    }

    // Listen to any Spline events
    spline.addEventListener('mouseDown', (e) => {
      console.log('🖱️ Spline mouseDown event:', e.target.name);
    });

    setHelmetLoaded(true);
  }

  function toggleView() {
    if (!splineRef.current) return;

    const helmet = splineRef.current.findObjectByName('helmet_for_spline')
                || splineRef.current.findObjectByName('Helmet')
                || splineRef.current.findObjectByName('helmet');

    const football = splineRef.current.findObjectByName('Mesh_0')
                  || splineRef.current.findObjectByName('football')
                  || splineRef.current.findObjectByName('mesh_0');

    const newShowHelmet = !showHelmet;

    // Option 1: Try to trigger Spline event (if set up in editor)
    try {
      if (helmet) {
        splineRef.current.emitEvent('mouseDown', helmet.name);
        console.log('🎬 Triggered Spline event on helmet');
      }
    } catch (e) {
      console.log('ℹ️ No Spline event configured, using manual control');
    }

    // Option 2: Manual control (fallback or additional control)
    if (helmet) {
      helmet.visible = newShowHelmet;
      console.log(`👁️ Helmet ${newShowHelmet ? 'shown' : 'hidden'}`);
    }

    if (football) {
      football.visible = !newShowHelmet;
      console.log(`🏈 Football ${!newShowHelmet ? 'shown' : 'hidden'}`);
    }

    setShowHelmet(newShowHelmet);
  }

  return (
    <main className="w-full h-screen overflow-hidden relative" suppressHydrationWarning>
      <Spline
        scene="/scene.splinecode"
        wasmPath="/"
        onLoad={onLoad}
      />

      {/* View Toggle Button */}
      {helmetLoaded && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={toggleView}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors flex items-center gap-2 font-semibold"
          >
            <span>{showHelmet ? '🏈' : '🪖'}</span>
            <span>Show {showHelmet ? 'Football' : 'Helmet'}</span>
          </button>

          <button
            onClick={() => {
              if (splineRef.current) {
                const camera = splineRef.current.findObjectByName('Camera');
                if (camera) {
                  const info = {
                    position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
                    rotation: { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z }
                  };
                  console.log('📷 Current Camera State:', info);
                  alert(`Camera Position:\nx: ${camera.position.x.toFixed(2)}\ny: ${camera.position.y.toFixed(2)}\nz: ${camera.position.z.toFixed(2)}\n\nRotation:\nx: ${camera.rotation.x.toFixed(2)}\ny: ${camera.rotation.y.toFixed(2)}\nz: ${camera.rotation.z.toFixed(2)}`);
                }
              }
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg shadow-lg transition-colors"
            title="Show camera position"
          >
            📷
          </button>
        </div>
      )}

      {/* Customization Panel */}
      {helmetLoaded && <CustomizationPanel />}

      {/* Console Panel for debugging */}
      <ConsolePanel />
    </main>
  );
}

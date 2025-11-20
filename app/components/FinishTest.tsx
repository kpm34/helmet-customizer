/**
 * Quick Test Component for Shared Package Finishes
 * Add this to your page to verify the integration works
 */

'use client';

import { useEffect, useState } from 'react';
import type { Application } from '@splinetool/runtime';
import {
  GLOSSY,
  MATTE,
  CHROME,
  BRUSHED_METAL,
  SATIN,
  METALLIC_PAINT,
  MaterialFinish
} from '@blender-workspace/shared-3d';

const TEST_FINISHES = [
  GLOSSY,
  MATTE,
  CHROME,
  BRUSHED_METAL,
  SATIN,
  METALLIC_PAINT
];

interface FinishTestProps {
  splineApp: Application | undefined;
}

export function FinishTest({ splineApp }: FinishTestProps) {
  const [selectedFinish, setSelectedFinish] = useState<MaterialFinish>(GLOSSY);
  const [status, setStatus] = useState('Ready');

  const applyTestFinish = (finish: MaterialFinish) => {
    if (!splineApp) {
      setStatus('❌ Spline not loaded');
      return;
    }

    try {
      // Find helmet object (adjust name based on your Spline scene)
      const helmetObject = splineApp.findObjectByName('HelmetShell') ||
                          splineApp.findObjectByName('Helmet') ||
                          splineApp.findObjectByName('helmet');

      if (!helmetObject) {
        setStatus('⚠️  Could not find helmet object');
        return;
      }

      const material = (helmetObject as any).material;
      if (!material) {
        setStatus('⚠️  Object has no material');
        return;
      }

      // Apply finish properties
      material.roughness = finish.roughness;
      material.metalness = finish.metalness;

      if (finish.clearcoat !== undefined) {
        material.clearcoat = finish.clearcoat;
      }

      if (finish.clearcoatRoughness !== undefined) {
        material.clearcoatRoughness = finish.clearcoatRoughness;
      }

      setSelectedFinish(finish);
      setStatus(`✅ Applied ${finish.name}`);

      console.log('Applied finish:', finish);
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
      console.error('Finish application error:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md z-50 border-2 border-blue-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">🧪 Finish Test</h3>
        <div className="text-xs bg-blue-100 px-2 py-1 rounded">
          Shared Package
        </div>
      </div>

      <div className="text-sm mb-3">
        <div className="font-medium">Status: {status}</div>
        <div className="text-gray-600">Current: {selectedFinish.name}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TEST_FINISHES.map((finish) => (
          <button
            key={finish.id}
            onClick={() => applyTestFinish(finish)}
            disabled={!splineApp}
            className={`
              px-3 py-2 rounded text-sm font-medium transition-all
              ${selectedFinish.id === finish.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }
              ${!splineApp ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {finish.name}
            <div className="text-xs mt-1 opacity-75">
              R:{finish.roughness.toFixed(1)} M:{finish.metalness.toFixed(1)}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-500 border-t pt-2">
        Import from @blender-workspace/shared-3d ✅
      </div>
    </div>
  );
}

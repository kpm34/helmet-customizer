/**
 * ONE-LINE TEST COMPONENT
 * Just import and render: <QuickFinishTest splineApp={splineRef.current} />
 */

'use client';

import type { Application } from '@splinetool/runtime';
import { GLOSSY, CHROME, MATTE } from '@blender-workspace/shared-3d';

export function QuickFinishTest({ splineApp }: { splineApp?: Application }) {
  if (!splineApp) return <div className="fixed top-4 right-4 bg-yellow-100 px-4 py-2 rounded">⏳ Loading Spline...</div>;

  const apply = (finish: any) => {
    try {
      const obj = splineApp.findObjectByName('HelmetShell') || splineApp.findObjectByName('Helmet');
      if (obj && (obj as any).material) {
        const mat = (obj as any).material;
        mat.roughness = finish.roughness;
        mat.metalness = finish.metalness;
        alert(`✅ Applied ${finish.name}!`);
      } else {
        alert('⚠️ Could not find helmet object');
      }
    } catch (e) {
      alert('❌ Error: ' + e);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-3 rounded-lg shadow-lg space-x-2 border-2 border-green-500">
      <span className="font-bold">🧪 Quick Test:</span>
      <button onClick={() => apply(GLOSSY)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Glossy</button>
      <button onClick={() => apply(CHROME)} className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">Chrome</button>
      <button onClick={() => apply(MATTE)} className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Matte</button>
    </div>
  );
}

# Material Finish Integration Example

## Overview

This guide shows how to integrate dynamic material finish swapping into your helmet customizer using the shared package finishes.

## Setup

Your 6 preset helmets can now use dynamic finish swapping. The geometry stays constant, only material properties change.

---

## Example 1: Basic Integration in Editor Page

```typescript
// app/editor/page.tsx
'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Application as SplineApp } from '@splinetool/runtime';
import { MaterialFinish } from '@blender-workspace/shared-3d';
import { FinishSelector } from '@/components/FinishSelector';

// Dynamically import Spline component (client-only)
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

export default function EditorPage() {
  const [splineApp, setSplineApp] = useState<SplineApp | null>(null);
  const [currentFinish, setCurrentFinish] = useState<MaterialFinish | null>(null);

  const handleSplineLoad = useCallback((spline: SplineApp) => {
    console.log('Spline loaded');
    setSplineApp(spline);
  }, []);

  const handleFinishChange = useCallback((finish: MaterialFinish) => {
    console.log('Finish changed:', finish.name);
    setCurrentFinish(finish);
    // Optional: Save to user preferences, database, etc.
  }, []);

  return (
    <div className="h-screen flex">
      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Spline
          scene="https://prod.spline.design/YOUR-HELMET-SCENE-ID/scene.splinecode"
          onLoad={handleSplineLoad}
        />
      </div>

      {/* Customization Panel */}
      <div className="w-96 bg-white p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Customize Helmet</h2>

        {/* Finish Selector */}
        <FinishSelector
          splineApp={splineApp}
          onFinishChange={handleFinishChange}
        />

        {/* Add color picker, pattern selector, etc. below */}
      </div>
    </div>
  );
}
```

---

## Example 2: Loading Preset Helmets with Finishes

```typescript
// lib/helmetPresets.ts
import type { Application as SplineApp } from '@splinetool/runtime';
import {
  GLOSSY,
  MATTE,
  CHROME,
  BRUSHED_METAL,
  SATIN,
  METALLIC_PAINT,
  MaterialFinish
} from '@blender-workspace/shared-3d';
import { applyFinishToHelmet } from './spline/finishApplicator';

/**
 * 6 preset helmet configurations
 */
export const HELMET_PRESETS = [
  {
    id: 1,
    name: 'Glossy Pro',
    finish: GLOSSY,
    splineUrl: 'https://prod.spline.design/YOUR-PRESET-1/scene.splinecode',
    description: 'High-shine polished finish for a premium look'
  },
  {
    id: 2,
    name: 'Matte Classic',
    finish: MATTE,
    splineUrl: 'https://prod.spline.design/YOUR-PRESET-2/scene.splinecode',
    description: 'Flat no-shine finish for a subtle appearance'
  },
  {
    id: 3,
    name: 'Chrome Elite',
    finish: CHROME,
    splineUrl: 'https://prod.spline.design/YOUR-PRESET-3/scene.splinecode',
    description: 'Mirror-like metallic finish'
  },
  {
    id: 4,
    name: 'Brushed Metal',
    finish: BRUSHED_METAL,
    splineUrl: 'https://prod.spline.design/YOUR-PRESET-4/scene.splinecode',
    description: 'Anisotropic metallic texture'
  },
  {
    id: 5,
    name: 'Satin Smooth',
    finish: SATIN,
    splineUrl: 'https://prod.spline.design/YOUR-PRESET-5/scene.splinecode',
    description: 'Semi-gloss finish with soft reflection'
  },
  {
    id: 6,
    name: 'Metallic Flake',
    finish: METALLIC_PAINT,
    splineUrl: 'https://prod.spline.design/YOUR-PRESET-6/scene.splinecode',
    description: 'Metallic paint with sparkle effect'
  }
];

/**
 * Load a preset helmet
 */
export function loadPreset(splineApp: SplineApp, presetId: number) {
  const preset = HELMET_PRESETS.find(p => p.id === presetId);
  if (!preset) {
    throw new Error(`Preset ${presetId} not found`);
  }

  // Apply the preset's finish
  applyFinishToHelmet(splineApp, preset.finish);

  return preset;
}
```

---

## Example 3: Preset Selector Component

```typescript
// components/PresetSelector.tsx
'use client';

import { useState } from 'react';
import type { Application as SplineApp } from '@splinetool/runtime';
import { HELMET_PRESETS, loadPreset } from '@/lib/helmetPresets';

interface PresetSelectorProps {
  splineApp: SplineApp | null;
  onPresetChange?: (presetId: number) => void;
}

export function PresetSelector({ splineApp, onPresetChange }: PresetSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState(1);

  const handlePresetSelect = (presetId: number) => {
    if (!splineApp) return;

    try {
      loadPreset(splineApp, presetId);
      setSelectedPreset(presetId);
      onPresetChange?.(presetId);
    } catch (error) {
      console.error('Error loading preset:', error);
    }
  };

  return (
    <div className="preset-selector mb-6">
      <h3 className="text-lg font-semibold mb-4">Preset Helmets</h3>

      <div className="grid grid-cols-2 gap-3">
        {HELMET_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetSelect(preset.id)}
            className={`
              p-4 rounded-lg border-2 transition-all text-left
              ${selectedPreset === preset.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className="font-medium mb-1">{preset.name}</div>
            <div className="text-xs text-gray-600">{preset.description}</div>
            <div className="mt-2 text-xs font-mono text-gray-500">
              {preset.finish.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## Example 4: Advanced - Per-Part Finish Control

If you want different finishes on different helmet parts:

```typescript
// components/AdvancedFinishSelector.tsx
'use client';

import { useState } from 'react';
import type { Application as SplineApp } from '@splinetool/runtime';
import {
  MaterialFinish,
  GLOSSY,
  CHROME,
  MATTE
} from '@blender-workspace/shared-3d';
import { applyFinishesToHelmetParts } from '@/lib/spline/finishApplicator';

interface FinishMap {
  shell: MaterialFinish;
  facemask: MaterialFinish;
  chinstrap: MaterialFinish;
}

export function AdvancedFinishSelector({ splineApp }: { splineApp: SplineApp | null }) {
  const [finishes, setFinishes] = useState<FinishMap>({
    shell: GLOSSY,
    facemask: CHROME,
    chinstrap: MATTE
  });

  const applyFinishes = () => {
    if (!splineApp) return;

    applyFinishesToHelmetParts(splineApp, {
      'HelmetShell': finishes.shell,
      'Facemask': finishes.facemask,
      'Chinstrap': finishes.chinstrap
    });
  };

  const updatePartFinish = (part: keyof FinishMap, finish: MaterialFinish) => {
    setFinishes(prev => ({ ...prev, [part]: finish }));
  };

  // Apply finishes whenever they change
  useEffect(() => {
    applyFinishes();
  }, [finishes, splineApp]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Per-Part Finish Control</h3>

      {/* Shell Finish */}
      <div>
        <label className="block text-sm font-medium mb-2">Helmet Shell</label>
        <select
          value={finishes.shell.id}
          onChange={(e) => {
            const finish = getFinishById(e.target.value);
            if (finish) updatePartFinish('shell', finish);
          }}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {/* Options for each finish */}
        </select>
      </div>

      {/* Facemask Finish */}
      <div>
        <label className="block text-sm font-medium mb-2">Facemask</label>
        <select
          value={finishes.facemask.id}
          onChange={(e) => {
            const finish = getFinishById(e.target.value);
            if (finish) updatePartFinish('facemask', finish);
          }}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {/* Options for each finish */}
        </select>
      </div>

      {/* Chinstrap Finish */}
      <div>
        <label className="block text-sm font-medium mb-2">Chinstrap</label>
        <select
          value={finishes.chinstrap.id}
          onChange={(e) => {
            const finish = getFinishById(e.target.value);
            if (finish) updatePartFinish('chinstrap', finish);
          }}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {/* Options for each finish */}
        </select>
      </div>
    </div>
  );
}
```

---

## How It Works

### 1. Geometry Stays Constant ✅
- Your 6 preset helmets keep their exact same shape
- Only material properties (roughness, metalness) change
- No need to swap 3D models

### 2. Material Properties Updated Dynamically
```typescript
// Before: User selects "Glossy"
material.roughness = 0.1;  // Smooth
material.metalness = 0.0;  // Non-metal
material.clearcoat = 1.0;  // Full clearcoat

// After: User selects "Chrome"
material.roughness = 0.0;  // Mirror smooth
material.metalness = 1.0;  // Full metal
material.clearcoat = 1.0;  // Full clearcoat
```

### 3. Color Preserved
By default, `applyFinishToSplineObject` preserves the current color:
```typescript
applyFinishToSplineObject(splineApp, 'HelmetShell', CHROME, true); // preserveColor = true
```

---

## Testing

### Test Finish Swapping:
```typescript
// In browser console
import { GLOSSY, CHROME, MATTE } from '@blender-workspace/shared-3d';
import { applyFinishToHelmet } from '@/lib/spline/finishApplicator';

// Apply glossy
applyFinishToHelmet(window.splineApp, GLOSSY);

// Wait 2 seconds, then apply chrome
setTimeout(() => {
  applyFinishToHelmet(window.splineApp, CHROME);
}, 2000);

// Wait 2 more seconds, apply matte
setTimeout(() => {
  applyFinishToHelmet(window.splineApp, MATTE);
}, 4000);
```

---

## Best Practices

1. **Single Scene, Multiple Finishes**
   - Use ONE Spline scene for all 6 presets
   - Swap finishes programmatically
   - Saves file size and loading time

2. **Preserve Colors**
   - Always set `preserveColor: true` when swapping finishes
   - Colors should be controlled separately from finishes

3. **Object Naming in Spline**
   - Use consistent names: `HelmetShell`, `Facemask`, `Chinstrap`
   - Makes it easy to target specific parts

4. **Performance**
   - Finish updates are instant (just property changes)
   - No need to reload the entire scene

---

## Summary

✅ **6 preset helmets** → Use 6 different finish combinations
✅ **Constant geometry** → Only material properties change
✅ **Dynamic swapping** → Users can change finishes in real-time
✅ **Shared package** → All finishes come from `@blender-workspace/shared-3d`
✅ **Type-safe** → Full TypeScript support

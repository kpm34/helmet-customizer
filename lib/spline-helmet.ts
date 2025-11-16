/**
 * Helmet Customization Logic
 * All helmet manipulation functions using Spline API
 */

import type { Application } from '@splinetool/runtime';
import type { HelmetZone, MaterialFinish } from '@/store/helmetStore';

// ============================================================
// ZONE OBJECT NAME PATTERNS
// ============================================================

// Map zones to their object name patterns in Spline scene
const ZONE_PATTERNS: Record<HelmetZone, string[]> = {
  shell: ['UV01_Shell'],
  facemask: ['Facemask_Complete'],
  chinstrap: ['UV01_Chinst', 'UV02_Chinst', 'UV03_Chinst'], // Multiple chinstrap parts
  padding: ['UV01_Padding', 'UV03_Padding'], // Multiple padding parts
  hardware: ['Hardware_'], // Prefix for all hardware pieces (Hardware_01 - Hardware_20+)
};

/**
 * Find all objects for a given zone
 * Some zones have multiple objects (chinstrap, padding, hardware)
 */
function findZoneObjects(spline: Application, zone: HelmetZone): any[] {
  const allObjects = spline.getAllObjects();
  const patterns = ZONE_PATTERNS[zone];
  const foundObjects: any[] = [];

  patterns.forEach(pattern => {
    // If pattern ends with underscore, it's a prefix match (for hardware)
    if (pattern.endsWith('_')) {
      const matches = allObjects.filter(obj =>
        obj.name && obj.name.startsWith(pattern)
      );
      foundObjects.push(...matches);
    } else {
      // Exact or partial match
      const obj = spline.findObjectByName(pattern);
      if (obj) {
        foundObjects.push(obj);
      }
    }
  });

  if (foundObjects.length === 0) {
    console.warn(`⚠️ No objects found for zone: ${zone}`);
  } else {
    console.log(`✓ Found ${foundObjects.length} object(s) for ${zone}:`,
      foundObjects.map(o => o.name).join(', ')
    );
  }

  return foundObjects;
}

// ============================================================
// HELMET COLOR CUSTOMIZATION (All 5 Zones)
// ============================================================

/**
 * Change color for a specific zone
 * Handles zones with multiple objects (chinstrap, padding, hardware)
 */
export function changeZoneColor(spline: Application, zone: HelmetZone, color: string) {
  const objects = findZoneObjects(spline, zone);

  objects.forEach(obj => {
    obj.color = color;
  });

  if (objects.length > 0) {
    console.log(`✅ Changed ${zone} color to ${color} (${objects.length} objects)`);
  }
}

// Legacy functions (for backwards compatibility)
export function changeShellColor(spline: Application, color: string) {
  changeZoneColor(spline, 'shell', color);
}

export function changeFacemaskColor(spline: Application, color: string) {
  changeZoneColor(spline, 'facemask', color);
}

// ============================================================
// MATERIAL FINISH PRESETS
// ============================================================

export const FINISH_PRESETS = {
  glossy: {
    name: 'Glossy Plastic',
    metalness: 0.0,
    roughness: 0.1,
  },
  matte: {
    name: 'Matte Plastic',
    metalness: 0.0,
    roughness: 0.8,
  },
  chrome: {
    name: 'Chrome Mirror',
    metalness: 1.0,
    roughness: 0.05,
  },
  brushed: {
    name: 'Brushed Metal',
    metalness: 0.9,
    roughness: 0.35,
  },
  satin: {
    name: 'Satin',
    metalness: 0.1,
    roughness: 0.5,
  },
} as const;

export type FinishType = keyof typeof FINISH_PRESETS;

/**
 * Apply material finish to a specific zone
 * Handles zones with multiple objects
 */
export function applyZoneFinish(spline: Application, zone: HelmetZone, finish: MaterialFinish) {
  const objects = findZoneObjects(spline, zone);
  const preset = FINISH_PRESETS[finish];

  objects.forEach(obj => {
    // Note: Spline's material system uses type assertion
    // Material properties may need runtime testing
    const typedObj = obj as any;
    if (typedObj.material) {
      typedObj.material.metalness = preset.metalness;
      typedObj.material.roughness = preset.roughness;
    }
  });

  if (objects.length > 0) {
    console.log(`✅ Applied ${finish} finish to ${zone} (${objects.length} objects)`);
  }
}

// Legacy functions (for backwards compatibility)
export function applyShellFinish(spline: Application, finish: FinishType) {
  applyZoneFinish(spline, 'shell', finish as MaterialFinish);
}

export function applyFacemaskFinish(spline: Application, finish: FinishType) {
  applyZoneFinish(spline, 'facemask', finish as MaterialFinish);
}

// ============================================================
// CAMERA PRESET VIEWS
// ============================================================

export const CAMERA_PRESETS = {
  front: {
    position: { x: 0, y: 0, z: 5 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  side: {
    position: { x: 5, y: 0, z: 0 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
  },
  back: {
    position: { x: 0, y: 0, z: -5 },
    rotation: { x: 0, y: Math.PI, z: 0 },
  },
  threequarter: {
    position: { x: 4, y: 2, z: 4 },
    rotation: { x: -0.3, y: Math.PI / 4, z: 0 },
  },
} as const;

export type CameraView = keyof typeof CAMERA_PRESETS;

export function setCameraView(spline: Application, view: CameraView) {
  const camera = spline.findObjectByName('Camera');
  if (camera) {
    const preset = CAMERA_PRESETS[view];
    // Spline camera uses plain objects, not THREE.Vector3/Euler
    camera.position.x = preset.position.x;
    camera.position.y = preset.position.y;
    camera.position.z = preset.position.z;
    camera.rotation.x = preset.rotation.x;
    camera.rotation.y = preset.rotation.y;
    camera.rotation.z = preset.rotation.z;
  }
}

// ============================================================
// PATTERN OVERLAYS (Future implementation)
// ============================================================

export function applyPattern(spline: Application, patternUrl: string) {
  // TODO: Implement pattern system using Spline's texture loading
  console.log('Pattern system:', patternUrl);
}

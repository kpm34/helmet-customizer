/**
 * Helmet Customization Logic
 * All helmet manipulation functions using Spline API
 */

import type { Application } from '@splinetool/runtime';

// ============================================================
// HELMET COLOR CUSTOMIZATION
// ============================================================

export function changeShellColor(spline: Application, color: string) {
  const shell = spline.findObjectByName('UV01_Shell');
  if (shell) {
    shell.color = color;
  }
}

export function changeFacemaskColor(spline: Application, color: string) {
  const facemask = spline.findObjectByName('Facemask_Complete');
  if (facemask) {
    facemask.color = color;
  }
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

export function applyShellFinish(spline: Application, finish: FinishType) {
  const shell = spline.findObjectByName('UV01_Shell');
  if (shell) {
    const preset = FINISH_PRESETS[finish];
    // Note: Spline's material system uses type assertion
    // Material properties may need runtime testing
    const obj = shell as any;
    if (obj.material) {
      obj.material.metalness = preset.metalness;
      obj.material.roughness = preset.roughness;
    }
  }
}

export function applyFacemaskFinish(spline: Application, finish: FinishType) {
  const facemask = spline.findObjectByName('Facemask_Complete');
  if (facemask) {
    const preset = FINISH_PRESETS[finish];
    const obj = facemask as any;
    if (obj.material) {
      obj.material.metalness = preset.metalness;
      obj.material.roughness = preset.roughness;
    }
  }
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

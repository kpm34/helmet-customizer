/**
 * Helmet Customization Logic
 * All helmet manipulation functions in ONE file
 */

import * as THREE from 'three';
import type { Application } from '@splinetool/runtime';

// ============================================================
// HELMET COLOR CUSTOMIZATION
// ============================================================

export function changeShellColor(helmet: THREE.Object3D, color: string) {
  const shell = helmet.getObjectByName('UV01_Shell');
  if (shell && (shell as THREE.Mesh).material) {
    const mesh = shell as THREE.Mesh;
    const material = mesh.material as THREE.MeshStandardMaterial;
    material.color.set(color);
  }
}

export function changeFacemaskColor(helmet: THREE.Object3D, color: string) {
  const facemask = helmet.getObjectByName('Facemask_Complete');
  if (facemask && (facemask as THREE.Mesh).material) {
    const mesh = facemask as THREE.Mesh;
    const material = mesh.material as THREE.MeshStandardMaterial;
    material.color.set(color);
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

export function applyShellFinish(helmet: THREE.Object3D, finish: FinishType) {
  const shell = helmet.getObjectByName('UV01_Shell');
  if (shell && (shell as THREE.Mesh).material) {
    const mesh = shell as THREE.Mesh;
    const material = mesh.material as THREE.MeshStandardMaterial;
    const preset = FINISH_PRESETS[finish];

    material.metalness = preset.metalness;
    material.roughness = preset.roughness;
    material.needsUpdate = true;
  }
}

export function applyFacemaskFinish(helmet: THREE.Object3D, finish: FinishType) {
  const facemask = helmet.getObjectByName('Facemask_Complete');
  if (facemask && (facemask as THREE.Mesh).material) {
    const mesh = facemask as THREE.Mesh;
    const material = mesh.material as THREE.MeshStandardMaterial;
    const preset = FINISH_PRESETS[finish];

    material.metalness = preset.metalness;
    material.roughness = preset.roughness;
    material.needsUpdate = true;
  }
}

// ============================================================
// CAMERA PRESET VIEWS
// ============================================================

export const CAMERA_PRESETS = {
  front: {
    position: new THREE.Vector3(0, 0, 5),
    rotation: new THREE.Euler(0, 0, 0),
  },
  side: {
    position: new THREE.Vector3(5, 0, 0),
    rotation: new THREE.Euler(0, Math.PI / 2, 0),
  },
  back: {
    position: new THREE.Vector3(0, 0, -5),
    rotation: new THREE.Euler(0, Math.PI, 0),
  },
  threequarter: {
    position: new THREE.Vector3(4, 2, 4),
    rotation: new THREE.Euler(-0.3, Math.PI / 4, 0),
  },
} as const;

export type CameraView = keyof typeof CAMERA_PRESETS;

export function setCameraView(spline: Application, view: CameraView) {
  const camera = spline.findObjectByName('Camera');
  if (camera) {
    const preset = CAMERA_PRESETS[view];
    camera.position.copy(preset.position);
    camera.rotation.copy(preset.rotation);
  }
}

// ============================================================
// PATTERN OVERLAYS (Future implementation)
// ============================================================

export function applyPattern(helmet: THREE.Object3D, patternUrl: string) {
  // TODO: Load texture and apply to shell material.map
  console.log('Pattern system:', patternUrl);
}

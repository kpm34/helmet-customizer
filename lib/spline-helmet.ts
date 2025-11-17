/**
 * Helmet Customization Logic - Hybrid Approach
 * Uses @splinetool/runtime but accesses underlying THREE.js scene
 * for direct material manipulation
 */

import type { Application } from '@splinetool/runtime';
import * as THREE from 'three';
import type { HelmetZone, MaterialFinish } from '@/store/helmetStore';
import { FINISH_PRESETS } from '@/lib/constants';

// ============================================================
// ZONE OBJECT NAME PATTERNS
// ============================================================

const ZONE_PATTERNS: Record<HelmetZone, string[]> = {
  shell: ['UV01_Shell'],
  facemask: ['Facemask_Complete'],
  chinstrap: ['UV01_Chinstrap', 'UV02_Chinstrap_Strap', 'UV03_Chinstrap'],
  padding: ['UV01_Padding', 'UV03_Padding'],
  hardware: ['Hardware_'],
};

/**
 * Get the underlying THREE.js scene from Spline Runtime
 * This gives us direct access to materials without wrapper interference
 */
export function getThreeScene(spline: Application): THREE.Scene | null {
  try {
    // @ts-ignore - getThreeJsScene exists but may not be in types
    const scene = spline.getThreeJsScene?.();
    if (scene) {
      console.log('✅ Accessed THREE.js scene from Spline Runtime');
      return scene;
    }
  } catch (e) {
    console.warn('⚠️ Could not access THREE.js scene:', e);
  }
  return null;
}

/**
 * Find zone objects using THREE.js traverse
 * Much more efficient than getAllObjects()
 */
export function findZoneObjectsDirect(
  spline: Application,
  zone: HelmetZone
): THREE.Object3D[] {
  const scene = getThreeScene(spline);
  if (!scene) {
    console.warn('⚠️ THREE.js scene not accessible');
    return [];
  }

  const patterns = ZONE_PATTERNS[zone];
  const foundObjects: THREE.Object3D[] = [];

  scene.traverse((child) => {
    if (!child.name) return;

    const isMatch = patterns.some(pattern => {
      if (pattern.endsWith('_')) {
        return child.name.startsWith(pattern);
      }
      return child.name === pattern;
    });

    if (isMatch) {
      foundObjects.push(child);
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

/**
 * Change zone color using direct THREE.js material access
 * This is MORE RELIABLE than using Spline's wrapper
 */
export function changeZoneColorDirect(
  spline: Application,
  zone: HelmetZone,
  color: string
): boolean {
  const objects = findZoneObjectsDirect(spline, zone);
  if (objects.length === 0) return false;

  const threeColor = new THREE.Color(color);
  let successCount = 0;

  objects.forEach(obj => {
    const mesh = obj as THREE.Mesh;

    if (!mesh.material) {
      console.warn(`⚠️ No material on ${obj.name}`);
      return;
    }

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

    materials.forEach((material: THREE.Material) => {
      // Set color
      if ('color' in material && material.color instanceof THREE.Color) {
        material.color.copy(threeColor);
      }

      // CRITICAL: Force 100% opacity
      if ('opacity' in material) (material as any).opacity = 1.0;
      if ('transparent' in material) (material as any).transparent = false;
      if ('depthWrite' in material) (material as any).depthWrite = true;
      if ('alphaTest' in material) (material as any).alphaTest = 0;

      material.needsUpdate = true;
      successCount++;

      console.log(`✅ Set color for ${obj.name} to ${color} (direct THREE.js)`);
    });
  });

  console.log(`🎨 Changed ${zone} color to ${color} (${successCount} materials updated)`);
  return successCount > 0;
}

/**
 * Apply finish using direct THREE.js material access
 */
export function applyZoneFinishDirect(
  spline: Application,
  zone: HelmetZone,
  finish: MaterialFinish
): boolean {
  const objects = findZoneObjectsDirect(spline, zone);
  if (objects.length === 0) return false;

  const preset = FINISH_PRESETS[finish];
  let successCount = 0;

  objects.forEach(obj => {
    const mesh = obj as THREE.Mesh;

    if (!mesh.material) return;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

    materials.forEach((material: THREE.Material) => {
      if ('metalness' in material) (material as any).metalness = preset.metalness;
      if ('roughness' in material) (material as any).roughness = preset.roughness;

      material.needsUpdate = true;
      successCount++;

      console.log(`✅ Applied ${finish} finish to ${obj.name} (direct THREE.js)`);
    });
  });

  console.log(`✨ Applied ${finish} finish to ${zone} (${successCount} materials)`);
  return successCount > 0;
}

/**
 * Force 100% opacity on all helmet zones
 * Use on scene load
 */
export function forceHelmetOpacityDirect(spline: Application): number {
  const scene = getThreeScene(spline);
  if (!scene) {
    console.warn('⚠️ Cannot force opacity - THREE.js scene not accessible');
    return 0;
  }

  console.log('🔒 Forcing 100% opacity via direct THREE.js access...');

  const zones: HelmetZone[] = ['shell', 'facemask', 'chinstrap', 'padding', 'hardware'];
  let count = 0;

  zones.forEach(zone => {
    const objects = findZoneObjectsDirect(spline, zone);

    objects.forEach(obj => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.material) return;

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      materials.forEach((material: THREE.Material) => {
        if ('opacity' in material) (material as any).opacity = 1.0;
        if ('transparent' in material) (material as any).transparent = false;
        if ('depthWrite' in material) (material as any).depthWrite = true;
        if ('alphaTest' in material) (material as any).alphaTest = 0;
        material.needsUpdate = true;
        count++;
      });
    });
  });

  console.log(`✅ Forced opacity for ${count} materials (direct THREE.js)`);
  return count;
}

/**
 * Continuous opacity enforcement via render loop
 * Call this once on scene load to prevent any opacity resets
 */
export function startOpacityEnforcement(spline: Application): () => void {
  const scene = getThreeScene(spline);
  if (!scene) {
    console.warn('⚠️ Cannot start opacity enforcement - no THREE.js scene');
    return () => {};
  }

  console.log('🔄 Starting continuous opacity enforcement...');

  const zones: HelmetZone[] = ['shell', 'facemask', 'chinstrap', 'padding', 'hardware'];
  const helmetObjects: THREE.Mesh[] = [];

  // Collect all helmet meshes once
  zones.forEach(zone => {
    const objects = findZoneObjectsDirect(spline, zone);
    objects.forEach(obj => {
      if ((obj as THREE.Mesh).material) {
        helmetObjects.push(obj as THREE.Mesh);
      }
    });
  });

  console.log(`✅ Monitoring ${helmetObjects.length} helmet objects for opacity`);

  // Render loop to enforce opacity
  let frameCount = 0;
  const enforce = () => {
    frameCount++;

    // Check every 10 frames (not every frame for performance)
    if (frameCount % 10 === 0) {
      helmetObjects.forEach(mesh => {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        materials.forEach((material: THREE.Material) => {
          if ('opacity' in material && (material as any).opacity !== 1.0) {
            console.warn(`⚠️ Opacity reset detected on ${mesh.name}, fixing...`);
            (material as any).opacity = 1.0;
            (material as any).transparent = false;
            material.needsUpdate = true;
          }
        });
      });
    }

    requestAnimationFrame(enforce);
  };

  const rafId = requestAnimationFrame(enforce);

  // Return cleanup function
  return () => {
    cancelAnimationFrame(rafId);
    console.log('🛑 Stopped opacity enforcement');
  };
}

// ============================================================
// SPLINE VARIABLE MANIPULATION
// ============================================================

/**
 * Set a Spline variable value
 * Variables can be used to control animations, visibility, and other properties
 *
 * Example:
 * setVariable(spline, 'shellFinish', 'glossy');
 */
export function setVariable(spline: Application, variableName: string, value: string | number | boolean) {
  try {
    spline.setVariable(variableName, value);
    console.log(`✅ Set variable "${variableName}" = ${value}`);
  } catch (e) {
    console.error(`❌ Failed to set variable "${variableName}":`, e);
  }
}

/**
 * Get current value of a Spline variable
 */
export function getVariable(spline: Application, variableName: string): any {
  try {
    const value = spline.getVariable(variableName);
    console.log(`📖 Variable "${variableName}" = ${value}`);
    return value;
  } catch (e) {
    console.error(`❌ Failed to get variable "${variableName}":`, e);
    return undefined;
  }
}

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

// Map zones to their PARENT CONTAINER names in Spline
// We'll color all children inside these containers
const ZONE_PATTERNS: Record<HelmetZone, string[]> = {
  shell: ['Helmet_Parent'],  // Parent container for all helmet parts
  facemask: ['Facemask_Combined'],  // Facemask parent group
  chinstrap: ['Chinstrap_Cup', 'Chinstrap_Left', 'Chinstrap_Right'],  // All chinstrap groups
  padding: ['UV01_Padding', 'UV03_Padding'],
  hardware: ['Hardware_'],
};

/**
 * Get the underlying THREE.js scene from Spline Runtime
 * This gives us direct access to materials without wrapper interference
 */
export function getThreeScene(spline: Application): THREE.Scene | null {
  try {
    // Try multiple methods to access THREE.js scene
    // @ts-ignore - Different Spline versions have different APIs
    let scene = spline.getThreeJsScene?.();

    if (!scene) {
      // @ts-ignore - Try alternative method
      scene = spline._scene;
    }

    if (!scene) {
      // @ts-ignore - Try another alternative
      scene = spline.scene;
    }

    if (scene) {
      console.log('✅ Accessed THREE.js scene from Spline Runtime');
      return scene;
    }

    console.warn('⚠️ THREE.js scene not found in Spline Runtime - will use Spline wrapper API');
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
 * Falls back to Spline API if THREE.js not accessible
 */
export function changeZoneColorDirect(
  spline: Application,
  zone: HelmetZone,
  color: string
): boolean {
  const objects = findZoneObjectsDirect(spline, zone);
  if (objects.length === 0) {
    // Fallback: Try using Spline's native API
    console.log(`⚠️ THREE.js not accessible, falling back to Spline API for ${zone}`);
    return changeZoneColorSplineAPI(spline, zone, color);
  }

  const threeColor = new THREE.Color(color);
  let successCount = 0;

  // Helper function to recursively color all meshes in a hierarchy
  const colorMeshRecursive = (obj: THREE.Object3D, depth: number = 0) => {
    const indent = '  '.repeat(depth);

    // Try to color this object if it has a material
    const mesh = obj as THREE.Mesh;
    if (mesh.material) {
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

        console.log(`${indent}✅ Set color for ${obj.name} to ${color} (direct THREE.js)`);
      });
    } else if (depth === 0) {
      console.log(`${indent}⚠️ No material on ${obj.name} - traversing children...`);
    }

    // Recursively traverse children
    if (obj.children && obj.children.length > 0) {
      console.log(`${indent}📂 Traversing ${obj.children.length} children of ${obj.name}`);
      obj.children.forEach(child => colorMeshRecursive(child, depth + 1));
    }
  };

  objects.forEach(obj => {
    colorMeshRecursive(obj);
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
  if (objects.length === 0) {
    // Fallback: Try using Spline API (though it won't support metalness/roughness)
    console.log(`⚠️ THREE.js not accessible, falling back to Spline API for finish`);
    return applyZoneFinishSplineAPI(spline, zone, finish);
  }

  const preset = FINISH_PRESETS[finish];
  let successCount = 0;

  // Helper function to recursively apply finish to all meshes in a hierarchy
  const applyFinishRecursive = (obj: THREE.Object3D, depth: number = 0) => {
    const indent = '  '.repeat(depth);

    // Try to apply finish if this object has a material
    const mesh = obj as THREE.Mesh;
    if (mesh.material) {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      materials.forEach((material: THREE.Material) => {
        if ('metalness' in material) (material as any).metalness = preset.metalness;
        if ('roughness' in material) (material as any).roughness = preset.roughness;

        material.needsUpdate = true;
        successCount++;

        console.log(`${indent}✅ Applied ${finish} finish to ${obj.name} (direct THREE.js)`);
      });
    }

    // Recursively traverse children
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach(child => applyFinishRecursive(child, depth + 1));
    }
  };

  objects.forEach(obj => {
    applyFinishRecursive(obj);
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

// ============================================================
// FALLBACK: SPLINE NATIVE API (when THREE.js not accessible)
// ============================================================

/**
 * Fallback color change using Spline's native API
 * Use when THREE.js scene is not accessible
 * Colors the parent container AND all its children
 */
function changeZoneColorSplineAPI(
  spline: Application,
  zone: HelmetZone,
  color: string
): boolean {
  console.log(`\n🔍 === DEBUG: changeZoneColorSplineAPI called ===`);
  console.log(`Zone: ${zone}`);
  console.log(`Color: ${color}`);

  const patterns = ZONE_PATTERNS[zone];
  console.log(`Looking for patterns:`, patterns);

  const allObjects = spline.getAllObjects();
  console.log(`Total objects in scene: ${allObjects.length}`);

  let successCount = 0;

  patterns.forEach(pattern => {
    console.log(`\n🔎 Searching for pattern: "${pattern}"`);

    // Find parent containers
    const parents = pattern.endsWith('_')
      ? allObjects.filter(obj => obj.name && obj.name.startsWith(pattern))
      : allObjects.filter(obj => obj.name === pattern);

    console.log(`Found ${parents.length} parent(s) matching pattern "${pattern}":`, parents.map(p => p.name));

    if (parents.length === 0) {
      console.warn(`⚠️ No parents found for pattern "${pattern}"`);
      console.log(`Available object names:`, allObjects.slice(0, 20).map(o => o.name));
    }

    parents.forEach(parent => {
      try {
        console.log(`\n📦 Processing parent: ${parent.name}`);
        console.log(`Parent UUID: ${(parent as any).uuid}`);
        console.log(`Parent type: ${(parent as any).type}`);

        // Color the parent
        const oldColor = (parent as any).color;
        (parent as any).color = color;
        const newColor = (parent as any).color;

        console.log(`Parent color change: ${oldColor} → ${newColor} (expected: ${color})`);
        console.log(`✅ Set color for ${parent.name} to ${color} (Spline API - parent)`);
        successCount++;

        // Find and color ALL children of this parent
        const parentUuid = (parent as any).uuid;
        const children = allObjects.filter(obj => (obj as any).parentUuid === parentUuid);

        console.log(`Found ${children.length} direct children of ${parent.name}`);

        children.forEach((child, index) => {
          try {
            const childOldColor = (child as any).color;
            (child as any).color = color;
            const childNewColor = (child as any).color;

            console.log(`  Child ${index + 1}/${children.length}: ${child.name} (type: ${(child as any).type})`);
            console.log(`    Color: ${childOldColor} → ${childNewColor}`);
            console.log(`✅ Set color for ${child.name} to ${color} (Spline API - child)`);
            successCount++;

            // RECURSIVELY color grandchildren (nested objects)
            const childUuid = (child as any).uuid;
            const grandchildren = allObjects.filter(obj => (obj as any).parentUuid === childUuid);

            if (grandchildren.length > 0) {
              console.log(`    Found ${grandchildren.length} grandchildren of ${child.name}`);
              grandchildren.forEach((grandchild, gIndex) => {
                try {
                  (grandchild as any).color = color;
                  console.log(`      Grandchild ${gIndex + 1}: ${grandchild.name}`);
                  successCount++;
                } catch (e) {
                  console.error(`      ❌ Failed to color grandchild ${grandchild.name}:`, e);
                }
              });
            }
          } catch (e) {
            console.error(`❌ Failed to set color on child ${child.name}:`, e);
          }
        });
      } catch (e) {
        console.error(`❌ Failed to set color on parent ${parent.name}:`, e);
      }
    });
  });

  console.log(`\n🎨 === SUMMARY ===`);
  console.log(`Zone: ${zone}`);
  console.log(`Target color: ${color}`);
  console.log(`Objects updated: ${successCount}`);
  console.log(`Success: ${successCount > 0}`);
  console.log(`=================\n`);

  return successCount > 0;
}

/**
 * Fallback finish application using Spline's native API
 */
function applyZoneFinishSplineAPI(
  spline: Application,
  zone: HelmetZone,
  finish: MaterialFinish
): boolean {
  console.warn(`⚠️ Material finish not supported with Spline API - THREE.js access required`);
  console.log(`Attempted to apply ${finish} finish to ${zone} but Spline API doesn't expose metalness/roughness`);
  return false;
}

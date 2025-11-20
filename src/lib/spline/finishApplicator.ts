/**
 * Spline Material Finish Applicator
 *
 * Applies material finishes from @blender-workspace/shared-3d to Spline objects
 * without changing geometry. Works with the 6 preset helmets.
 */

import {
  MaterialFinish,
  MATERIAL_FINISHES,
  GLOSSY,
  MATTE,
  CHROME,
  BRUSHED_METAL,
  SATIN,
  METALLIC_PAINT
} from '@blender-workspace/shared-3d';

import type { Application as SplineApp } from '@splinetool/runtime';

/**
 * Available finishes for helmet customizer
 * (6 finishes matching your 6 preset helmets)
 */
export const HELMET_FINISHES = {
  GLOSSY,
  MATTE,
  CHROME,
  BRUSHED_METAL,
  SATIN,
  METALLIC_PAINT
} as const;

export type HelmetFinishType = keyof typeof HELMET_FINISHES;

/**
 * Apply a material finish to a Spline object by name
 *
 * @param splineApp - Spline Application instance
 * @param objectName - Name of the helmet object in Spline (e.g., "HelmetShell")
 * @param finish - Material finish from shared package
 * @param preserveColor - If true, keeps the current color (default: true)
 *
 * @example
 * ```typescript
 * // Apply glossy finish to helmet
 * applyFinishToSplineObject(splineApp, 'HelmetShell', GLOSSY);
 *
 * // Apply chrome finish to facemask
 * applyFinishToSplineObject(splineApp, 'Facemask', CHROME);
 * ```
 */
export function applyFinishToSplineObject(
  splineApp: SplineApp,
  objectName: string,
  finish: MaterialFinish,
  preserveColor: boolean = true
): void {
  try {
    // Find the object in Spline scene
    const object = splineApp.findObjectByName(objectName);

    if (!object) {
      console.warn(`Object "${objectName}" not found in Spline scene`);
      return;
    }

    // Get the material (Spline objects have a material property)
    const material = (object as any).material;

    if (!material) {
      console.warn(`Object "${objectName}" has no material`);
      return;
    }

    // Store current color if preserving
    let currentColor;
    if (preserveColor && material.color) {
      currentColor = { ...material.color };
    }

    // Apply finish properties to Spline material
    // Spline uses roughness and metalness like Three.js
    if (typeof material.roughness !== 'undefined') {
      material.roughness = finish.roughness;
    }

    if (typeof material.metalness !== 'undefined') {
      material.metalness = finish.metalness;
    }

    // Apply clearcoat if available (Spline supports this)
    if (finish.clearcoat !== undefined && typeof material.clearcoat !== 'undefined') {
      material.clearcoat = finish.clearcoat;
    }

    if (finish.clearcoatRoughness !== undefined && typeof material.clearcoatRoughness !== 'undefined') {
      material.clearcoatRoughness = finish.clearcoatRoughness;
    }

    // Apply emissive if available
    if (finish.emissiveIntensity !== undefined && typeof material.emissiveIntensity !== 'undefined') {
      material.emissiveIntensity = finish.emissiveIntensity;
    }

    // Restore color if preserving
    if (preserveColor && currentColor) {
      material.color = currentColor;
    }

    console.log(`Applied finish "${finish.name}" to "${objectName}"`);
  } catch (error) {
    console.error(`Error applying finish to "${objectName}":`, error);
  }
}

/**
 * Apply finish to multiple helmet parts at once
 *
 * @param splineApp - Spline Application instance
 * @param finish - Material finish to apply
 * @param parts - Object names to apply finish to (default: helmet shell and facemask)
 *
 * @example
 * ```typescript
 * // Apply glossy to entire helmet
 * applyFinishToHelmet(splineApp, GLOSSY);
 *
 * // Apply chrome to specific parts
 * applyFinishToHelmet(splineApp, CHROME, ['Facemask', 'Chinstrap']);
 * ```
 */
export function applyFinishToHelmet(
  splineApp: SplineApp,
  finish: MaterialFinish,
  parts: string[] = ['HelmetShell', 'Facemask']
): void {
  parts.forEach(partName => {
    applyFinishToSplineObject(splineApp, partName, finish);
  });
}

/**
 * Apply different finishes to different helmet parts
 *
 * @param splineApp - Spline Application instance
 * @param finishMap - Map of object names to finishes
 *
 * @example
 * ```typescript
 * applyFinishesToHelmetParts(splineApp, {
 *   'HelmetShell': GLOSSY,
 *   'Facemask': CHROME,
 *   'Chinstrap': MATTE
 * });
 * ```
 */
export function applyFinishesToHelmetParts(
  splineApp: SplineApp,
  finishMap: Record<string, MaterialFinish>
): void {
  Object.entries(finishMap).forEach(([objectName, finish]) => {
    applyFinishToSplineObject(splineApp, objectName, finish);
  });
}

/**
 * Get finish by ID (case-insensitive)
 *
 * @param finishId - Finish ID (e.g., "glossy", "matte", "chrome")
 * @returns MaterialFinish or null if not found
 *
 * @example
 * ```typescript
 * const finish = getFinishById('glossy');
 * if (finish) {
 *   applyFinishToHelmet(splineApp, finish);
 * }
 * ```
 */
export function getFinishById(finishId: string): MaterialFinish | null {
  const normalizedId = finishId.toLowerCase().replace(/[_-]/g, '');

  const finishEntry = Object.entries(MATERIAL_FINISHES).find(([key, finish]) => {
    const normalizedKey = key.toLowerCase().replace(/[_-]/g, '');
    const normalizedFinishId = finish.id.toLowerCase().replace(/[_-]/g, '');
    return normalizedKey === normalizedId || normalizedFinishId === normalizedId;
  });

  return finishEntry ? finishEntry[1] : null;
}

/**
 * Preset finish configurations for 6 helmet presets
 */
export const HELMET_PRESET_FINISHES = {
  preset1: GLOSSY,      // High-shine polished
  preset2: MATTE,       // Flat no-shine
  preset3: CHROME,      // Mirror metallic
  preset4: BRUSHED_METAL, // Anisotropic metal
  preset5: SATIN,       // Semi-gloss
  preset6: METALLIC_PAINT // Metallic flake
} as const;

/**
 * Load a helmet preset with specific finish
 *
 * @param splineApp - Spline Application instance
 * @param presetId - Preset ID (1-6)
 * @returns The finish applied to the preset
 *
 * @example
 * ```typescript
 * const finish = loadHelmetPreset(splineApp, 3); // Loads preset 3 with chrome
 * console.log('Applied finish:', finish.name); // "Chrome"
 * ```
 */
export function loadHelmetPreset(
  splineApp: SplineApp,
  presetId: number
): MaterialFinish {
  const presetKey = `preset${presetId}` as keyof typeof HELMET_PRESET_FINISHES;
  const finish = HELMET_PRESET_FINISHES[presetKey];

  if (!finish) {
    throw new Error(`Invalid preset ID: ${presetId}. Must be 1-6.`);
  }

  // Apply the preset finish to the helmet
  applyFinishToHelmet(splineApp, finish);

  return finish;
}

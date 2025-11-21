/**
 * Material Finish System - Multi-Strategy Approach
 * 
 * IMPORTANT: Spline does NOT expose roughness/metalness as direct material properties.
 * These are only available on the Physical Lighting Layer when a Roughness Map is assigned.
 * 
 * We implement multiple strategies with automatic fallback:
 * 
 * Strategy 1: Spline Variables + Material Layers (requires editor setup)
 *   - Variables control Lighting Layer type (Lambert/Phong/Physical)
 *   - Variables control Physical layer parameters (if Roughness Map configured)
 * 
 * Strategy 2: Material Layer Manipulation (runtime)
 *   - Change Lighting Layer type via runtime API
 *   - Add/remove Fresnel, Matcap, Glass layers for different finishes
 * 
 * Strategy 3: Material Cloning & Swapping (fallback)
 *   - Clone materials and modify via THREE.js (may not work with Spline's layer system)
 * 
 * This ensures material finishes work regardless of Spline scene configuration.
 */

import type { Application } from '@splinetool/runtime';
import * as THREE from 'three';
import type { HelmetZone, MaterialFinish } from '@/store/helmetStore';
import { FINISH_PRESETS } from '@/lib/constants';
import { findZoneObjectsDirect, getThreeScene } from './spline-helmet';

// ============================================================
// MATERIAL CACHE SYSTEM
// ============================================================

/**
 * Cache for cloned materials per zone and finish
 * Key: `${zone}-${finish}` -> Map of object UUID -> cloned material
 */
const materialCache = new Map<string, Map<string, THREE.Material>>();

/**
 * Original materials cache (to restore if needed)
 * Key: object UUID -> original material
 */
const originalMaterialsCache = new Map<string, THREE.Material>();

/**
 * Strategy preference order
 */
type MaterialStrategy = 'variables' | 'layers' | 'cloning' | 'direct';

/**
 * Strategy detection result
 */
interface StrategyResult {
  strategy: MaterialStrategy;
  success: boolean;
  message: string;
}

// ============================================================
// STRATEGY 1: SPLINE VARIABLES
// ============================================================

/**
 * Apply finish using Spline Variables + Material Layers
 * 
 * IMPORTANT: Roughness/Metalness are NOT direct properties in Spline.
 * They're only available on Physical Lighting Layer with Roughness Map.
 * 
 * Spline uses a layer-based material system:
 * - Color Layer: Base color (HUE, opacity)
 * - Lighting Layer: Lambert/Phong/Physical/Toon (controls base lighting)
 * - Additional Layers: Fresnel (metallic), Matcap (shine), Glass (glossy), Image (textures)
 * 
 * All layers share: Opacity, Blending
 * Variables can be attached to layer properties (opacity, type, etc.)
 * 
 * SETUP IN SPLINE EDITOR:
 * 
 * Option A: Control Lighting Layer Type (Recommended)
 * 1. Create Number variables: shellLightingType, facemaskLightingType, etc.
 *    - Values: 0=Lambert (matte), 1=Phong (glossy), 2=Physical (metallic), 3=Toon
 * 2. Attach variables to Lighting Layer → Type property
 * 3. Runtime: spline.setVariable('shellLightingType', 2)
 * 
 * Option B: Control Layer Opacity (For Fresnel/Matcap/Glass)
 * 1. Pre-create layers: Fresnel (metallic), Matcap (shine), Glass (glossy)
 * 2. Create Number variables: shellFresnelOpacity, shellMatcapOpacity, shellGlassOpacity (0-1)
 * 3. Attach variables to layer → Opacity property
 * 4. Runtime: spline.setVariable('shellFresnelOpacity', 0.8)
 * 
 * Option C: Control Physical Layer Parameters (Advanced - requires Roughness Map)
 * 1. Set Lighting Layer to Physical
 * 2. Add Image Layer → Assign as Roughness Map to Physical layer
 * 3. Create Number variables: shellRoughness, shellMetalness, shellReflectivity (0-1)
 * 4. Attach variables to Physical layer → Roughness/Metalness/Reflectivity properties
 * 5. Runtime: spline.setVariable('shellRoughness', 0.1)
 * 
 * See SPLINE_MATERIAL_LAYERS_RESEARCH.md for detailed layer information
 */
function applyFinishViaVariables(
  spline: Application,
  zone: HelmetZone,
  finish: MaterialFinish
): StrategyResult {
  try {
    const finishProps = FINISH_PRESETS[finish];
    if (!finishProps) {
      return {
        strategy: 'variables',
        success: false,
        message: `Finish "${finish}" not found in presets`,
      };
    }

    // Strategy 1: Try Lighting Layer Type variable
    // Map finish to Lighting Layer type
    const layerTypeMap: Partial<Record<MaterialFinish, number>> = {
      matte: 0,        // Lambert
      glossy: 1,       // Phong
      chrome: 2,       // Physical
      brushed: 2,      // Physical
      satin: 1,        // Phong
      wet_clearcoat: 1, // Phong
      ceramic_gloss: 1, // Phong
    };

    const layerType = layerTypeMap[finish];
    if (layerType !== undefined) {
      const typeVariableName = `${zone}LightingType`;
      try {
        spline.setVariable(typeVariableName, layerType);
        const verifyValue = spline.getVariable(typeVariableName);
        if (verifyValue === layerType) {
          return {
            strategy: 'variables',
            success: true,
            message: `Set Lighting Layer type via "${typeVariableName}" = ${layerType} (${finish})`,
          };
        }
      } catch (e) {
        // Variable doesn't exist, try next strategy
      }
    }

    // Strategy 2: Try Physical Layer Parameters (if Roughness Map configured)
    // Only works if Physical layer has Roughness Map assigned
    if (finishProps.metalness > 0 || finishProps.roughness < 0.5) {
      const roughnessVar = `${zone}Roughness`;
      const metalnessVar = `${zone}Metalness`;
      
      try {
        // Try to set roughness and metalness variables
        spline.setVariable(roughnessVar, finishProps.roughness);
        spline.setVariable(metalnessVar, finishProps.metalness);
        
        const verifyRough = spline.getVariable(roughnessVar);
        const verifyMetal = spline.getVariable(metalnessVar);
        
        if (verifyRough === finishProps.roughness && verifyMetal === finishProps.metalness) {
          return {
            strategy: 'variables',
            success: true,
            message: `Set Physical layer parameters: roughness=${finishProps.roughness}, metalness=${finishProps.metalness}`,
          };
        }
      } catch (e) {
        // Variables don't exist or not attached
      }
    }

    // Strategy 3: Try finish index variable (legacy approach)
    const finishValueMap: Partial<Record<MaterialFinish, number>> = {
      glossy: 0,
      matte: 1,
      chrome: 2,
      brushed: 3,
      satin: 4,
    };

    const finishValue = finishValueMap[finish];
    if (finishValue !== undefined) {
      const variableName = `${zone}Finish`;
      try {
        spline.setVariable(variableName, finishValue);
        const verifyValue = spline.getVariable(variableName);
        if (verifyValue === finishValue) {
          return {
            strategy: 'variables',
            success: true,
            message: `Set finish index variable "${variableName}" = ${finishValue}`,
          };
        }
      } catch (e) {
        // Variable doesn't exist
      }
    }

    return {
      strategy: 'variables',
      success: false,
      message: `No variables configured for ${zone} finish. See docs for setup instructions.`,
    };
  } catch (error) {
    return {
      strategy: 'variables',
      success: false,
      message: `Variable strategy failed: ${error}`,
    };
  }
}

// ============================================================
// STRATEGY 2: MATERIAL LAYER MANIPULATION
// ============================================================

/**
 * Apply finish using Spline Material Layers
 * 
 * Spline uses a layer-based material system:
 * - Lighting Layer: Controls base lighting (Lambert/Phong/Physical/Toon)
 * - Additional Layers: Fresnel (metallic), Matcap (shine), Glass (glossy)
 * 
 * This strategy attempts to manipulate layers via runtime API
 */
function applyFinishViaLayers(
  spline: Application,
  zone: HelmetZone,
  finish: MaterialFinish
): StrategyResult {
  const objects = findZoneObjectsDirect(spline, zone);
  if (objects.length === 0) {
    return {
      strategy: 'layers',
      success: false,
      message: `No objects found for zone: ${zone}`,
    };
  }

  let successCount = 0;
  const finishProps = FINISH_PRESETS[finish];
  if (!finishProps) {
    return {
      strategy: 'layers',
      success: false,
      message: `Finish "${finish}" not found in presets`,
    };
  }

  // Try to manipulate Lighting Layer type
  // Note: This may not be accessible via runtime API - depends on Spline version
  objects.forEach((obj) => {
    try {
      const typedObj = obj as any;
      
      // Strategy 2A: Try to access Lighting Layer directly
      // Check for common property names
      const layerProperties = [
        'lightingLayer',
        'lighting',
        'materialLayers',
        'layers',
        '_lightingLayer',
        '_layers',
      ];

      for (const prop of layerProperties) {
        if (typedObj[prop] !== undefined) {
          const layer = typedObj[prop];
          
          // Try to set layer type
          if (layer && typeof layer === 'object') {
            // Map finish to Lighting Layer type
            let layerType: string | null = null;
            if (finishProps.metalness > 0.7) {
              layerType = 'Physical'; // Metallic finishes
            } else if (finishProps.roughness > 0.6) {
              layerType = 'Lambert'; // Matte finishes
            } else if (finishProps.roughness < 0.3) {
              layerType = 'Phong'; // Glossy finishes
            }

            if (layerType && ('type' in layer || 'lightingType' in layer)) {
              try {
                if ('type' in layer) layer.type = layerType;
                if ('lightingType' in layer) layer.lightingType = layerType;
                successCount++;
                break;
              } catch (e) {
                // Property is read-only or doesn't exist
              }
            }
          }
        }
      }

      // Strategy 2B: Try to add/control Fresnel layer for metallic finishes
      if (finishProps.metalness > 0.5) {
        // Fresnel layer simulates metallic reflections
        // This would require runtime API support for adding layers
        // Currently not available, but documented for future use
      }

      // Strategy 2C: Try to add/control Matcap layer for shine
      if (finishProps.roughness < 0.2 && finishProps.metalness < 0.3) {
        // Matcap layer adds consistent shine independent of lighting
        // Would require runtime API support
      }
    } catch (error) {
      // Layer manipulation failed for this object
    }
  });

  if (successCount > 0) {
    return {
      strategy: 'layers',
      success: true,
      message: `Modified material layers on ${successCount} object(s)`,
    };
  }

  return {
    strategy: 'layers',
    success: false,
    message: 'Material layer manipulation not available via runtime API',
  };
}

// ============================================================
// STRATEGY 3: MATERIAL CLONING & SWAPPING
// ============================================================

/**
 * Clone a THREE.js material and modify its properties
 */
function cloneAndModifyMaterial(
  originalMaterial: THREE.Material,
  finish: MaterialFinish
): THREE.Material | null {
  try {
    const finishProps = FINISH_PRESETS[finish];
    if (!finishProps) {
      console.warn(`⚠️ No finish preset found for: ${finish}`);
      return null;
    }

    // Clone the material
    let clonedMaterial: THREE.Material;

    if (originalMaterial instanceof THREE.MeshStandardMaterial) {
      const standardMat = originalMaterial.clone();
      standardMat.metalness = finishProps.metalness;
      standardMat.roughness = finishProps.roughness;
      clonedMaterial = standardMat;
    } else if (originalMaterial instanceof THREE.MeshPhysicalMaterial) {
      const physicalMat = originalMaterial.clone();
      physicalMat.metalness = finishProps.metalness;
      physicalMat.roughness = finishProps.roughness;
      clonedMaterial = physicalMat;
    } else if (originalMaterial instanceof THREE.MeshLambertMaterial) {
      // Convert to StandardMaterial for PBR support
      clonedMaterial = new THREE.MeshStandardMaterial({
        color: originalMaterial.color,
        map: originalMaterial.map,
        transparent: originalMaterial.transparent,
        opacity: originalMaterial.opacity,
        metalness: finishProps.metalness,
        roughness: finishProps.roughness,
      });
    } else {
      // Try to clone and add properties if they exist
      clonedMaterial = originalMaterial.clone();
      if ('metalness' in clonedMaterial) {
        (clonedMaterial as any).metalness = finishProps.metalness;
      }
      if ('roughness' in clonedMaterial) {
        (clonedMaterial as any).roughness = finishProps.roughness;
      }
    }

    clonedMaterial.needsUpdate = true;
    return clonedMaterial;
  } catch (error) {
    console.error(`❌ Failed to clone material:`, error);
    return null;
  }
}

/**
 * Apply finish using material cloning strategy
 * Clones materials, modifies properties, and swaps them on meshes
 */
function applyFinishViaCloning(
  spline: Application,
  zone: HelmetZone,
  finish: MaterialFinish
): StrategyResult {
  const scene = getThreeScene(spline);
  if (!scene) {
    return {
      strategy: 'cloning',
      success: false,
      message: 'THREE.js scene not accessible',
    };
  }

  const objects = findZoneObjectsDirect(spline, zone);
  if (objects.length === 0) {
    return {
      strategy: 'cloning',
      success: false,
      message: `No objects found for zone: ${zone}`,
    };
  }

  let successCount = 0;
  let failCount = 0;
  const cacheKey = `${zone}-${finish}`;

  // Initialize cache for this zone+finish combination
  if (!materialCache.has(cacheKey)) {
    materialCache.set(cacheKey, new Map());
  }
  const zoneCache = materialCache.get(cacheKey)!;

  objects.forEach((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.material) {
      failCount++;
      return;
    }

    const objectId = mesh.uuid;

    // Store original material if not already cached
    if (!originalMaterialsCache.has(objectId)) {
      const originalMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      if (originalMat) {
        originalMaterialsCache.set(objectId, originalMat);
      }
    }

    // Check if we already have a cloned material for this finish
    let clonedMaterial = zoneCache.get(objectId);

    if (!clonedMaterial) {
      // Clone and modify material
      const cachedOriginal = originalMaterialsCache.get(objectId);
      const currentMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      const originalMaterial = cachedOriginal || currentMaterial;
      
      if (!originalMaterial) {
        failCount++;
        return;
      }

      const cloned = cloneAndModifyMaterial(originalMaterial, finish);

      if (cloned) {
        clonedMaterial = cloned;
        zoneCache.set(objectId, clonedMaterial);
      } else {
        failCount++;
        return;
      }
    }

    // Swap material on mesh
    try {
      mesh.material = clonedMaterial;
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to swap material on ${mesh.name}:`, error);
      failCount++;
    }
  });

  if (successCount > 0) {
    return {
      strategy: 'cloning',
      success: true,
      message: `Cloned and swapped materials on ${successCount} object(s)`,
    };
  }

  return {
    strategy: 'cloning',
    success: false,
    message: `Failed to clone materials (${failCount} failures)`,
  };
}

// ============================================================
// STRATEGY 4: DIRECT THREE.JS MANIPULATION
// ============================================================

/**
 * Apply finish using direct THREE.js material property manipulation
 * This is a fallback when cloning doesn't work
 */
function applyFinishViaDirect(
  spline: Application,
  zone: HelmetZone,
  finish: MaterialFinish
): StrategyResult {
  const scene = getThreeScene(spline);
  if (!scene) {
    return {
      strategy: 'direct',
      success: false,
      message: 'THREE.js scene not accessible',
    };
  }

  const finishProps = FINISH_PRESETS[finish];
  if (!finishProps) {
    return {
      strategy: 'direct',
      success: false,
      message: `No finish preset found for: ${finish}`,
    };
  }

  const objects = findZoneObjectsDirect(spline, zone);
  if (objects.length === 0) {
    return {
      strategy: 'direct',
      success: false,
      message: `No objects found for zone: ${zone}`,
    };
  }

  let successCount = 0;
  let failCount = 0;

  objects.forEach((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.material) {
      failCount++;
      return;
    }

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

    materials.forEach((material: THREE.Material) => {
      try {
        // Try to modify material properties directly
        // Note: These properties only exist on Physical Lighting Layer with Roughness Map in Spline
        if (material instanceof THREE.MeshStandardMaterial) {
          material.metalness = finishProps.metalness;
          material.roughness = finishProps.roughness;
          material.needsUpdate = true;
          successCount++;
        } else if (material instanceof THREE.MeshPhysicalMaterial) {
          material.metalness = finishProps.metalness;
          material.roughness = finishProps.roughness;
          material.needsUpdate = true;
          successCount++;
        } else if ('metalness' in material && 'roughness' in material) {
          // Type guard for materials with these properties
          const pbrMaterial = material as any;
          pbrMaterial.metalness = finishProps.metalness;
          pbrMaterial.roughness = finishProps.roughness;
          material.needsUpdate = true;
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to modify material on ${mesh.name}:`, error);
        failCount++;
      }
    });
  });

  if (successCount > 0) {
    return {
      strategy: 'direct',
      success: true,
      message: `Modified ${successCount} material(s) directly`,
    };
  }

  return {
    strategy: 'direct',
    success: false,
    message: `Direct manipulation failed (${failCount} failures)`,
  };
}

// ============================================================
// MAIN API: MULTI-STRATEGY FINISH APPLICATION
// ============================================================

/**
 * Apply material finish to a zone using multiple strategies with fallback
 * 
 * Strategy order:
 * 1. Spline Variables + Material Layers (if configured in editor)
 * 2. Material Layer Manipulation (runtime - may not be available)
 * 3. Material Cloning & Swapping (runtime fallback)
 * 4. Direct THREE.js manipulation (last resort)
 * 
 * @param spline - Spline Application instance
 * @param zone - Helmet zone to apply finish to
 * @param finish - Material finish type
 * @param preferredStrategy - Optional: force a specific strategy
 * @returns Success status and which strategy was used
 */
export function applyZoneFinish(
  spline: Application,
  zone: HelmetZone,
  finish: MaterialFinish,
  preferredStrategy?: MaterialStrategy
): StrategyResult {
  console.log(`\n🎨 === APPLYING FINISH: ${zone} → ${finish} ===`);

  // If preferred strategy specified, try only that
  if (preferredStrategy) {
    switch (preferredStrategy) {
      case 'variables':
        return applyFinishViaVariables(spline, zone, finish);
      case 'cloning':
        return applyFinishViaCloning(spline, zone, finish);
      case 'direct':
        return applyFinishViaDirect(spline, zone, finish);
    }
  }

  // Try strategies in order until one succeeds
  const strategies: Array<() => StrategyResult> = [
    () => applyFinishViaVariables(spline, zone, finish),
    () => applyFinishViaLayers(spline, zone, finish),
    () => applyFinishViaCloning(spline, zone, finish),
    () => applyFinishViaDirect(spline, zone, finish),
  ];

  for (const strategyFn of strategies) {
    const result = strategyFn();
    console.log(`  Strategy "${result.strategy}": ${result.success ? '✅' : '❌'} ${result.message}`);

    if (result.success) {
      console.log(`✅ === FINISH APPLIED SUCCESSFULLY ===\n`);
      return result;
    }
  }

  // All strategies failed
  console.error(`❌ === ALL STRATEGIES FAILED ===\n`);
  return {
    strategy: 'direct',
    success: false,
    message: 'All material finish strategies failed',
  };
}

/**
 * Clear material cache for a specific zone
 * Useful for cleanup or resetting materials
 */
export function clearMaterialCache(zone?: HelmetZone) {
  if (zone) {
    // Clear cache for specific zone
    const keysToDelete: string[] = [];
    materialCache.forEach((_, key) => {
      if (key.startsWith(`${zone}-`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => materialCache.delete(key));
    console.log(`🗑️ Cleared material cache for zone: ${zone}`);
  } else {
    // Clear all caches
    materialCache.clear();
    originalMaterialsCache.clear();
    console.log(`🗑️ Cleared all material caches`);
  }
}

/**
 * Restore original materials for a zone
 * Useful for resetting to default state
 */
export function restoreOriginalMaterials(
  spline: Application,
  zone: HelmetZone
): boolean {
  const scene = getThreeScene(spline);
  if (!scene) {
    console.warn('⚠️ Cannot restore materials - THREE.js scene not accessible');
    return false;
  }

  const objects = findZoneObjectsDirect(spline, zone);
  let restoredCount = 0;

  objects.forEach((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.material) return;

    const objectId = mesh.uuid;
    const originalMaterial = originalMaterialsCache.get(objectId);

    if (originalMaterial) {
      mesh.material = originalMaterial;
      restoredCount++;
    }
  });

  console.log(`🔄 Restored ${restoredCount} original material(s) for ${zone}`);
  return restoredCount > 0;
}

/**
 * Get cache statistics (for debugging)
 */
export function getMaterialCacheStats() {
  return {
    cachedFinishes: materialCache.size,
    cachedObjects: Array.from(materialCache.values()).reduce((sum, map) => sum + map.size, 0),
    originalMaterials: originalMaterialsCache.size,
  };
}


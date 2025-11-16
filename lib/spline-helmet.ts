/**
 * Helmet Customization Logic
 * All helmet manipulation functions using Spline API
 */

import type { Application } from '@splinetool/runtime';
import type { HelmetZone, MaterialFinish } from '@/store/helmetStore';
import { FINISH_PRESETS, CAMERA_PRESETS } from '@/lib/constants';

// ============================================================
// ZONE OBJECT NAME PATTERNS
// ============================================================

// Map zones to their object name patterns in Spline scene
// Based on actual hierarchy: helmet_for_spline > [parts]
// Reference: See SPLINE_SCENE_HIERARCHY.md for complete scene mapping
const ZONE_PATTERNS: Record<HelmetZone, string[]> = {
  shell: ['UV01_Shell'],
  facemask: ['Facemask_Complete'],
  chinstrap: ['UV01_Chinstrap', 'UV02_Chinstrap_Strap', 'UV03_Chinstrap'], // 3 chinstrap parts
  padding: ['UV01_Padding', 'UV03_Padding'], // 2 padding parts
  hardware: ['Hardware_'], // Prefix: Hardware_01-20, Hardware_P_Clip_01-02, Hardware_Tiny
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

    // Debug material availability
    foundObjects.forEach(obj => {
      const hasMaterial = !!(obj as any).material;
      console.log(`  - ${obj.name}: material=${hasMaterial ? '✓' : '✗'}`);
    });
  }

  return foundObjects;
}

// ============================================================
// HELMET COLOR CUSTOMIZATION (All 5 Zones)
// ============================================================

/**
 * Change color for a specific zone
 *
 * Spline Runtime objects have direct .color property (NOT .material.color)
 * For advanced material manipulation, use getThreeJsScene() to access underlying THREE.js scene
 *
 * Handles zones with multiple objects (chinstrap, padding, hardware)
 */
export function changeZoneColor(spline: Application, zone: HelmetZone, color: string) {
  const objects = findZoneObjects(spline, zone);

  objects.forEach(obj => {
    const typedObj = obj as any;

    // CRITICAL: Spline's .color property returns undefined but IS a working setter
    // We must TRY to set it without checking if it exists first
    try {
      typedObj.color = color;
      console.log(`✅ Set color for ${obj.name} to ${color}`);

      // Set opacity to 100% (1.0) for shell to ensure it's fully opaque
      if (zone === 'shell' && typedObj.material) {
        if (typedObj.material.opacity !== undefined) {
          typedObj.material.opacity = 1.0;
          typedObj.material.transparent = true; // Need transparent flag to control opacity
          console.log(`✅ Set opacity to 100% for ${obj.name}`);
        }
      }
    } catch (e) {
      console.warn(`⚠️ Could not set color for ${obj.name}:`, e);
    }
  });

  if (objects.length > 0) {
    console.log(`🎨 Changed ${zone} color to ${color} (${objects.length} objects)`);
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
// MATERIAL FINISH PRESETS (imported from constants)
// ============================================================

export type FinishType = MaterialFinish;

/**
 * Apply material finish to a specific zone
 *
 * NOTE: Spline Runtime may not expose metalness/roughness directly
 * This function attempts to set these properties but may need THREE.js scene access
 *
 * Handles zones with multiple objects
 */
export function applyZoneFinish(spline: Application, zone: HelmetZone, finish: MaterialFinish) {
  const objects = findZoneObjects(spline, zone);
  const preset = FINISH_PRESETS[finish];

  objects.forEach(obj => {
    const typedObj = obj as any;

    if (typedObj.material) {
      // Try to set standard PBR properties
      if (typedObj.material.metalness !== undefined) {
        typedObj.material.metalness = preset.metalness;
      }
      if (typedObj.material.roughness !== undefined) {
        typedObj.material.roughness = preset.roughness;
      }

      // Mark material for update if it has needsUpdate
      if (typedObj.material.needsUpdate !== undefined) {
        typedObj.material.needsUpdate = true;
      }

      console.log(`✅ Applied ${finish} finish to ${obj.name}`);
    } else {
      console.warn(`⚠️ No material property on ${obj.name} - finish not applied`);
    }
  });

  if (objects.length > 0) {
    console.log(`✨ Applied ${finish} finish to ${zone} (${objects.length} objects)`);
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
// CAMERA PRESET VIEWS (imported from constants)
// ============================================================

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
// SPLINE VARIABLES SYSTEM (Route 2: Material Layer Control)
// ============================================================

/**
 * Set a Spline variable value
 * Variables can control material layer properties, visibility, colors, etc.
 *
 * To use this:
 * 1. Create variables in Spline Editor (Variables panel)
 * 2. Attach variables to object properties or material layers
 * 3. Use this function to update variables at runtime
 *
 * @example
 * // In Spline Editor: Create variable "shellFinish" (String)
 * // Attach to material layer opacity via Variable Change event
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

/**
 * Change zone finish using Spline variables
 *
 * REQUIRES SPLINE EDITOR SETUP:
 * 1. Create material layer stacks for each finish (glossy, matte, chrome, etc.)
 * 2. Create opacity variables for each layer stack
 * 3. Set up Variable Change events to toggle layer visibility
 *
 * This is Route 2 (Spline Material Library) - smaller file size, maximum flexibility
 */
export function changeZoneFinishViaVariables(
  spline: Application,
  zone: HelmetZone,
  finish: MaterialFinish
) {
  // Set the finish variable (Spline events will handle layer switching)
  const variableName = `${zone}Finish`;
  setVariable(spline, variableName, finish);

  // Also set individual layer opacities for direct control (optional)
  const finishes: MaterialFinish[] = ['glossy', 'matte', 'chrome', 'brushed', 'satin'];
  finishes.forEach(f => {
    const opacity = f === finish ? 1.0 : 0.0;
    setVariable(spline, `${zone}${capitalize(f)}Opacity`, opacity);
  });
}

/**
 * Change zone color using Spline variables
 * Requires color variable to be attached to material layer color input
 */
export function changeZoneColorViaVariables(
  spline: Application,
  zone: HelmetZone,
  color: string
) {
  const variableName = `${zone}Color`;
  setVariable(spline, variableName, color);
}

// Helper function
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================
// WEBHOOK MATERIAL UPDATES
// ============================================================

export interface WebhookMaterialProperties {
  color?: string;
  finish?: MaterialFinish;
  metalness?: number;
  roughness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}

export interface WebhookZoneUpdate {
  zone: HelmetZone;
  properties: WebhookMaterialProperties;
}

/**
 * Apply material updates from webhook payload to Spline scene
 *
 * This function processes webhook responses and applies all material
 * properties to the appropriate zones in the Spline scene
 *
 * @param spline - Spline Application instance
 * @param updates - Array of zone material updates from webhook
 */
export function applyWebhookMaterialUpdates(
  spline: Application,
  updates: WebhookZoneUpdate[]
) {
  console.log(`🔗 Applying ${updates.length} webhook material update(s)`);

  updates.forEach(update => {
    const { zone, properties } = update;
    const objects = findZoneObjects(spline, zone);

    // Apply color if provided
    if (properties.color) {
      changeZoneColor(spline, zone, properties.color);
    }

    // Apply finish preset if provided
    if (properties.finish) {
      applyZoneFinish(spline, zone, properties.finish);
    }

    // Apply advanced material properties
    objects.forEach(obj => {
      const typedObj = obj as any;

      if (typedObj.material) {
        // Metalness
        if (properties.metalness !== undefined) {
          typedObj.material.metalness = properties.metalness;
        }

        // Roughness
        if (properties.roughness !== undefined) {
          typedObj.material.roughness = properties.roughness;
        }

        // Clearcoat
        if (properties.clearcoat !== undefined && typedObj.material.clearcoat !== undefined) {
          typedObj.material.clearcoat = properties.clearcoat;
        }

        // Clearcoat Roughness
        if (properties.clearcoatRoughness !== undefined && typedObj.material.clearcoatRoughness !== undefined) {
          typedObj.material.clearcoatRoughness = properties.clearcoatRoughness;
        }

        // Emissive color
        if (properties.emissive && typedObj.material.emissive !== undefined) {
          typedObj.material.emissive = properties.emissive;
        }

        // Emissive intensity
        if (properties.emissiveIntensity !== undefined && typedObj.material.emissiveIntensity !== undefined) {
          typedObj.material.emissiveIntensity = properties.emissiveIntensity;
        }

        // Mark material for update
        if (typedObj.material.needsUpdate !== undefined) {
          typedObj.material.needsUpdate = true;
        }

        console.log(`✅ Applied webhook updates to ${obj.name}:`, properties);
      }
    });
  });

  console.log(`🎨 Webhook material updates applied successfully`);
}

/**
 * Fetch and apply material updates from webhook endpoint
 *
 * @param spline - Spline Application instance
 * @param webhookUrl - URL of the webhook endpoint
 * @param updates - Material updates to send
 */
export async function fetchAndApplyWebhookUpdates(
  spline: Application,
  webhookUrl: string,
  updates: WebhookZoneUpdate[]
) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updates,
        timestamp: new Date().toISOString(),
        source: 'spline-ui',
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.updates) {
      applyWebhookMaterialUpdates(spline, data.updates);
      return { success: true, data };
    } else {
      throw new Error(data.errors?.join(', ') || 'Unknown webhook error');
    }
  } catch (error) {
    console.error('❌ Webhook request failed:', error);
    return { success: false, error };
  }
}

// ============================================================
// PATTERN OVERLAYS (Future implementation)
// ============================================================

export function applyPattern(spline: Application, patternUrl: string) {
  // TODO: Implement pattern system using Spline's texture loading
  console.log('Pattern system:', patternUrl);
}

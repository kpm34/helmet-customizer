import { MaterialFinish } from '../types/engine';

/**
 * Material Finish Presets Library
 *
 * 10 predefined material finishes for 3D helmet customization and rendering.
 * Each finish defines physical material properties:
 * - roughness: Surface smoothness (0 = mirror smooth, 1 = rough)
 * - metalness: Metallic property (0 = non-metal, 1 = metal)
 * - clearcoat: Clear coating layer (optional)
 * - emissive: Self-illumination (optional)
 *
 * These presets are renderer-agnostic and work with any Three.js version.
 */

/**
 * Glossy Finish - High shine, mirror-like reflection
 * Use for: Polished helmets, chrome accents
 */
export const GLOSSY: MaterialFinish = {
  id: 'glossy',
  name: 'Glossy',
  roughness: 0.1,
  metalness: 0.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.0
};

/**
 * Matte Finish - No shine, diffuse reflection
 * Use for: Non-reflective surfaces, flat paint
 */
export const MATTE: MaterialFinish = {
  id: 'matte',
  name: 'Matte',
  roughness: 1.0,
  metalness: 0.0
};

/**
 * Chrome Finish - Mirror-like metallic surface
 * Use for: Chrome facemasks, metallic accents
 */
export const CHROME: MaterialFinish = {
  id: 'chrome',
  name: 'Chrome',
  roughness: 0.0,
  metalness: 1.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.0
};

/**
 * Brushed Metal - Anisotropic metallic surface
 * Use for: Brushed aluminum, steel
 */
export const BRUSHED_METAL: MaterialFinish = {
  id: 'brushed-metal',
  name: 'Brushed Metal',
  roughness: 0.4,
  metalness: 1.0
};

/**
 * Satin Finish - Semi-glossy, soft reflection
 * Use for: Satin paint, semi-gloss helmets
 */
export const SATIN: MaterialFinish = {
  id: 'satin',
  name: 'Satin',
  roughness: 0.5,
  metalness: 0.0,
  clearcoat: 0.5,
  clearcoatRoughness: 0.3
};

/**
 * Metallic Paint - Metallic flake paint finish
 * Use for: Metallic paint jobs, sparkle finishes
 */
export const METALLIC_PAINT: MaterialFinish = {
  id: 'metallic-paint',
  name: 'Metallic Paint',
  roughness: 0.3,
  metalness: 0.6,
  clearcoat: 0.8,
  clearcoatRoughness: 0.1
};

/**
 * Pearl Finish - Iridescent, color-shifting effect
 * Use for: Pearl paint, color-shift finishes
 */
export const PEARL: MaterialFinish = {
  id: 'pearl',
  name: 'Pearl',
  roughness: 0.2,
  metalness: 0.3,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  shaderParams: {
    iridescence: 1.0,
    iridescenceIOR: 1.3
  }
};

/**
 * Carbon Fiber - Textured composite material
 * Use for: Carbon fiber patterns, racing helmets
 */
export const CARBON_FIBER: MaterialFinish = {
  id: 'carbon-fiber',
  name: 'Carbon Fiber',
  roughness: 0.3,
  metalness: 0.2,
  clearcoat: 0.9,
  clearcoatRoughness: 0.1
};

/**
 * Glow Finish - Emissive, self-illuminating
 * Use for: LED accents, glowing stripes
 */
export const GLOW: MaterialFinish = {
  id: 'glow',
  name: 'Glow',
  roughness: 0.8,
  metalness: 0.0,
  emissiveIntensity: 1.0
};

/**
 * Anodized Aluminum - Colored metallic finish
 * Use for: Anodized aluminum parts, colored metals
 */
export const ANODIZED: MaterialFinish = {
  id: 'anodized',
  name: 'Anodized',
  roughness: 0.25,
  metalness: 0.8,
  clearcoat: 0.6,
  clearcoatRoughness: 0.2
};

/**
 * All material finish presets (10 total)
 */
export const MATERIAL_FINISHES: Record<string, MaterialFinish> = {
  GLOSSY,
  MATTE,
  CHROME,
  BRUSHED_METAL,
  SATIN,
  METALLIC_PAINT,
  PEARL,
  CARBON_FIBER,
  GLOW,
  ANODIZED
};

/**
 * Get all material finishes as an array
 */
export function getAllFinishes(): MaterialFinish[] {
  return Object.values(MATERIAL_FINISHES);
}

/**
 * Get material finish by ID
 */
export function getFinishById(id: string): MaterialFinish | null {
  const finish = Object.values(MATERIAL_FINISHES).find(f => f.id === id);
  return finish || null;
}

/**
 * Get material finish by name (case-insensitive)
 */
export function getFinishByName(name: string): MaterialFinish | null {
  const normalizedName = name.toUpperCase().replace(/[\s-]/g, '_');
  return MATERIAL_FINISHES[normalizedName] || null;
}

/**
 * Get finishes suitable for helmets (excludes glow)
 */
export function getHelmetFinishes(): MaterialFinish[] {
  return [
    GLOSSY,
    MATTE,
    SATIN,
    METALLIC_PAINT,
    PEARL,
    CARBON_FIBER
  ];
}

/**
 * Get finishes suitable for facemasks (metals and chrome)
 */
export function getFacemaskFinishes(): MaterialFinish[] {
  return [
    CHROME,
    BRUSHED_METAL,
    METALLIC_PAINT,
    ANODIZED
  ];
}

/**
 * Material finish categories
 */
export enum FinishCategory {
  GLOSSY = 'glossy',
  MATTE = 'matte',
  METALLIC = 'metallic',
  SPECIAL = 'special'
}

/**
 * Get finishes by category
 */
export function getFinishesByCategory(category: FinishCategory): MaterialFinish[] {
  switch (category) {
    case FinishCategory.GLOSSY:
      return [GLOSSY, SATIN, PEARL];
    case FinishCategory.MATTE:
      return [MATTE, CARBON_FIBER];
    case FinishCategory.METALLIC:
      return [CHROME, BRUSHED_METAL, METALLIC_PAINT, ANODIZED];
    case FinishCategory.SPECIAL:
      return [GLOW, PEARL];
    default:
      return [];
  }
}

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
export declare const GLOSSY: MaterialFinish;
/**
 * Matte Finish - No shine, diffuse reflection
 * Use for: Non-reflective surfaces, flat paint
 */
export declare const MATTE: MaterialFinish;
/**
 * Chrome Finish - Mirror-like metallic surface
 * Use for: Chrome facemasks, metallic accents
 */
export declare const CHROME: MaterialFinish;
/**
 * Brushed Metal - Anisotropic metallic surface
 * Use for: Brushed aluminum, steel
 */
export declare const BRUSHED_METAL: MaterialFinish;
/**
 * Satin Finish - Semi-glossy, soft reflection
 * Use for: Satin paint, semi-gloss helmets
 */
export declare const SATIN: MaterialFinish;
/**
 * Metallic Paint - Metallic flake paint finish
 * Use for: Metallic paint jobs, sparkle finishes
 */
export declare const METALLIC_PAINT: MaterialFinish;
/**
 * Pearl Finish - Iridescent, color-shifting effect
 * Use for: Pearl paint, color-shift finishes
 */
export declare const PEARL: MaterialFinish;
/**
 * Carbon Fiber - Textured composite material
 * Use for: Carbon fiber patterns, racing helmets
 */
export declare const CARBON_FIBER: MaterialFinish;
/**
 * Glow Finish - Emissive, self-illuminating
 * Use for: LED accents, glowing stripes
 */
export declare const GLOW: MaterialFinish;
/**
 * Anodized Aluminum - Colored metallic finish
 * Use for: Anodized aluminum parts, colored metals
 */
export declare const ANODIZED: MaterialFinish;
/**
 * All material finish presets (10 total)
 */
export declare const MATERIAL_FINISHES: Record<string, MaterialFinish>;
/**
 * Get all material finishes as an array
 */
export declare function getAllFinishes(): MaterialFinish[];
/**
 * Get material finish by ID
 */
export declare function getFinishById(id: string): MaterialFinish | null;
/**
 * Get material finish by name (case-insensitive)
 */
export declare function getFinishByName(name: string): MaterialFinish | null;
/**
 * Get finishes suitable for helmets (excludes glow)
 */
export declare function getHelmetFinishes(): MaterialFinish[];
/**
 * Get finishes suitable for facemasks (metals and chrome)
 */
export declare function getFacemaskFinishes(): MaterialFinish[];
/**
 * Material finish categories
 */
export declare enum FinishCategory {
    GLOSSY = "glossy",
    MATTE = "matte",
    METALLIC = "metallic",
    SPECIAL = "special"
}
/**
 * Get finishes by category
 */
export declare function getFinishesByCategory(category: FinishCategory): MaterialFinish[];
//# sourceMappingURL=materials.d.ts.map
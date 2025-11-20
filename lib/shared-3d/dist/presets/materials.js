"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinishCategory = exports.MATERIAL_FINISHES = exports.ANODIZED = exports.GLOW = exports.CARBON_FIBER = exports.PEARL = exports.METALLIC_PAINT = exports.SATIN = exports.BRUSHED_METAL = exports.CHROME = exports.MATTE = exports.GLOSSY = void 0;
exports.getAllFinishes = getAllFinishes;
exports.getFinishById = getFinishById;
exports.getFinishByName = getFinishByName;
exports.getHelmetFinishes = getHelmetFinishes;
exports.getFacemaskFinishes = getFacemaskFinishes;
exports.getFinishesByCategory = getFinishesByCategory;
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
exports.GLOSSY = {
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
exports.MATTE = {
    id: 'matte',
    name: 'Matte',
    roughness: 1.0,
    metalness: 0.0
};
/**
 * Chrome Finish - Mirror-like metallic surface
 * Use for: Chrome facemasks, metallic accents
 */
exports.CHROME = {
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
exports.BRUSHED_METAL = {
    id: 'brushed-metal',
    name: 'Brushed Metal',
    roughness: 0.4,
    metalness: 1.0
};
/**
 * Satin Finish - Semi-glossy, soft reflection
 * Use for: Satin paint, semi-gloss helmets
 */
exports.SATIN = {
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
exports.METALLIC_PAINT = {
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
exports.PEARL = {
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
exports.CARBON_FIBER = {
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
exports.GLOW = {
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
exports.ANODIZED = {
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
exports.MATERIAL_FINISHES = {
    GLOSSY: exports.GLOSSY,
    MATTE: exports.MATTE,
    CHROME: exports.CHROME,
    BRUSHED_METAL: exports.BRUSHED_METAL,
    SATIN: exports.SATIN,
    METALLIC_PAINT: exports.METALLIC_PAINT,
    PEARL: exports.PEARL,
    CARBON_FIBER: exports.CARBON_FIBER,
    GLOW: exports.GLOW,
    ANODIZED: exports.ANODIZED
};
/**
 * Get all material finishes as an array
 */
function getAllFinishes() {
    return Object.values(exports.MATERIAL_FINISHES);
}
/**
 * Get material finish by ID
 */
function getFinishById(id) {
    const finish = Object.values(exports.MATERIAL_FINISHES).find(f => f.id === id);
    return finish || null;
}
/**
 * Get material finish by name (case-insensitive)
 */
function getFinishByName(name) {
    const normalizedName = name.toUpperCase().replace(/[\s-]/g, '_');
    return exports.MATERIAL_FINISHES[normalizedName] || null;
}
/**
 * Get finishes suitable for helmets (excludes glow)
 */
function getHelmetFinishes() {
    return [
        exports.GLOSSY,
        exports.MATTE,
        exports.SATIN,
        exports.METALLIC_PAINT,
        exports.PEARL,
        exports.CARBON_FIBER
    ];
}
/**
 * Get finishes suitable for facemasks (metals and chrome)
 */
function getFacemaskFinishes() {
    return [
        exports.CHROME,
        exports.BRUSHED_METAL,
        exports.METALLIC_PAINT,
        exports.ANODIZED
    ];
}
/**
 * Material finish categories
 */
var FinishCategory;
(function (FinishCategory) {
    FinishCategory["GLOSSY"] = "glossy";
    FinishCategory["MATTE"] = "matte";
    FinishCategory["METALLIC"] = "metallic";
    FinishCategory["SPECIAL"] = "special";
})(FinishCategory || (exports.FinishCategory = FinishCategory = {}));
/**
 * Get finishes by category
 */
function getFinishesByCategory(category) {
    switch (category) {
        case FinishCategory.GLOSSY:
            return [exports.GLOSSY, exports.SATIN, exports.PEARL];
        case FinishCategory.MATTE:
            return [exports.MATTE, exports.CARBON_FIBER];
        case FinishCategory.METALLIC:
            return [exports.CHROME, exports.BRUSHED_METAL, exports.METALLIC_PAINT, exports.ANODIZED];
        case FinishCategory.SPECIAL:
            return [exports.GLOW, exports.PEARL];
        default:
            return [];
    }
}
//# sourceMappingURL=materials.js.map
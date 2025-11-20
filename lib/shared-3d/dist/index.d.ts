/**
 * @blender-workspace/shared-3d
 *
 * Shared 3D engine abstractions and utilities for helmet-customizer and prism projects.
 * Zero npm dependencies to avoid Three.js version conflicts.
 *
 * This package provides:
 * - I3DEngine interface for 3D engine abstraction
 * - 18 color presets (team colors, metallics, neutrals, bright)
 * - 10 material finish presets (glossy, matte, chrome, etc.)
 * - Color conversion utilities (hex, RGB, Three.js)
 * - Validation functions for colors and materials
 *
 * @packageDocumentation
 */
export { RGBColor, ColorSpec, Material3D, MaterialFinish, I3DObject, I3DMaterial, I3DRenderConfig, I3DCameraConfig, I3DLightConfig, I3DSceneConfig, I3DEngine, I3DEngineFactory } from './types/engine';
export { TEAM_COLORS, METALLIC_COLORS, NEUTRAL_COLORS, BRIGHT_COLORS, COLOR_PRESETS, getAllColors, getColorByName, getColorsByCategory, getAllCategories, ColorCategory } from './presets/colors';
export { GLOSSY, MATTE, CHROME, BRUSHED_METAL, SATIN, METALLIC_PAINT, PEARL, CARBON_FIBER, GLOW, ANODIZED, MATERIAL_FINISHES, getAllFinishes, getFinishById, getFinishByName, getHelmetFinishes, getFacemaskFinishes, getFinishesByCategory, FinishCategory } from './presets/materials';
export { hexToRgb, rgbToHex, hexToThreeColor, threeColorToHex, rgbToThreeColor, threeColorToRgb, rgbToNormalized, normalizedToRgb, createColorSpec, blendColors, lightenColor, darkenColor, getColorLuminance, isLightColor, getContrastingTextColor } from './utils/color-converter';
export { ValidationResult, validateHexColor, validateRgbColor, validateThreeColor, validateColorSpec, validateMaterialFinish, validateMaterial, validateNumberArray, sanitizeRgb, sanitizeMaterialFinish } from './utils/validators';
export declare const VERSION = "1.0.0";
//# sourceMappingURL=index.d.ts.map
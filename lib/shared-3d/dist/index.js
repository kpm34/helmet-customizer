"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNumberArray = exports.validateMaterial = exports.validateMaterialFinish = exports.validateColorSpec = exports.validateThreeColor = exports.validateRgbColor = exports.validateHexColor = exports.getContrastingTextColor = exports.isLightColor = exports.getColorLuminance = exports.darkenColor = exports.lightenColor = exports.blendColors = exports.createColorSpec = exports.normalizedToRgb = exports.rgbToNormalized = exports.threeColorToRgb = exports.rgbToThreeColor = exports.threeColorToHex = exports.hexToThreeColor = exports.rgbToHex = exports.hexToRgb = exports.FinishCategory = exports.getFinishesByCategory = exports.getFacemaskFinishes = exports.getHelmetFinishes = exports.getFinishByName = exports.getFinishById = exports.getAllFinishes = exports.MATERIAL_FINISHES = exports.ANODIZED = exports.GLOW = exports.CARBON_FIBER = exports.PEARL = exports.METALLIC_PAINT = exports.SATIN = exports.BRUSHED_METAL = exports.CHROME = exports.MATTE = exports.GLOSSY = exports.ColorCategory = exports.getAllCategories = exports.getColorsByCategory = exports.getColorByName = exports.getAllColors = exports.COLOR_PRESETS = exports.BRIGHT_COLORS = exports.NEUTRAL_COLORS = exports.METALLIC_COLORS = exports.TEAM_COLORS = void 0;
exports.VERSION = exports.sanitizeMaterialFinish = exports.sanitizeRgb = void 0;
// ============================================================================
// Color Presets
// ============================================================================
var colors_1 = require("./presets/colors");
// Color categories
Object.defineProperty(exports, "TEAM_COLORS", { enumerable: true, get: function () { return colors_1.TEAM_COLORS; } });
Object.defineProperty(exports, "METALLIC_COLORS", { enumerable: true, get: function () { return colors_1.METALLIC_COLORS; } });
Object.defineProperty(exports, "NEUTRAL_COLORS", { enumerable: true, get: function () { return colors_1.NEUTRAL_COLORS; } });
Object.defineProperty(exports, "BRIGHT_COLORS", { enumerable: true, get: function () { return colors_1.BRIGHT_COLORS; } });
// Combined presets
Object.defineProperty(exports, "COLOR_PRESETS", { enumerable: true, get: function () { return colors_1.COLOR_PRESETS; } });
// Utility functions
Object.defineProperty(exports, "getAllColors", { enumerable: true, get: function () { return colors_1.getAllColors; } });
Object.defineProperty(exports, "getColorByName", { enumerable: true, get: function () { return colors_1.getColorByName; } });
Object.defineProperty(exports, "getColorsByCategory", { enumerable: true, get: function () { return colors_1.getColorsByCategory; } });
Object.defineProperty(exports, "getAllCategories", { enumerable: true, get: function () { return colors_1.getAllCategories; } });
// Enums
Object.defineProperty(exports, "ColorCategory", { enumerable: true, get: function () { return colors_1.ColorCategory; } });
// ============================================================================
// Material Finish Presets
// ============================================================================
var materials_1 = require("./presets/materials");
// Individual finishes
Object.defineProperty(exports, "GLOSSY", { enumerable: true, get: function () { return materials_1.GLOSSY; } });
Object.defineProperty(exports, "MATTE", { enumerable: true, get: function () { return materials_1.MATTE; } });
Object.defineProperty(exports, "CHROME", { enumerable: true, get: function () { return materials_1.CHROME; } });
Object.defineProperty(exports, "BRUSHED_METAL", { enumerable: true, get: function () { return materials_1.BRUSHED_METAL; } });
Object.defineProperty(exports, "SATIN", { enumerable: true, get: function () { return materials_1.SATIN; } });
Object.defineProperty(exports, "METALLIC_PAINT", { enumerable: true, get: function () { return materials_1.METALLIC_PAINT; } });
Object.defineProperty(exports, "PEARL", { enumerable: true, get: function () { return materials_1.PEARL; } });
Object.defineProperty(exports, "CARBON_FIBER", { enumerable: true, get: function () { return materials_1.CARBON_FIBER; } });
Object.defineProperty(exports, "GLOW", { enumerable: true, get: function () { return materials_1.GLOW; } });
Object.defineProperty(exports, "ANODIZED", { enumerable: true, get: function () { return materials_1.ANODIZED; } });
// Combined presets
Object.defineProperty(exports, "MATERIAL_FINISHES", { enumerable: true, get: function () { return materials_1.MATERIAL_FINISHES; } });
// Utility functions
Object.defineProperty(exports, "getAllFinishes", { enumerable: true, get: function () { return materials_1.getAllFinishes; } });
Object.defineProperty(exports, "getFinishById", { enumerable: true, get: function () { return materials_1.getFinishById; } });
Object.defineProperty(exports, "getFinishByName", { enumerable: true, get: function () { return materials_1.getFinishByName; } });
Object.defineProperty(exports, "getHelmetFinishes", { enumerable: true, get: function () { return materials_1.getHelmetFinishes; } });
Object.defineProperty(exports, "getFacemaskFinishes", { enumerable: true, get: function () { return materials_1.getFacemaskFinishes; } });
Object.defineProperty(exports, "getFinishesByCategory", { enumerable: true, get: function () { return materials_1.getFinishesByCategory; } });
// Enums
Object.defineProperty(exports, "FinishCategory", { enumerable: true, get: function () { return materials_1.FinishCategory; } });
// ============================================================================
// Color Conversion Utilities
// ============================================================================
var color_converter_1 = require("./utils/color-converter");
// Basic conversions
Object.defineProperty(exports, "hexToRgb", { enumerable: true, get: function () { return color_converter_1.hexToRgb; } });
Object.defineProperty(exports, "rgbToHex", { enumerable: true, get: function () { return color_converter_1.rgbToHex; } });
Object.defineProperty(exports, "hexToThreeColor", { enumerable: true, get: function () { return color_converter_1.hexToThreeColor; } });
Object.defineProperty(exports, "threeColorToHex", { enumerable: true, get: function () { return color_converter_1.threeColorToHex; } });
Object.defineProperty(exports, "rgbToThreeColor", { enumerable: true, get: function () { return color_converter_1.rgbToThreeColor; } });
Object.defineProperty(exports, "threeColorToRgb", { enumerable: true, get: function () { return color_converter_1.threeColorToRgb; } });
// Normalized conversions
Object.defineProperty(exports, "rgbToNormalized", { enumerable: true, get: function () { return color_converter_1.rgbToNormalized; } });
Object.defineProperty(exports, "normalizedToRgb", { enumerable: true, get: function () { return color_converter_1.normalizedToRgb; } });
// Color creation
Object.defineProperty(exports, "createColorSpec", { enumerable: true, get: function () { return color_converter_1.createColorSpec; } });
// Color manipulation
Object.defineProperty(exports, "blendColors", { enumerable: true, get: function () { return color_converter_1.blendColors; } });
Object.defineProperty(exports, "lightenColor", { enumerable: true, get: function () { return color_converter_1.lightenColor; } });
Object.defineProperty(exports, "darkenColor", { enumerable: true, get: function () { return color_converter_1.darkenColor; } });
// Color analysis
Object.defineProperty(exports, "getColorLuminance", { enumerable: true, get: function () { return color_converter_1.getColorLuminance; } });
Object.defineProperty(exports, "isLightColor", { enumerable: true, get: function () { return color_converter_1.isLightColor; } });
Object.defineProperty(exports, "getContrastingTextColor", { enumerable: true, get: function () { return color_converter_1.getContrastingTextColor; } });
// ============================================================================
// Validation Utilities
// ============================================================================
var validators_1 = require("./utils/validators");
// Color validation
Object.defineProperty(exports, "validateHexColor", { enumerable: true, get: function () { return validators_1.validateHexColor; } });
Object.defineProperty(exports, "validateRgbColor", { enumerable: true, get: function () { return validators_1.validateRgbColor; } });
Object.defineProperty(exports, "validateThreeColor", { enumerable: true, get: function () { return validators_1.validateThreeColor; } });
Object.defineProperty(exports, "validateColorSpec", { enumerable: true, get: function () { return validators_1.validateColorSpec; } });
// Material validation
Object.defineProperty(exports, "validateMaterialFinish", { enumerable: true, get: function () { return validators_1.validateMaterialFinish; } });
Object.defineProperty(exports, "validateMaterial", { enumerable: true, get: function () { return validators_1.validateMaterial; } });
// Generic validation
Object.defineProperty(exports, "validateNumberArray", { enumerable: true, get: function () { return validators_1.validateNumberArray; } });
// Sanitization
Object.defineProperty(exports, "sanitizeRgb", { enumerable: true, get: function () { return validators_1.sanitizeRgb; } });
Object.defineProperty(exports, "sanitizeMaterialFinish", { enumerable: true, get: function () { return validators_1.sanitizeMaterialFinish; } });
// ============================================================================
// Package version
// ============================================================================
exports.VERSION = '1.0.0';
//# sourceMappingURL=index.js.map
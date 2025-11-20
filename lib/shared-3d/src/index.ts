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

// ============================================================================
// Types & Interfaces
// ============================================================================

export type {
  // Core types
  RGBColor,
  ColorSpec,
  Material3D,
  MaterialFinish,
  I3DObject,
  I3DMaterial,
  I3DRenderConfig,
  I3DCameraConfig,
  I3DLightConfig,
  I3DSceneConfig,
  // Main interface
  I3DEngine,
  I3DEngineFactory
} from './types/engine';

// ============================================================================
// Color Presets
// ============================================================================

export {
  // Color categories
  TEAM_COLORS,
  METALLIC_COLORS,
  NEUTRAL_COLORS,
  BRIGHT_COLORS,
  // Combined presets
  COLOR_PRESETS,
  // Utility functions
  getAllColors,
  getColorByName,
  getColorsByCategory,
  getAllCategories,
  // Enums
  ColorCategory
} from './presets/colors';

// ============================================================================
// Material Finish Presets
// ============================================================================

export {
  // Individual finishes
  GLOSSY,
  MATTE,
  CHROME,
  BRUSHED_METAL,
  SATIN,
  METALLIC_PAINT,
  PEARL,
  CARBON_FIBER,
  GLOW,
  ANODIZED,
  // Combined presets
  MATERIAL_FINISHES,
  // Utility functions
  getAllFinishes,
  getFinishById,
  getFinishByName,
  getHelmetFinishes,
  getFacemaskFinishes,
  getFinishesByCategory,
  // Enums
  FinishCategory
} from './presets/materials';

// ============================================================================
// Color Conversion Utilities
// ============================================================================

export {
  // Basic conversions
  hexToRgb,
  rgbToHex,
  hexToThreeColor,
  threeColorToHex,
  rgbToThreeColor,
  threeColorToRgb,
  // Normalized conversions
  rgbToNormalized,
  normalizedToRgb,
  // Color creation
  createColorSpec,
  // Color manipulation
  blendColors,
  lightenColor,
  darkenColor,
  // Color analysis
  getColorLuminance,
  isLightColor,
  getContrastingTextColor
} from './utils/color-converter';

// ============================================================================
// Validation Utilities
// ============================================================================

export type {
  // Validation result type
  ValidationResult
} from './utils/validators';

export {
  // Color validation
  validateHexColor,
  validateRgbColor,
  validateThreeColor,
  validateColorSpec,
  // Material validation
  validateMaterialFinish,
  validateMaterial,
  // Generic validation
  validateNumberArray,
  // Sanitization
  sanitizeRgb,
  sanitizeMaterialFinish
} from './utils/validators';

// ============================================================================
// Package version
// ============================================================================

export const VERSION = '1.0.0';

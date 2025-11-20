import { ColorSpec, RGBColor, MaterialFinish, I3DMaterial } from '../types/engine';
/**
 * Validation Utilities
 *
 * Pure TypeScript validation functions for colors and materials.
 * Zero dependencies, type-safe validation with detailed error messages.
 */
/**
 * Validation result interface
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings?: string[];
}
/**
 * Validate hex color string format
 * @param hex - Hex color string to validate
 * @returns Validation result
 */
export declare function validateHexColor(hex: string): ValidationResult;
/**
 * Validate RGB color values
 * @param rgb - RGB color object to validate
 * @returns Validation result
 */
export declare function validateRgbColor(rgb: RGBColor): ValidationResult;
/**
 * Validate Three.js color number
 * @param threeColor - Three.js color number to validate
 * @returns Validation result
 */
export declare function validateThreeColor(threeColor: number): ValidationResult;
/**
 * Validate complete ColorSpec object
 * @param colorSpec - ColorSpec object to validate
 * @returns Validation result
 */
export declare function validateColorSpec(colorSpec: ColorSpec): ValidationResult;
/**
 * Validate MaterialFinish object
 * @param finish - MaterialFinish object to validate
 * @returns Validation result
 */
export declare function validateMaterialFinish(finish: MaterialFinish): ValidationResult;
/**
 * Validate I3DMaterial object
 * @param material - I3DMaterial object to validate
 * @returns Validation result
 */
export declare function validateMaterial(material: I3DMaterial): ValidationResult;
/**
 * Validate array of numbers (for positions, rotations, scales)
 * @param arr - Array to validate
 * @param length - Expected length (default 3)
 * @param name - Name for error messages
 * @returns Validation result
 */
export declare function validateNumberArray(arr: number[], length?: number, name?: string): ValidationResult;
/**
 * Sanitize and clamp RGB values to valid range
 * @param rgb - RGB color to sanitize
 * @returns Sanitized RGB color
 */
export declare function sanitizeRgb(rgb: RGBColor): RGBColor;
/**
 * Sanitize material finish values to valid ranges
 * @param finish - MaterialFinish to sanitize
 * @returns Sanitized MaterialFinish
 */
export declare function sanitizeMaterialFinish(finish: MaterialFinish): MaterialFinish;
//# sourceMappingURL=validators.d.ts.map
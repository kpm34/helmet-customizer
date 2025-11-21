import { ColorSpec, RGBColor } from '../types/engine';
/**
 * Color Conversion Utilities
 *
 * Pure TypeScript color conversion functions with zero dependencies.
 * Converts between hex, RGB, and Three.js color formats.
 */
/**
 * Convert hex string to RGB (0-255 range)
 * @param hex - Hex color string (with or without #)
 * @returns RGB color object
 * @example hexToRgb('#FF0000') => { r: 255, g: 0, b: 0 }
 */
export declare function hexToRgb(hex: string): RGBColor;
/**
 * Convert RGB (0-255 range) to hex string
 * @param rgb - RGB color object
 * @returns Hex color string with #
 * @example rgbToHex({ r: 255, g: 0, b: 0 }) => '#FF0000'
 */
export declare function rgbToHex(rgb: RGBColor): string;
/**
 * Convert hex string to Three.js color number (0x000000 format)
 * @param hex - Hex color string (with or without #)
 * @returns Three.js color number
 * @example hexToThreeColor('#FF0000') => 0xFF0000
 */
export declare function hexToThreeColor(hex: string): number;
/**
 * Convert Three.js color number to hex string
 * @param threeColor - Three.js color number
 * @returns Hex color string with #
 * @example threeColorToHex(0xFF0000) => '#FF0000'
 */
export declare function threeColorToHex(threeColor: number): string;
/**
 * Convert RGB to Three.js color number
 * @param rgb - RGB color object (0-255 range)
 * @returns Three.js color number
 */
export declare function rgbToThreeColor(rgb: RGBColor): number;
/**
 * Convert Three.js color number to RGB
 * @param threeColor - Three.js color number
 * @returns RGB color object (0-255 range)
 */
export declare function threeColorToRgb(threeColor: number): RGBColor;
/**
 * Convert RGB (0-255) to normalized RGB (0-1)
 * Useful for Three.js Color constructor
 * @param rgb - RGB color (0-255 range)
 * @returns Normalized RGB (0-1 range)
 */
export declare function rgbToNormalized(rgb: RGBColor): {
    r: number;
    g: number;
    b: number;
};
/**
 * Convert normalized RGB (0-1) to RGB (0-255)
 * @param normalized - Normalized RGB (0-1 range)
 * @returns RGB color (0-255 range)
 */
export declare function normalizedToRgb(normalized: {
    r: number;
    g: number;
    b: number;
}): RGBColor;
/**
 * Create a complete ColorSpec from hex string
 * @param hex - Hex color string
 * @param name - Human-readable name (optional)
 * @returns Complete ColorSpec object
 */
export declare function createColorSpec(hex: string, name?: string): ColorSpec;
/**
 * Blend two colors together
 * @param color1 - First color (hex or ColorSpec)
 * @param color2 - Second color (hex or ColorSpec)
 * @param ratio - Blend ratio (0 = all color1, 1 = all color2)
 * @returns Blended color as ColorSpec
 */
export declare function blendColors(color1: string | ColorSpec, color2: string | ColorSpec, ratio?: number): ColorSpec;
/**
 * Lighten a color by a percentage
 * @param color - Color (hex or ColorSpec)
 * @param percent - Percentage to lighten (0-100)
 * @returns Lightened color as ColorSpec
 */
export declare function lightenColor(color: string | ColorSpec, percent: number): ColorSpec;
/**
 * Darken a color by a percentage
 * @param color - Color (hex or ColorSpec)
 * @param percent - Percentage to darken (0-100)
 * @returns Darkened color as ColorSpec
 */
export declare function darkenColor(color: string | ColorSpec, percent: number): ColorSpec;
/**
 * Calculate relative luminance (brightness) of a color
 * @param color - Color (hex or ColorSpec)
 * @returns Luminance value (0-1, where 0 is black, 1 is white)
 */
export declare function getColorLuminance(color: string | ColorSpec): number;
/**
 * Check if a color is light or dark
 * @param color - Color (hex or ColorSpec)
 * @param threshold - Luminance threshold (default 0.5)
 * @returns True if color is light
 */
export declare function isLightColor(color: string | ColorSpec, threshold?: number): boolean;
/**
 * Get contrasting text color (black or white) for a background color
 * @param backgroundColor - Background color (hex or ColorSpec)
 * @returns '#000000' or '#FFFFFF'
 */
export declare function getContrastingTextColor(backgroundColor: string | ColorSpec): string;
//# sourceMappingURL=color-converter.d.ts.map
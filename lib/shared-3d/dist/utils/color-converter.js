"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToRgb = hexToRgb;
exports.rgbToHex = rgbToHex;
exports.hexToThreeColor = hexToThreeColor;
exports.threeColorToHex = threeColorToHex;
exports.rgbToThreeColor = rgbToThreeColor;
exports.threeColorToRgb = threeColorToRgb;
exports.rgbToNormalized = rgbToNormalized;
exports.normalizedToRgb = normalizedToRgb;
exports.createColorSpec = createColorSpec;
exports.blendColors = blendColors;
exports.lightenColor = lightenColor;
exports.darkenColor = darkenColor;
exports.getColorLuminance = getColorLuminance;
exports.isLightColor = isLightColor;
exports.getContrastingTextColor = getContrastingTextColor;
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
function hexToRgb(hex) {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    // Handle 3-character shorthand
    let fullHex = cleanHex;
    if (cleanHex.length === 3) {
        fullHex = cleanHex
            .split('')
            .map(char => char + char)
            .join('');
    }
    // Parse RGB values
    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);
    return { r, g, b };
}
/**
 * Convert RGB (0-255 range) to hex string
 * @param rgb - RGB color object
 * @returns Hex color string with #
 * @example rgbToHex({ r: 255, g: 0, b: 0 }) => '#FF0000'
 */
function rgbToHex(rgb) {
    const r = Math.max(0, Math.min(255, Math.round(rgb.r)));
    const g = Math.max(0, Math.min(255, Math.round(rgb.g)));
    const b = Math.max(0, Math.min(255, Math.round(rgb.b)));
    const rHex = r.toString(16).padStart(2, '0').toUpperCase();
    const gHex = g.toString(16).padStart(2, '0').toUpperCase();
    const bHex = b.toString(16).padStart(2, '0').toUpperCase();
    return `#${rHex}${gHex}${bHex}`;
}
/**
 * Convert hex string to Three.js color number (0x000000 format)
 * @param hex - Hex color string (with or without #)
 * @returns Three.js color number
 * @example hexToThreeColor('#FF0000') => 0xFF0000
 */
function hexToThreeColor(hex) {
    const cleanHex = hex.replace('#', '');
    // Handle 3-character shorthand
    let fullHex = cleanHex;
    if (cleanHex.length === 3) {
        fullHex = cleanHex
            .split('')
            .map(char => char + char)
            .join('');
    }
    return parseInt(fullHex, 16);
}
/**
 * Convert Three.js color number to hex string
 * @param threeColor - Three.js color number
 * @returns Hex color string with #
 * @example threeColorToHex(0xFF0000) => '#FF0000'
 */
function threeColorToHex(threeColor) {
    const hex = threeColor.toString(16).padStart(6, '0').toUpperCase();
    return `#${hex}`;
}
/**
 * Convert RGB to Three.js color number
 * @param rgb - RGB color object (0-255 range)
 * @returns Three.js color number
 */
function rgbToThreeColor(rgb) {
    const r = Math.max(0, Math.min(255, Math.round(rgb.r)));
    const g = Math.max(0, Math.min(255, Math.round(rgb.g)));
    const b = Math.max(0, Math.min(255, Math.round(rgb.b)));
    return (r << 16) | (g << 8) | b;
}
/**
 * Convert Three.js color number to RGB
 * @param threeColor - Three.js color number
 * @returns RGB color object (0-255 range)
 */
function threeColorToRgb(threeColor) {
    const r = (threeColor >> 16) & 0xff;
    const g = (threeColor >> 8) & 0xff;
    const b = threeColor & 0xff;
    return { r, g, b };
}
/**
 * Convert RGB (0-255) to normalized RGB (0-1)
 * Useful for Three.js Color constructor
 * @param rgb - RGB color (0-255 range)
 * @returns Normalized RGB (0-1 range)
 */
function rgbToNormalized(rgb) {
    return {
        r: rgb.r / 255,
        g: rgb.g / 255,
        b: rgb.b / 255
    };
}
/**
 * Convert normalized RGB (0-1) to RGB (0-255)
 * @param normalized - Normalized RGB (0-1 range)
 * @returns RGB color (0-255 range)
 */
function normalizedToRgb(normalized) {
    return {
        r: Math.round(normalized.r * 255),
        g: Math.round(normalized.g * 255),
        b: Math.round(normalized.b * 255)
    };
}
/**
 * Create a complete ColorSpec from hex string
 * @param hex - Hex color string
 * @param name - Human-readable name (optional)
 * @returns Complete ColorSpec object
 */
function createColorSpec(hex, name) {
    const rgb = hexToRgb(hex);
    const threeColor = hexToThreeColor(hex);
    return {
        hex: hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`,
        rgb,
        threeColor,
        name: name || hex
    };
}
/**
 * Blend two colors together
 * @param color1 - First color (hex or ColorSpec)
 * @param color2 - Second color (hex or ColorSpec)
 * @param ratio - Blend ratio (0 = all color1, 1 = all color2)
 * @returns Blended color as ColorSpec
 */
function blendColors(color1, color2, ratio = 0.5) {
    // Clamp ratio between 0 and 1
    const t = Math.max(0, Math.min(1, ratio));
    // Convert to RGB
    const rgb1 = typeof color1 === 'string' ? hexToRgb(color1) : color1.rgb;
    const rgb2 = typeof color2 === 'string' ? hexToRgb(color2) : color2.rgb;
    // Blend RGB values
    const blendedRgb = {
        r: Math.round(rgb1.r * (1 - t) + rgb2.r * t),
        g: Math.round(rgb1.g * (1 - t) + rgb2.g * t),
        b: Math.round(rgb1.b * (1 - t) + rgb2.b * t)
    };
    const hex = rgbToHex(blendedRgb);
    const threeColor = hexToThreeColor(hex);
    return {
        hex,
        rgb: blendedRgb,
        threeColor,
        name: 'Blended Color'
    };
}
/**
 * Lighten a color by a percentage
 * @param color - Color (hex or ColorSpec)
 * @param percent - Percentage to lighten (0-100)
 * @returns Lightened color as ColorSpec
 */
function lightenColor(color, percent) {
    const rgb = typeof color === 'string' ? hexToRgb(color) : color.rgb;
    const amount = percent / 100;
    const lightenedRgb = {
        r: Math.min(255, Math.round(rgb.r + (255 - rgb.r) * amount)),
        g: Math.min(255, Math.round(rgb.g + (255 - rgb.g) * amount)),
        b: Math.min(255, Math.round(rgb.b + (255 - rgb.b) * amount))
    };
    const hex = rgbToHex(lightenedRgb);
    const threeColor = hexToThreeColor(hex);
    return {
        hex,
        rgb: lightenedRgb,
        threeColor,
        name: 'Lightened Color'
    };
}
/**
 * Darken a color by a percentage
 * @param color - Color (hex or ColorSpec)
 * @param percent - Percentage to darken (0-100)
 * @returns Darkened color as ColorSpec
 */
function darkenColor(color, percent) {
    const rgb = typeof color === 'string' ? hexToRgb(color) : color.rgb;
    const amount = percent / 100;
    const darkenedRgb = {
        r: Math.max(0, Math.round(rgb.r * (1 - amount))),
        g: Math.max(0, Math.round(rgb.g * (1 - amount))),
        b: Math.max(0, Math.round(rgb.b * (1 - amount)))
    };
    const hex = rgbToHex(darkenedRgb);
    const threeColor = hexToThreeColor(hex);
    return {
        hex,
        rgb: darkenedRgb,
        threeColor,
        name: 'Darkened Color'
    };
}
/**
 * Calculate relative luminance (brightness) of a color
 * @param color - Color (hex or ColorSpec)
 * @returns Luminance value (0-1, where 0 is black, 1 is white)
 */
function getColorLuminance(color) {
    const rgb = typeof color === 'string' ? hexToRgb(color) : color.rgb;
    // Convert to 0-1 range
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    // Apply gamma correction
    const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    // Calculate luminance
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}
/**
 * Check if a color is light or dark
 * @param color - Color (hex or ColorSpec)
 * @param threshold - Luminance threshold (default 0.5)
 * @returns True if color is light
 */
function isLightColor(color, threshold = 0.5) {
    return getColorLuminance(color) > threshold;
}
/**
 * Get contrasting text color (black or white) for a background color
 * @param backgroundColor - Background color (hex or ColorSpec)
 * @returns '#000000' or '#FFFFFF'
 */
function getContrastingTextColor(backgroundColor) {
    return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}
//# sourceMappingURL=color-converter.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHexColor = validateHexColor;
exports.validateRgbColor = validateRgbColor;
exports.validateThreeColor = validateThreeColor;
exports.validateColorSpec = validateColorSpec;
exports.validateMaterialFinish = validateMaterialFinish;
exports.validateMaterial = validateMaterial;
exports.validateNumberArray = validateNumberArray;
exports.sanitizeRgb = sanitizeRgb;
exports.sanitizeMaterialFinish = sanitizeMaterialFinish;
/**
 * Validate hex color string format
 * @param hex - Hex color string to validate
 * @returns Validation result
 */
function validateHexColor(hex) {
    const errors = [];
    const warnings = [];
    // Check if string is provided
    if (!hex || typeof hex !== 'string') {
        errors.push('Hex color must be a non-empty string');
        return { valid: false, errors, warnings };
    }
    // Remove # if present for validation
    const cleanHex = hex.replace('#', '');
    // Check length (3 or 6 characters)
    if (cleanHex.length !== 3 && cleanHex.length !== 6) {
        errors.push(`Invalid hex color length: ${cleanHex.length}. Expected 3 or 6 characters.`);
    }
    // Check if all characters are valid hex digits
    const hexRegex = /^[0-9A-Fa-f]+$/;
    if (!hexRegex.test(cleanHex)) {
        errors.push('Hex color contains invalid characters. Only 0-9 and A-F are allowed.');
    }
    // Warning for missing #
    if (!hex.startsWith('#')) {
        warnings.push('Hex color should start with #. Auto-correcting to: #' + cleanHex);
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined
    };
}
/**
 * Validate RGB color values
 * @param rgb - RGB color object to validate
 * @returns Validation result
 */
function validateRgbColor(rgb) {
    const errors = [];
    const warnings = [];
    // Check if object is provided
    if (!rgb || typeof rgb !== 'object') {
        errors.push('RGB color must be an object with r, g, b properties');
        return { valid: false, errors, warnings };
    }
    // Check if r, g, b properties exist
    if (typeof rgb.r !== 'number')
        errors.push('RGB.r must be a number');
    if (typeof rgb.g !== 'number')
        errors.push('RGB.g must be a number');
    if (typeof rgb.b !== 'number')
        errors.push('RGB.b must be a number');
    if (errors.length > 0) {
        return { valid: false, errors, warnings };
    }
    // Check value ranges (0-255)
    if (rgb.r < 0 || rgb.r > 255) {
        errors.push(`RGB.r out of range: ${rgb.r}. Must be 0-255.`);
    }
    if (rgb.g < 0 || rgb.g > 255) {
        errors.push(`RGB.g out of range: ${rgb.g}. Must be 0-255.`);
    }
    if (rgb.b < 0 || rgb.b > 255) {
        errors.push(`RGB.b out of range: ${rgb.b}. Must be 0-255.`);
    }
    // Warning for non-integer values
    if (!Number.isInteger(rgb.r))
        warnings.push('RGB.r is not an integer. Will be rounded.');
    if (!Number.isInteger(rgb.g))
        warnings.push('RGB.g is not an integer. Will be rounded.');
    if (!Number.isInteger(rgb.b))
        warnings.push('RGB.b is not an integer. Will be rounded.');
    return {
        valid: errors.length === 0,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined
    };
}
/**
 * Validate Three.js color number
 * @param threeColor - Three.js color number to validate
 * @returns Validation result
 */
function validateThreeColor(threeColor) {
    const errors = [];
    const warnings = [];
    // Check if number is provided
    if (typeof threeColor !== 'number') {
        errors.push('Three.js color must be a number');
        return { valid: false, errors, warnings };
    }
    // Check if integer
    if (!Number.isInteger(threeColor)) {
        errors.push('Three.js color must be an integer');
    }
    // Check range (0x000000 to 0xFFFFFF)
    if (threeColor < 0x000000 || threeColor > 0xffffff) {
        errors.push(`Three.js color out of range: ${threeColor}. Must be 0x000000 to 0xFFFFFF.`);
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined
    };
}
/**
 * Validate complete ColorSpec object
 * @param colorSpec - ColorSpec object to validate
 * @returns Validation result
 */
function validateColorSpec(colorSpec) {
    const errors = [];
    const warnings = [];
    // Check if object is provided
    if (!colorSpec || typeof colorSpec !== 'object') {
        errors.push('ColorSpec must be an object');
        return { valid: false, errors, warnings };
    }
    // Validate hex
    const hexResult = validateHexColor(colorSpec.hex);
    if (!hexResult.valid) {
        errors.push(...hexResult.errors);
    }
    if (hexResult.warnings) {
        warnings.push(...hexResult.warnings);
    }
    // Validate RGB
    const rgbResult = validateRgbColor(colorSpec.rgb);
    if (!rgbResult.valid) {
        errors.push(...rgbResult.errors);
    }
    if (rgbResult.warnings) {
        warnings.push(...rgbResult.warnings);
    }
    // Validate Three.js color
    const threeColorResult = validateThreeColor(colorSpec.threeColor);
    if (!threeColorResult.valid) {
        errors.push(...threeColorResult.errors);
    }
    // Validate name
    if (!colorSpec.name || typeof colorSpec.name !== 'string') {
        warnings.push('ColorSpec should have a name string');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined
    };
}
/**
 * Validate MaterialFinish object
 * @param finish - MaterialFinish object to validate
 * @returns Validation result
 */
function validateMaterialFinish(finish) {
    const errors = [];
    const warnings = [];
    // Check if object is provided
    if (!finish || typeof finish !== 'object') {
        errors.push('MaterialFinish must be an object');
        return { valid: false, errors, warnings };
    }
    // Validate required fields
    if (!finish.id || typeof finish.id !== 'string') {
        errors.push('MaterialFinish.id must be a non-empty string');
    }
    if (!finish.name || typeof finish.name !== 'string') {
        errors.push('MaterialFinish.name must be a non-empty string');
    }
    // Validate roughness (0-1)
    if (typeof finish.roughness !== 'number') {
        errors.push('MaterialFinish.roughness must be a number');
    }
    else if (finish.roughness < 0 || finish.roughness > 1) {
        errors.push(`MaterialFinish.roughness out of range: ${finish.roughness}. Must be 0-1.`);
    }
    // Validate metalness (0-1)
    if (typeof finish.metalness !== 'number') {
        errors.push('MaterialFinish.metalness must be a number');
    }
    else if (finish.metalness < 0 || finish.metalness > 1) {
        errors.push(`MaterialFinish.metalness out of range: ${finish.metalness}. Must be 0-1.`);
    }
    // Validate optional clearcoat (0-1)
    if (finish.clearcoat !== undefined) {
        if (typeof finish.clearcoat !== 'number') {
            errors.push('MaterialFinish.clearcoat must be a number');
        }
        else if (finish.clearcoat < 0 || finish.clearcoat > 1) {
            errors.push(`MaterialFinish.clearcoat out of range: ${finish.clearcoat}. Must be 0-1.`);
        }
    }
    // Validate optional clearcoatRoughness (0-1)
    if (finish.clearcoatRoughness !== undefined) {
        if (typeof finish.clearcoatRoughness !== 'number') {
            errors.push('MaterialFinish.clearcoatRoughness must be a number');
        }
        else if (finish.clearcoatRoughness < 0 || finish.clearcoatRoughness > 1) {
            errors.push(`MaterialFinish.clearcoatRoughness out of range: ${finish.clearcoatRoughness}. Must be 0-1.`);
        }
    }
    // Validate optional emissiveIntensity
    if (finish.emissiveIntensity !== undefined) {
        if (typeof finish.emissiveIntensity !== 'number') {
            errors.push('MaterialFinish.emissiveIntensity must be a number');
        }
        else if (finish.emissiveIntensity < 0) {
            warnings.push('MaterialFinish.emissiveIntensity is negative, which is unusual');
        }
    }
    // Warning for clearcoat without clearcoatRoughness
    if (finish.clearcoat !== undefined && finish.clearcoat > 0 && finish.clearcoatRoughness === undefined) {
        warnings.push('MaterialFinish has clearcoat but no clearcoatRoughness specified');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined
    };
}
/**
 * Validate I3DMaterial object
 * @param material - I3DMaterial object to validate
 * @returns Validation result
 */
function validateMaterial(material) {
    const errors = [];
    const warnings = [];
    // Check if object is provided
    if (!material || typeof material !== 'object') {
        errors.push('I3DMaterial must be an object');
        return { valid: false, errors, warnings };
    }
    // Validate name
    if (!material.name || typeof material.name !== 'string') {
        errors.push('I3DMaterial.name must be a non-empty string');
    }
    // Validate color
    const colorResult = validateColorSpec(material.color);
    if (!colorResult.valid) {
        errors.push(...colorResult.errors.map(e => `color: ${e}`));
    }
    if (colorResult.warnings) {
        warnings.push(...colorResult.warnings.map(w => `color: ${w}`));
    }
    // Validate finish
    const finishResult = validateMaterialFinish(material.finish);
    if (!finishResult.valid) {
        errors.push(...finishResult.errors.map(e => `finish: ${e}`));
    }
    if (finishResult.warnings) {
        warnings.push(...finishResult.warnings.map(w => `finish: ${w}`));
    }
    // Validate optional opacity (0-1)
    if (material.opacity !== undefined) {
        if (typeof material.opacity !== 'number') {
            errors.push('I3DMaterial.opacity must be a number');
        }
        else if (material.opacity < 0 || material.opacity > 1) {
            errors.push(`I3DMaterial.opacity out of range: ${material.opacity}. Must be 0-1.`);
        }
    }
    // Warning for transparency without opacity
    if (material.transparent && material.opacity === undefined) {
        warnings.push('Material is transparent but opacity is not specified. Defaulting to 1.0.');
    }
    // Warning for opacity < 1 without transparent flag
    if (material.opacity !== undefined && material.opacity < 1 && !material.transparent) {
        warnings.push('Material has opacity < 1 but transparent flag is not set. Should set transparent: true.');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined
    };
}
/**
 * Validate array of numbers (for positions, rotations, scales)
 * @param arr - Array to validate
 * @param length - Expected length (default 3)
 * @param name - Name for error messages
 * @returns Validation result
 */
function validateNumberArray(arr, length = 3, name = 'Array') {
    const errors = [];
    const warnings = [];
    // Check if array
    if (!Array.isArray(arr)) {
        errors.push(`${name} must be an array`);
        return { valid: false, errors, warnings };
    }
    // Check length
    if (arr.length !== length) {
        errors.push(`${name} must have ${length} elements, got ${arr.length}`);
    }
    // Check if all elements are numbers
    arr.forEach((val, idx) => {
        if (typeof val !== 'number') {
            errors.push(`${name}[${idx}] must be a number, got ${typeof val}`);
        }
        else if (!isFinite(val)) {
            errors.push(`${name}[${idx}] must be finite, got ${val}`);
        }
    });
    return {
        valid: errors.length === 0,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined
    };
}
/**
 * Sanitize and clamp RGB values to valid range
 * @param rgb - RGB color to sanitize
 * @returns Sanitized RGB color
 */
function sanitizeRgb(rgb) {
    return {
        r: Math.max(0, Math.min(255, Math.round(rgb.r))),
        g: Math.max(0, Math.min(255, Math.round(rgb.g))),
        b: Math.max(0, Math.min(255, Math.round(rgb.b)))
    };
}
/**
 * Sanitize material finish values to valid ranges
 * @param finish - MaterialFinish to sanitize
 * @returns Sanitized MaterialFinish
 */
function sanitizeMaterialFinish(finish) {
    const sanitized = {
        ...finish,
        roughness: Math.max(0, Math.min(1, finish.roughness)),
        metalness: Math.max(0, Math.min(1, finish.metalness))
    };
    if (finish.clearcoat !== undefined) {
        sanitized.clearcoat = Math.max(0, Math.min(1, finish.clearcoat));
    }
    if (finish.clearcoatRoughness !== undefined) {
        sanitized.clearcoatRoughness = Math.max(0, Math.min(1, finish.clearcoatRoughness));
    }
    if (finish.emissiveIntensity !== undefined) {
        sanitized.emissiveIntensity = Math.max(0, finish.emissiveIntensity);
    }
    return sanitized;
}
//# sourceMappingURL=validators.js.map
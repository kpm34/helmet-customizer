import { ColorSpec } from '../types/engine';

/**
 * Color Presets Library
 *
 * 18 predefined color presets for helmet customization and 3D rendering.
 * Categories: Team Colors, Metallics, Neutrals, Bright Colors
 *
 * Each preset includes:
 * - hex: Hex color string
 * - rgb: RGB values (0-255)
 * - threeColor: Three.js color number
 * - name: Human-readable name
 */

// Helper function to create color spec from hex
function createColorSpec(hex: string, name: string): ColorSpec {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Parse hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Convert to Three.js color number
  const threeColor = parseInt(cleanHex, 16);

  return {
    hex: '#' + cleanHex.toUpperCase(),
    rgb: { r, g, b },
    threeColor,
    name
  };
}

/**
 * Team Colors (8 colors)
 */
export const TEAM_COLORS = {
  CRIMSON_RED: createColorSpec('#DC143C', 'Crimson Red'),
  NAVY_BLUE: createColorSpec('#000080', 'Navy Blue'),
  FOREST_GREEN: createColorSpec('#228B22', 'Forest Green'),
  BURNT_ORANGE: createColorSpec('#CC5500', 'Burnt Orange'),
  ROYAL_PURPLE: createColorSpec('#7851A9', 'Royal Purple'),
  CARDINAL_RED: createColorSpec('#C41E3A', 'Cardinal Red'),
  ELECTRIC_BLUE: createColorSpec('#0080FF', 'Electric Blue'),
  KELLY_GREEN: createColorSpec('#4CBB17', 'Kelly Green')
};

/**
 * Metallic Colors (4 colors)
 */
export const METALLIC_COLORS = {
  CHROME_SILVER: createColorSpec('#C0C0C0', 'Chrome Silver'),
  GOLD: createColorSpec('#FFD700', 'Gold'),
  BRONZE: createColorSpec('#CD7F32', 'Bronze'),
  COPPER: createColorSpec('#B87333', 'Copper')
};

/**
 * Neutral Colors (3 colors)
 */
export const NEUTRAL_COLORS = {
  BLACK: createColorSpec('#000000', 'Black'),
  WHITE: createColorSpec('#FFFFFF', 'White'),
  STEEL_GRAY: createColorSpec('#71797E', 'Steel Gray')
};

/**
 * Bright/Accent Colors (3 colors)
 */
export const BRIGHT_COLORS = {
  NEON_YELLOW: createColorSpec('#FFFF00', 'Neon Yellow'),
  HOT_PINK: createColorSpec('#FF69B4', 'Hot Pink'),
  LIME_GREEN: createColorSpec('#32CD32', 'Lime Green')
};

/**
 * All color presets combined (18 total)
 */
export const COLOR_PRESETS: Record<string, ColorSpec> = {
  ...TEAM_COLORS,
  ...METALLIC_COLORS,
  ...NEUTRAL_COLORS,
  ...BRIGHT_COLORS
};

/**
 * Get all color presets as an array
 */
export function getAllColors(): ColorSpec[] {
  return Object.values(COLOR_PRESETS);
}

/**
 * Get color by name (case-insensitive)
 */
export function getColorByName(name: string): ColorSpec | null {
  const normalizedName = name.toUpperCase().replace(/\s+/g, '_');
  return COLOR_PRESETS[normalizedName] || null;
}

/**
 * Get colors by category
 */
export function getColorsByCategory(category: 'team' | 'metallic' | 'neutral' | 'bright'): ColorSpec[] {
  switch (category) {
    case 'team':
      return Object.values(TEAM_COLORS);
    case 'metallic':
      return Object.values(METALLIC_COLORS);
    case 'neutral':
      return Object.values(NEUTRAL_COLORS);
    case 'bright':
      return Object.values(BRIGHT_COLORS);
    default:
      return [];
  }
}

/**
 * Color categories enum
 */
export enum ColorCategory {
  TEAM = 'team',
  METALLIC = 'metallic',
  NEUTRAL = 'neutral',
  BRIGHT = 'bright'
}

/**
 * Get all categories
 */
export function getAllCategories(): ColorCategory[] {
  return [
    ColorCategory.TEAM,
    ColorCategory.METALLIC,
    ColorCategory.NEUTRAL,
    ColorCategory.BRIGHT
  ];
}

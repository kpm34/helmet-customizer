import { ColorSpec } from '../types/engine';
/**
 * Team Colors (8 colors)
 */
export declare const TEAM_COLORS: {
    CRIMSON_RED: ColorSpec;
    NAVY_BLUE: ColorSpec;
    FOREST_GREEN: ColorSpec;
    BURNT_ORANGE: ColorSpec;
    ROYAL_PURPLE: ColorSpec;
    CARDINAL_RED: ColorSpec;
    ELECTRIC_BLUE: ColorSpec;
    KELLY_GREEN: ColorSpec;
};
/**
 * Metallic Colors (4 colors)
 */
export declare const METALLIC_COLORS: {
    CHROME_SILVER: ColorSpec;
    GOLD: ColorSpec;
    BRONZE: ColorSpec;
    COPPER: ColorSpec;
};
/**
 * Neutral Colors (3 colors)
 */
export declare const NEUTRAL_COLORS: {
    BLACK: ColorSpec;
    WHITE: ColorSpec;
    STEEL_GRAY: ColorSpec;
};
/**
 * Bright/Accent Colors (3 colors)
 */
export declare const BRIGHT_COLORS: {
    NEON_YELLOW: ColorSpec;
    HOT_PINK: ColorSpec;
    LIME_GREEN: ColorSpec;
};
/**
 * All color presets combined (18 total)
 */
export declare const COLOR_PRESETS: Record<string, ColorSpec>;
/**
 * Get all color presets as an array
 */
export declare function getAllColors(): ColorSpec[];
/**
 * Get color by name (case-insensitive)
 */
export declare function getColorByName(name: string): ColorSpec | null;
/**
 * Get colors by category
 */
export declare function getColorsByCategory(category: 'team' | 'metallic' | 'neutral' | 'bright'): ColorSpec[];
/**
 * Color categories enum
 */
export declare enum ColorCategory {
    TEAM = "team",
    METALLIC = "metallic",
    NEUTRAL = "neutral",
    BRIGHT = "bright"
}
/**
 * Get all categories
 */
export declare function getAllCategories(): ColorCategory[];
//# sourceMappingURL=colors.d.ts.map
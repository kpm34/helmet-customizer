/**
 * Centralized Constants for Helmet Customizer
 *
 * This file contains all shared configuration constants, presets, and enums
 * to eliminate duplication across the codebase.
 */

import type { HelmetZone, MaterialFinish } from '@/store/helmetStore';

// ============================================================
// ZONE CONFIGURATION
// ============================================================

/**
 * Complete zone configuration with labels and descriptions
 * Use this as the single source of truth for all zone-related UI
 */
export const ZONES_CONFIG: Array<{
  id: HelmetZone;
  label: string;
  description: string;
}> = [
  {
    id: 'shell',
    label: 'Shell',
    description: 'Main helmet shell body'
  },
  {
    id: 'facemask',
    label: 'Facemask',
    description: 'Face protection bars'
  },
  {
    id: 'chinstrap',
    label: 'Chinstrap',
    description: 'Chin retention strap'
  },
  {
    id: 'padding',
    label: 'Padding',
    description: 'Interior padding (visible areas)'
  },
  {
    id: 'hardware',
    label: 'Hardware',
    description: 'Screws, clips, and fasteners'
  },
];

/**
 * Zone IDs in order (for iteration)
 */
export const ZONE_ORDER: HelmetZone[] = ZONES_CONFIG.map(z => z.id);

/**
 * Get zone configuration by ID
 */
export function getZoneConfig(zoneId: HelmetZone) {
  return ZONES_CONFIG.find(z => z.id === zoneId);
}

/**
 * Zone labels (for backward compatibility)
 * Prefer using ZONES_CONFIG directly
 */
export const ZONE_LABELS: Record<HelmetZone, string> = Object.fromEntries(
  ZONES_CONFIG.map(z => [z.id, z.label])
) as Record<HelmetZone, string>;

/**
 * Zone descriptions (for backward compatibility)
 * Prefer using ZONES_CONFIG directly
 */
export const ZONE_DESCRIPTIONS: Record<HelmetZone, string> = Object.fromEntries(
  ZONES_CONFIG.map(z => [z.id, z.description])
) as Record<HelmetZone, string>;

// ============================================================
// MATERIAL FINISH PRESETS
// ============================================================

/**
 * Material finish properties (metalness, roughness)
 * Single source of truth for all finish calculations
 */
export interface FinishProperties {
  name: string;
  metalness: number;
  roughness: number;
}

/**
 * Material finish presets
 * Used by: store, Spline API, webhook validation
 */
export const FINISH_PRESETS: Record<MaterialFinish, FinishProperties> = {
  glossy: {
    name: 'Glossy Plastic',
    metalness: 0.0,
    roughness: 0.1,
  },
  matte: {
    name: 'Matte Plastic',
    metalness: 0.0,
    roughness: 0.8,
  },
  chrome: {
    name: 'Chrome Mirror',
    metalness: 1.0,
    roughness: 0.05,
  },
  brushed: {
    name: 'Brushed Metal',
    metalness: 0.9,
    roughness: 0.35,
  },
  satin: {
    name: 'Satin',
    metalness: 0.1,
    roughness: 0.5,
  },
  pearl_coat: {
    name: 'Pearl Coat',
    metalness: 0.7,
    roughness: 0.2,
  },
  satin_automotive: {
    name: 'Satin Auto',
    metalness: 0.3,
    roughness: 0.6,
  },
  metallic_flake: {
    name: 'Metallic Flake',
    metalness: 0.8,
    roughness: 0.25,
  },
  wet_clearcoat: {
    name: 'Wet Clear Coat',
    metalness: 0.1,
    roughness: 0.05,
  },
  anodized_metal: {
    name: 'Anodized Metal',
    metalness: 0.95,
    roughness: 0.15,
  },
  brushed_titanium: {
    name: 'Brushed Titanium',
    metalness: 0.9,
    roughness: 0.35,
  },
  weathered_metal: {
    name: 'Weathered Metal',
    metalness: 0.7,
    roughness: 0.65,
  },
  carbon_fiber: {
    name: 'Carbon Fiber',
    metalness: 0.4,
    roughness: 0.3,
  },
  rubberized_softtouch: {
    name: 'Rubberized Soft Touch',
    metalness: 0.0,
    roughness: 0.9,
  },
  ceramic_gloss: {
    name: 'Ceramic Gloss',
    metalness: 0.1,
    roughness: 0.05,
  },
  frosted_polycarbonate: {
    name: 'Frosted Polycarbonate',
    metalness: 0.0,
    roughness: 0.4,
  },
  holographic_foil: {
    name: 'Holographic Foil',
    metalness: 0.9,
    roughness: 0.1,
  },
};

/**
 * Get finish properties by finish type
 */
export function getFinishProperties(finish: MaterialFinish): FinishProperties {
  return FINISH_PRESETS[finish];
}

/**
 * Get all finish types
 */
export const FINISH_TYPES: MaterialFinish[] = Object.keys(FINISH_PRESETS) as MaterialFinish[];

// ============================================================
// CAMERA PRESETS
// ============================================================

export interface CameraPreset {
  name: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

/**
 * Camera view presets for Spline scene
 * Single source of truth for all camera positions
 */
export const CAMERA_PRESETS: Record<string, CameraPreset> = {
  front: {
    name: 'Front View',
    position: { x: 0, y: 0, z: 5 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  side: {
    name: 'Side View',
    position: { x: 5, y: 0, z: 0 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
  },
  back: {
    name: 'Back View',
    position: { x: 0, y: 0, z: -5 },
    rotation: { x: 0, y: Math.PI, z: 0 },
  },
  threequarter: {
    name: 'Three Quarter',
    position: { x: 4, y: 2, z: 4 },
    rotation: { x: -0.3, y: Math.PI / 4, z: 0 },
  },
};

// ============================================================
// DEFAULT CONFIGURATIONS
// ============================================================

/**
 * Default helmet configuration
 * CFB-themed default colors
 */
export const DEFAULT_HELMET_CONFIG = {
  shell: {
    color: '#000000', // Black
    finish: 'matte' as MaterialFinish,
  },
  facemask: {
    color: '#7F7F7F', // Medium gray
    finish: 'brushed' as MaterialFinish,
  },
  chinstrap: {
    color: '#1C1C1C', // Dark gray
    finish: 'matte' as MaterialFinish,
  },
  padding: {
    color: '#333333', // Charcoal
    finish: 'matte' as MaterialFinish,
  },
  hardware: {
    color: '#737373', // 10% darker than facemask (#7F7F7F * 0.9 = #737373)
    finish: 'matte' as MaterialFinish, // Always matte
  },
};

// ============================================================
// VALIDATION HELPERS
// ============================================================

/**
 * Check if a string is a valid HelmetZone
 */
export function isValidZone(zone: string): zone is HelmetZone {
  return ZONE_ORDER.includes(zone as HelmetZone);
}

/**
 * Check if a string is a valid MaterialFinish
 */
export function isValidFinish(finish: string): finish is MaterialFinish {
  return FINISH_TYPES.includes(finish as MaterialFinish);
}

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

/**
 * Validate number in range
 */
export function isValidNumber(value: any, min: number = 0, max: number = 1): boolean {
  return typeof value === 'number' && value >= min && value <= max;
}

// ============================================================
// PATTERN CONFIGURATION
// ============================================================

import type { PatternCategory, PatternType, PatternVariant } from '@/store/helmetStore';

/**
 * Pattern category configuration (Level 1)
 */
export interface PatternCategoryConfig {
  id: PatternCategory;
  label: string;
  thumbnail: string;
  description: string;
}

export const PATTERN_CATEGORIES: Record<PatternCategory, PatternCategoryConfig> = {
  stripes: {
    id: 'stripes',
    label: 'Stripes',
    thumbnail: '/patterns/category/stripes.png',
    description: 'Classic stripe patterns'
  },
  animals: {
    id: 'animals',
    label: 'Animals',
    thumbnail: '/patterns/category/animals.png',
    description: 'Animal-inspired patterns'
  },
  camo: {
    id: 'camo',
    label: 'Camo',
    thumbnail: '/patterns/category/camo.png',
    description: 'Camouflage PBR materials'
  }
};

/**
 * Pattern type configuration (Level 2)
 */
export interface PatternTypeConfig {
  id: PatternType;
  category: PatternCategory;
  label: string;
  thumbnail: string;
  hasVariants: boolean; // If true, shows Level 3 variant selector
  pbrPaths?: {
    albedo: string;
    normal: string;
    roughness: string;
  };
}

export const PATTERN_TYPES: Record<PatternType, PatternTypeConfig> = {
  // Animals - Placeholders for now (user will create SVGs later)
  tiger: {
    id: 'tiger',
    category: 'animals',
    label: 'Tiger',
    thumbnail: '/patterns/types/tiger.png',
    hasVariants: true
  },
  ram: {
    id: 'ram',
    category: 'animals',
    label: 'Ram',
    thumbnail: '/patterns/types/ram.png',
    hasVariants: true
  },
  wolverine: {
    id: 'wolverine',
    category: 'animals',
    label: 'Wolverine',
    thumbnail: '/patterns/types/wolverine.png',
    hasVariants: true
  },
  leopard: {
    id: 'leopard',
    category: 'animals',
    label: 'Leopard',
    thumbnail: '/patterns/types/leopard.png',
    hasVariants: true
  },
  jaguar: {
    id: 'jaguar',
    category: 'animals',
    label: 'Jaguar',
    thumbnail: '/patterns/types/jaguar.png',
    hasVariants: true
  },

  // Stripes - SVG patterns (direct apply for now, no variants)
  stripe_single: {
    id: 'stripe_single',
    category: 'stripes',
    label: 'Single Stripe',
    thumbnail: '/patterns/stripe_single.png',
    hasVariants: false // Direct apply for now
  },
  stripe_double: {
    id: 'stripe_double',
    category: 'stripes',
    label: 'Double Stripe',
    thumbnail: '/patterns/stripe_double.png',
    hasVariants: false // Direct apply for now
  },

  // Camo (PBR - using existing textures from assets/pattern-textures/)
  camo_woodland: {
    id: 'camo_woodland',
    category: 'camo',
    label: 'Camo White',
    thumbnail: '/patterns/camo.png',
    hasVariants: false,
    pbrPaths: {
      albedo: '/assets/pattern-textures/camo-white-pattern-albedo-2k.png',
      normal: '/assets/pattern-textures/camo-white-pattern-normal-2k.png',
      roughness: '/assets/pattern-textures/camo-white-pattern-roughness-2k.png'
    }
  },
  camo_digital: {
    id: 'camo_digital',
    category: 'camo',
    label: 'Carbon Fiber',
    thumbnail: '/patterns/camo.png',
    hasVariants: false,
    pbrPaths: {
      albedo: '/assets/pattern-textures/carbon-fiber-matcap-1k.png',
      normal: '/assets/pattern-textures/carbon-fiber-matcap-1k.png',
      roughness: '/assets/pattern-textures/carbon-fiber-matcap-1k.png'
    }
  },
  // Remaining camo types - placeholders for future PBR textures
  camo_urban: {
    id: 'camo_urban',
    category: 'camo',
    label: 'Urban',
    thumbnail: '/patterns/camo.png',
    hasVariants: false,
    pbrPaths: {
      albedo: '/camo-pbr/urban/albedo.png',
      normal: '/camo-pbr/urban/normal.png',
      roughness: '/camo-pbr/urban/roughness.png'
    }
  },
  camo_desert: {
    id: 'camo_desert',
    category: 'camo',
    label: 'Desert',
    thumbnail: '/patterns/camo.png',
    hasVariants: false,
    pbrPaths: {
      albedo: '/camo-pbr/desert/albedo.png',
      normal: '/camo-pbr/desert/normal.png',
      roughness: '/camo-pbr/desert/roughness.png'
    }
  },
  camo_navy: {
    id: 'camo_navy',
    category: 'camo',
    label: 'Navy',
    thumbnail: '/patterns/camo.png',
    hasVariants: false,
    pbrPaths: {
      albedo: '/camo-pbr/navy/albedo.png',
      normal: '/camo-pbr/navy/normal.png',
      roughness: '/camo-pbr/navy/roughness.png'
    }
  },
  camo_tiger: {
    id: 'camo_tiger',
    category: 'camo',
    label: 'Tiger Stripe',
    thumbnail: '/patterns/camo.png',
    hasVariants: false,
    pbrPaths: {
      albedo: '/camo-pbr/tiger/albedo.png',
      normal: '/camo-pbr/tiger/normal.png',
      roughness: '/camo-pbr/tiger/roughness.png'
    }
  },
  camo_multicam: {
    id: 'camo_multicam',
    category: 'camo',
    label: 'Multicam',
    thumbnail: '/patterns/camo.png',
    hasVariants: false,
    pbrPaths: {
      albedo: '/camo-pbr/multicam/albedo.png',
      normal: '/camo-pbr/multicam/normal.png',
      roughness: '/camo-pbr/multicam/roughness.png'
    }
  },
  camo_carbon: {
    id: 'camo_carbon',
    category: 'camo',
    label: 'Carbon Fiber Alt',
    thumbnail: '/patterns/camo.png',
    hasVariants: false,
    pbrPaths: {
      albedo: '/camo-pbr/carbon/albedo.png',
      normal: '/camo-pbr/carbon/normal.png',
      roughness: '/camo-pbr/carbon/roughness.png'
    }
  }
};

/**
 * Pattern variant configuration (Level 3 - for future animal SVGs)
 * User will create these SVG variants later
 */
export interface PatternVariantConfig {
  id: PatternVariant;
  type: PatternType;
  label: string;
  svgPath: string;
  preview: string; // Full-width rectangular preview image
}

// Pattern variants - placeholder for future animal SVG variants
// User will add these after creating the SVG files
export const PATTERN_VARIANTS: PatternVariantConfig[] = [
  // TODO: Add animal pattern variants here when SVGs are ready
  // Example structure:
  // { id: 'tiger_v1', type: 'tiger', label: 'Tiger Style 1', svgPath: '/patterns/svg/tiger_v1.svg', preview: '/patterns/previews/tiger_v1.png' },
];

/**
 * Helper: Get pattern types by category
 */
export function getPatternTypesByCategory(category: PatternCategory): PatternTypeConfig[] {
  return Object.values(PATTERN_TYPES).filter(t => t.category === category);
}

/**
 * Helper: Get pattern variants by type
 */
export function getPatternVariantsByType(type: PatternType): PatternVariantConfig[] {
  return PATTERN_VARIANTS.filter(v => v.type === type);
}

/**
 * Helper: Get pattern type config
 */
export function getPatternType(type: PatternType): PatternTypeConfig | undefined {
  return PATTERN_TYPES[type];
}

/**
 * Helper: Get pattern variant config
 */
export function getPatternVariant(variant: PatternVariant): PatternVariantConfig | undefined {
  return PATTERN_VARIANTS.find(v => v.id === variant);
}

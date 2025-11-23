/**
 * Centralized Constants for Helmet Customizer
 *
 * This file contains all shared configuration constants, presets, and enums
 * to eliminate duplication across the codebase.
 */

import type { HelmetZone, MaterialFinish, PatternType } from '@/store/helmetStore';

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
    color: '#FFFFFF', // White
    finish: 'glossy' as MaterialFinish,
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
    color: '#C0C0C0', // Silver
    finish: 'chrome' as MaterialFinish,
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

/**
 * Pattern category types
 */
export type PatternCategoryType = 'simple' | 'complex';
export type PatternCategoryKey = 'stripes' | 'camo' | 'tiger' | 'leopard' | 'jaguar' | 'horns' | 'noise' | 'rusted';

/**
 * Pattern category configuration
 */
export interface PatternCategory {
  label: string;
  icon: string;
  type: PatternCategoryType;
  available: boolean;
  description?: string;
}

/**
 * Pattern configuration
 */
export interface Pattern {
  id: PatternType;
  name: string;
  category: PatternCategoryKey | null;
  thumbnail80?: string;
  thumbnail120?: string;
  texturePath?: string;
  available: boolean;
  description?: string;
}

/**
 * Pattern categories configuration
 * - simple: 2-4 patterns, shown in accordion
 * - complex: 7-10+ patterns, shown in drawer
 */
export const PATTERN_CATEGORIES: Record<PatternCategoryKey, PatternCategory> = {
  stripes: {
    label: 'Stripes',
    icon: '║',
    type: 'simple',
    available: true,
    description: 'Classic stripe patterns'
  },
  camo: {
    label: 'Camo',
    icon: '🎨',
    type: 'complex',
    available: true,
    description: 'Camouflage and tactical patterns'
  },
  tiger: {
    label: 'Tiger',
    icon: '🐅',
    type: 'simple',
    available: false,
    description: 'Tiger stripe patterns (coming soon)'
  },
  leopard: {
    label: 'Leopard',
    icon: '🐆',
    type: 'simple',
    available: false,
    description: 'Leopard spot patterns (coming soon)'
  },
  jaguar: {
    label: 'Jaguar',
    icon: '🐈‍⬛',
    type: 'simple',
    available: false,
    description: 'Jaguar rosette patterns (coming soon)'
  },
  horns: {
    label: 'Horns',
    icon: '🦌',
    type: 'simple',
    available: false,
    description: 'Ram, wolverine, and deer patterns (coming soon)'
  },
  noise: {
    label: 'Noise',
    icon: '⚡',
    type: 'simple',
    available: false,
    description: 'Grunge and texture patterns (coming soon)'
  },
  rusted: {
    label: 'Rusted',
    icon: '🛡️',
    type: 'simple',
    available: false,
    description: 'Weathered and battle-worn patterns (coming soon)'
  },
};

/**
 * Pattern definitions
 * Add new patterns here - they will automatically appear in the UI
 */
export const PATTERNS: Pattern[] = [
  // None (special - no category)
  {
    id: 'none',
    name: 'None',
    category: null,
    thumbnail80: '/patterns/thumbnails/none.png',
    available: true,
    description: 'No pattern overlay'
  },

  // Stripes (simple category - accordion)
  {
    id: 'stripe_single',
    name: 'Single Stripe',
    category: 'stripes',
    thumbnail80: '/patterns/thumbnails/stripe_single.png',
    texturePath: '/patterns/stripe_single.png',
    available: true,
    description: 'Single vertical stripe down the center'
  },
  {
    id: 'stripe_double',
    name: 'Double Stripe',
    category: 'stripes',
    thumbnail80: '/patterns/thumbnails/stripe_double.png',
    texturePath: '/patterns/stripe_double.png',
    available: true,
    description: 'Double vertical stripes with gap'
  },

  // Camo (complex category - drawer)
  {
    id: 'camo',
    name: 'Woodland',
    category: 'camo',
    thumbnail80: '/patterns/thumbnails/camo.png',
    thumbnail120: '/patterns/thumbnails/camo.png', // Will create 120px version
    texturePath: '/patterns/camo.png',
    available: true,
    description: 'Classic woodland camouflage'
  },
  {
    id: 'camo_digital',
    name: 'Digital',
    category: 'camo',
    thumbnail80: '/patterns/thumbnails/camo.png', // Placeholder - will create proper thumbnail
    thumbnail120: '/patterns/thumbnails/camo.png',
    texturePath: '/assets/pattern-textures/pattern-albedo-2k.png',
    available: true,
    description: 'Digital camouflage pattern'
  },
  {
    id: 'camo_carbon',
    name: 'Carbon Fiber',
    category: 'camo',
    thumbnail80: '/patterns/thumbnails/camo.png', // Placeholder - will create proper thumbnail
    thumbnail120: '/patterns/thumbnails/camo.png',
    texturePath: '/assets/pattern-textures/carbon-fiber-matcap-1k.png',
    available: true,
    description: 'Woven carbon fiber texture'
  },

  // Future patterns (placeholders)
  {
    id: 'tiger',
    name: 'Classic Tiger',
    category: 'tiger',
    available: false,
    description: 'Classic tiger stripe pattern'
  },
  {
    id: 'leopard',
    name: 'Leopard Spots',
    category: 'leopard',
    available: false,
    description: 'Classic leopard spot pattern'
  },
  {
    id: 'ram',
    name: 'Ram Horns',
    category: 'horns',
    available: false,
    description: 'Stylized ram horn pattern'
  },
  {
    id: 'wolverine',
    name: 'Wolverine Claws',
    category: 'horns',
    available: false,
    description: 'Wolverine claw marks'
  },
];

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: PatternCategoryKey | null): Pattern[] {
  return PATTERNS.filter(p => p.category === category);
}

/**
 * Get pattern by ID
 */
export function getPattern(id: PatternType): Pattern | undefined {
  return PATTERNS.find(p => p.id === id);
}

/**
 * Get all simple categories (for accordion)
 */
export function getSimpleCategories(): [PatternCategoryKey, PatternCategory][] {
  return Object.entries(PATTERN_CATEGORIES).filter(
    ([_, cat]) => cat.type === 'simple'
  ) as [PatternCategoryKey, PatternCategory][];
}

/**
 * Get all complex categories (for drawer)
 */
export function getComplexCategories(): [PatternCategoryKey, PatternCategory][] {
  return Object.entries(PATTERN_CATEGORIES).filter(
    ([_, cat]) => cat.type === 'complex'
  ) as [PatternCategoryKey, PatternCategory][];
}

/**
 * Centralized Constants for Helmet Customizer
 *
 * This file contains all shared configuration constants, presets, and enums
 * to eliminate duplication across the codebase.
 */

import type { HelmetZone, MaterialFinish } from '@/store/helmetStore';
import type { ConsoleMessage } from '@/app/hooks/useConsoleCapture';

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
// CONSOLE MESSAGE CONFIGURATION
// ============================================================

/**
 * Console message type styling configuration
 * Used by ConsolePanel for consistent message display
 */
export const MESSAGE_TYPE_CONFIG: Record<ConsoleMessage['type'], {
  color: string;
  icon: string;
  borderColor: string;
}> = {
  error: {
    color: 'text-red-400',
    icon: '❌',
    borderColor: 'border-red-500'
  },
  warn: {
    color: 'text-yellow-400',
    icon: '⚠️',
    borderColor: 'border-yellow-500'
  },
  info: {
    color: 'text-blue-400',
    icon: 'ℹ️',
    borderColor: 'border-blue-500'
  },
  log: {
    color: 'text-gray-300',
    icon: '📝',
    borderColor: 'border-gray-600'
  },
};

/**
 * Get message styling by type
 */
export function getMessageConfig(type: ConsoleMessage['type']) {
  return MESSAGE_TYPE_CONFIG[type];
}

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

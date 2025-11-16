import type { HelmetZone } from '@/store/helmetStore';

// Zone display names
export const ZONE_LABELS: Record<HelmetZone, string> = {
  shell: 'Shell',
  facemask: 'Facemask',
  chinstrap: 'Chinstrap',
  padding: 'Padding',
  hardware: 'Hardware',
};

// Zone descriptions
export const ZONE_DESCRIPTIONS: Record<HelmetZone, string> = {
  shell: 'Main helmet shell body',
  facemask: 'Face protection bars',
  chinstrap: 'Chin retention strap',
  padding: 'Interior padding (visible areas)',
  hardware: 'Screws, clips, and fasteners',
};

// Vertex color mappings (from Blender COLOR_0 attribute)
// These colors are used to identify zones in the vertex shader
export const VERTEX_COLOR_MAP: Record<HelmetZone, [number, number, number]> = {
  shell: [0, 0, 0], // Black
  facemask: [1, 0, 0], // Red
  chinstrap: [0, 1, 0], // Green
  padding: [0, 0, 1], // Blue
  hardware: [1, 1, 0], // Yellow
};

// Zone rendering order (for UI display)
export const ZONE_ORDER: HelmetZone[] = [
  'shell',
  'facemask',
  'chinstrap',
  'padding',
  'hardware',
];

// Default helmet model path
export const HELMET_MODEL_PATH = '/models/helmet_for_spline.glb';

// Pattern texture paths
export const PATTERN_TEXTURES = {
  camo: '/patterns/camo_pattern.png',
  tiger_stripe: '/patterns/tiger_stripe.png',
} as const;

// Color tolerance for vertex color matching (shader)
export const VERTEX_COLOR_TOLERANCE = 0.1;

/**
 * 3D Engine Interface Abstraction
 *
 * This interface allows helmet-customizer (Three.js 0.181) and prism (Three.js 0.160)
 * to share business logic without sharing Three.js code, avoiding version conflicts.
 *
 * Each project implements this interface with their specific Three.js version.
 */

/**
 * RGB color representation (0-255 range)
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Color representation with multiple formats
 */
export interface ColorSpec {
  /** Hex color string (e.g., "#FF0000") */
  hex: string;
  /** RGB values (0-255 range) */
  rgb: RGBColor;
  /** Three.js color number (0x000000 format) */
  threeColor: number;
  /** Human-readable name */
  name: string;
}

/**
 * Simple 3D material definition
 * Lightweight material type for basic rendering
 */
export interface Material3D {
  /** Material color (hex string) */
  color: string;
  /** Roughness value (0 = smooth, 1 = rough) */
  roughness: number;
  /** Metalness value (0 = non-metal, 1 = metal) */
  metalness: number;
  /** Emissive color (hex string, optional) */
  emissive?: string;
  /** Emissive intensity (optional) */
  emissiveIntensity?: number;
}

/**
 * Material finish specification
 */
export interface MaterialFinish {
  /** Unique identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Roughness value (0 = smooth, 1 = rough) */
  roughness: number;
  /** Metalness value (0 = non-metal, 1 = metal) */
  metalness: number;
  /** Clearcoat value (0 = none, 1 = full) */
  clearcoat?: number;
  /** Clearcoat roughness */
  clearcoatRoughness?: number;
  /** Emissive intensity */
  emissiveIntensity?: number;
  /** Additional shader parameters */
  shaderParams?: Record<string, number>;
}

/**
 * 3D Object representation (engine-agnostic)
 */
export interface I3DObject {
  /** Unique identifier */
  id: string;
  /** Object name */
  name: string;
  /** Object type */
  type: 'mesh' | 'group' | 'light' | 'camera';
  /** Position [x, y, z] */
  position: [number, number, number];
  /** Rotation [x, y, z] (radians) */
  rotation: [number, number, number];
  /** Scale [x, y, z] */
  scale: [number, number, number];
  /** Is object visible */
  visible: boolean;
  /** Child objects */
  children?: I3DObject[];
}

/**
 * Material configuration (engine-agnostic)
 */
export interface I3DMaterial {
  /** Material name */
  name: string;
  /** Base color */
  color: ColorSpec;
  /** Material finish preset */
  finish: MaterialFinish;
  /** Opacity (0-1) */
  opacity?: number;
  /** Is material transparent */
  transparent?: boolean;
  /** Texture map URLs */
  maps?: {
    diffuse?: string;
    normal?: string;
    roughness?: string;
    metalness?: string;
    ao?: string;
  };
}

/**
 * Render configuration
 */
export interface I3DRenderConfig {
  /** Canvas width */
  width: number;
  /** Canvas height */
  height: number;
  /** Pixel ratio */
  pixelRatio: number;
  /** Anti-aliasing */
  antialias: boolean;
  /** Alpha channel */
  alpha?: boolean;
  /** Background color */
  backgroundColor?: ColorSpec;
}

/**
 * Camera configuration
 */
export interface I3DCameraConfig {
  /** Camera type */
  type: 'perspective' | 'orthographic';
  /** Field of view (perspective only) */
  fov?: number;
  /** Near clipping plane */
  near: number;
  /** Far clipping plane */
  far: number;
  /** Position [x, y, z] */
  position: [number, number, number];
  /** Look at target [x, y, z] */
  target?: [number, number, number];
}

/**
 * Light configuration
 */
export interface I3DLightConfig {
  /** Light type */
  type: 'ambient' | 'directional' | 'point' | 'spot' | 'hemisphere';
  /** Light color */
  color: ColorSpec;
  /** Light intensity */
  intensity: number;
  /** Position [x, y, z] (for directional, point, spot) */
  position?: [number, number, number];
  /** Target position [x, y, z] (for directional, spot) */
  target?: [number, number, number];
}

/**
 * Scene configuration
 */
export interface I3DSceneConfig {
  /** Camera configuration */
  camera: I3DCameraConfig;
  /** Lights configuration */
  lights: I3DLightConfig[];
  /** Background color or environment */
  background?: ColorSpec | string;
  /** Environment map URL */
  environmentMap?: string;
}

/**
 * Main 3D Engine interface
 *
 * Projects implement this interface with their specific Three.js version
 */
export interface I3DEngine {
  /**
   * Initialize the engine with canvas element
   */
  initialize(canvas: HTMLCanvasElement, config: I3DRenderConfig): void;

  /**
   * Load a 3D model from URL
   */
  loadModel(url: string): Promise<I3DObject>;

  /**
   * Apply material to an object
   */
  applyMaterial(objectId: string, material: I3DMaterial): void;

  /**
   * Apply color to an object
   */
  applyColor(objectId: string, color: ColorSpec): void;

  /**
   * Apply material finish to an object
   */
  applyFinish(objectId: string, finish: MaterialFinish): void;

  /**
   * Get object by ID
   */
  getObject(objectId: string): I3DObject | null;

  /**
   * Update object transform
   */
  updateTransform(objectId: string, transform: Partial<I3DObject>): void;

  /**
   * Setup scene (camera, lights, background)
   */
  setupScene(config: I3DSceneConfig): void;

  /**
   * Render the scene
   */
  render(): void;

  /**
   * Resize renderer
   */
  resize(width: number, height: number): void;

  /**
   * Dispose and cleanup resources
   */
  dispose(): void;

  /**
   * Export scene as GLB (Optional - Prism needs this, Helmet doesn't)
   */
  exportGLB?: () => Promise<ArrayBuffer>;

  /**
   * Take screenshot (Optional feature)
   */
  screenshot?: (format?: 'png' | 'jpg') => string;

  /**
   * Raycast to find object at screen coordinates (Optional - Prism needs this, Helmet doesn't)
   * @param x - Screen x coordinate
   * @param y - Screen y coordinate
   * @returns Object ID or null if no object hit
   */
  raycast?: (x: number, y: number) => string | null;
}

/**
 * Factory function type for creating engine instances
 */
export type I3DEngineFactory = () => I3DEngine;

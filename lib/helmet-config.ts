// Helmet Customization System Configuration
// Based on Blender helmet_base_color_system.py and helmet_finish_system.py

export interface FinishPreset {
  name: string;
  label: string;
  metallic: number;
  roughness: number;
  specular: number;
  description: string;
}

export interface PatternOption {
  id: string;
  name: string;
  texturePath: string;
  preview?: string;
}

export interface HelmetCustomization {
  shellColor: string;
  facemaskColor: string;
  shellFinish: string;
  facemaskFinish: string;
  pattern?: string;
  patternOpacity?: number;
  logo?: string;
  number?: string;
  playerName?: string;
}

// Material Finish Presets (from helmet_finish_system.py)
export const FINISH_PRESETS: Record<string, FinishPreset> = {
  glossy_plastic: {
    name: 'glossy_plastic',
    label: 'Glossy Plastic',
    metallic: 0.0,
    roughness: 0.1,
    specular: 0.5,
    description: 'Classic shiny helmet finish'
  },
  matte_plastic: {
    name: 'matte_plastic',
    label: 'Matte Plastic',
    metallic: 0.0,
    roughness: 0.6,
    specular: 0.05,
    description: 'Subtle matte finish with minimal roughness'
  },
  chrome: {
    name: 'chrome',
    label: 'Chrome',
    metallic: 1.0,
    roughness: 0.05,
    specular: 0.5,
    description: 'Mirror-like chrome finish'
  },
  brushed_metal: {
    name: 'brushed_metal',
    label: 'Brushed Metal',
    metallic: 0.9,
    roughness: 0.3,
    specular: 0.5,
    description: 'Brushed aluminum appearance'
  },
  satin: {
    name: 'satin',
    label: 'Satin',
    metallic: 0.1,
    roughness: 0.5,
    specular: 0.13,
    description: 'Smooth satin finish'
  },
  metallic_paint: {
    name: 'metallic_paint',
    label: 'Metallic Paint',
    metallic: 0.30,
    roughness: 0.57,
    specular: 1.0,
    description: 'Car-like metallic paint finish'
  }
};

// Pattern Options
export const PATTERN_OPTIONS: PatternOption[] = [
  {
    id: 'none',
    name: 'No Pattern',
    texturePath: ''
  },
  {
    id: 'camo',
    name: 'Camouflage',
    texturePath: '/patterns/camo_pattern.png'
  },
  {
    id: 'tiger',
    name: 'Tiger Stripe',
    texturePath: '/patterns/tiger_stripe.png'
  }
];

// Default customization
export const DEFAULT_CUSTOMIZATION: HelmetCustomization = {
  shellColor: '#808080', // Medium grey
  facemaskColor: '#808080',
  shellFinish: 'glossy_plastic',
  facemaskFinish: 'glossy_plastic',
  pattern: 'none',
  patternOpacity: 1.0
};

// Helper function to convert hex color to RGB array (0-1 range for Three.js)
export function hexToRGB(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0.5, 0.5, 0.5];

  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ];
}

// Helper function to convert RGB array to hex
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

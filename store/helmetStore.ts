import { create } from 'zustand';
import { FINISH_PRESETS, DEFAULT_HELMET_CONFIG, type FinishProperties } from '@/lib/constants';

// Zone types
export type HelmetZone = 'shell' | 'facemask' | 'chinstrap' | 'padding' | 'hardware';

// Material finish types - Premium finishes
export type MaterialFinish =
  | 'glossy'
  | 'matte'
  | 'chrome'
  | 'brushed'
  | 'satin'
  // Premium automotive finishes
  | 'pearl_coat'
  | 'satin_automotive'
  | 'metallic_flake'
  | 'wet_clearcoat'
  // Metal finishes
  | 'anodized_metal'
  | 'brushed_titanium'
  | 'weathered_metal'
  // Modern/tactical finishes
  | 'carbon_fiber'
  | 'rubberized_softtouch'
  | 'ceramic_gloss'
  // Special effects
  | 'frosted_polycarbonate'
  | 'holographic_foil';

// Pattern types
export type PatternCategory = 'stripes' | 'animals' | 'camo';
export type PatternType =
  // Animals
  | 'tiger' | 'ram' | 'wolverine' | 'leopard' | 'jaguar'
  // Stripes
  | 'stripe_single' | 'stripe_double'
  // Camo
  | 'camo_woodland' | 'camo_digital' | 'camo_urban' | 'camo_desert'
  | 'camo_navy' | 'camo_tiger' | 'camo_multicam' | 'camo_carbon';

export type PatternVariant = string; // e.g., 'tiger_v1', 'tiger_v2', etc.

// Zone configuration
export interface ZoneConfig {
  color: string;
  finish: MaterialFinish;
}

// Complete helmet configuration
export interface HelmetConfig {
  shell: ZoneConfig;
  facemask: ZoneConfig;
  chinstrap: ZoneConfig;
  padding: ZoneConfig;
  hardware: ZoneConfig;
}

// Pattern navigation state
export interface PatternNavigation {
  selectedCategory: PatternCategory | null;
  selectedType: PatternType | null;
  selectedVariant: PatternVariant | null;
}

// Pattern configuration
export interface PatternConfig {
  type: PatternVariant | null; // Final selected pattern ID (e.g., 'tiger_v1', 'camo_woodland')
  color: string; // For SVG overlays only
  intensity: number; // Opacity (0-1)
}

// Store state interface
interface HelmetState {
  // Zone configurations
  config: HelmetConfig;

  // Active zone for UI selection
  activeZone: HelmetZone;

  // Pattern navigation
  patternNav: PatternNavigation;

  // Pattern configuration
  pattern: PatternConfig;

  // UI state
  panelWidth: number;

  // Actions
  setZoneColor: (zone: HelmetZone, color: string) => void;
  setZoneFinish: (zone: HelmetZone, finish: MaterialFinish) => void;
  setActiveZone: (zone: HelmetZone) => void;

  // Pattern actions
  setPatternCategory: (category: PatternCategory | null) => void;
  setPatternType: (type: PatternType | null) => void;
  setPatternVariant: (variant: PatternVariant | null) => void;
  setPatternColor: (color: string) => void;
  setPatternIntensity: (intensity: number) => void;
  clearPattern: () => void;

  setPanelWidth: (width: number) => void;
  resetToDefaults: () => void;
  loadConfig: (config: HelmetConfig) => void;

  // Utility getters
  getZoneConfig: (zone: HelmetZone) => ZoneConfig;
  getFinishProperties: (finish: MaterialFinish) => FinishProperties;
}

// Default zone colors (imported from centralized constants)
const defaultConfig: HelmetConfig = DEFAULT_HELMET_CONFIG;

// Create Zustand store
export const useHelmetStore = create<HelmetState>((set, get) => ({
  // Initial state
  config: defaultConfig,
  activeZone: 'shell',
  patternNav: {
    selectedCategory: null,
    selectedType: null,
    selectedVariant: null,
  },
  pattern: {
    type: null,
    color: '#000000', // Default black for SVG overlays
    intensity: 0.8, // Default 80% opacity
  },
  panelWidth: 384, // 96 * 4 = 384px (w-96 default)

  // Actions
  setZoneColor: (zone, color) => {
    set((state) => {
      const newConfig = {
        ...state.config,
        [zone]: {
          ...state.config[zone],
          color,
        },
      };

      // Auto-sync hardware color with facemask and set to matte
      if (zone === 'facemask') {
        newConfig.hardware = {
          color: color,
          finish: 'matte',
        };
      }

      return { config: newConfig };
    });
  },

  setZoneFinish: (zone, finish) => {
    set((state) => ({
      config: {
        ...state.config,
        [zone]: {
          ...state.config[zone],
          finish,
        },
      },
    }));
  },

  setActiveZone: (zone) => {
    set({ activeZone: zone });
  },

  // Pattern actions
  setPatternCategory: (category) => {
    set((state) => ({
      patternNav: {
        ...state.patternNav,
        selectedCategory: category,
        // Reset type and variant when category changes
        selectedType: null,
        selectedVariant: null,
      },
    }));
  },

  setPatternType: (type) => {
    set((state) => ({
      patternNav: {
        ...state.patternNav,
        selectedType: type,
        // Reset variant when type changes
        selectedVariant: null,
      },
    }));
  },

  setPatternVariant: (variant) => {
    set((state) => ({
      patternNav: {
        ...state.patternNav,
        selectedVariant: variant,
      },
      pattern: {
        ...state.pattern,
        type: variant, // Set final pattern type
      },
    }));
  },

  setPatternColor: (color) => {
    set((state) => ({
      pattern: {
        ...state.pattern,
        color,
      },
    }));
  },

  setPatternIntensity: (intensity) => {
    set((state) => ({
      pattern: {
        ...state.pattern,
        intensity,
      },
    }));
  },

  clearPattern: () => {
    set({
      patternNav: {
        selectedCategory: null,
        selectedType: null,
        selectedVariant: null,
      },
      pattern: {
        type: null,
        color: '#000000',
        intensity: 0.8,
      },
    });
  },

  setPanelWidth: (width) => {
    set({ panelWidth: width });
  },

  resetToDefaults: () => {
    set({
      config: defaultConfig,
      activeZone: 'shell',
      patternNav: {
        selectedCategory: null,
        selectedType: null,
        selectedVariant: null,
      },
      pattern: {
        type: null,
        color: '#000000',
        intensity: 0.8,
      },
    });
  },

  loadConfig: (config) => {
    set({ config });
  },

  // Utility getters
  getZoneConfig: (zone) => {
    return get().config[zone];
  },

  getFinishProperties: (finish) => {
    return FINISH_PRESETS[finish];
  },
}));

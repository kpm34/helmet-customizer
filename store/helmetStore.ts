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
export type PatternType =
  | 'none'
  | 'stripe_single'
  | 'stripe_double'
  | 'camo'
  | 'camo_digital'
  | 'camo_carbon'
  | 'tiger'
  | 'leopard'
  | 'ram'
  | 'wolverine';

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

// Pattern configuration
export interface PatternConfig {
  type: PatternType;
  intensity: number; // 0-1
  applyToZones: HelmetZone[];
}

// Store state interface
interface HelmetState {
  // Zone configurations
  config: HelmetConfig;

  // Active zone for UI selection
  activeZone: HelmetZone;

  // Pattern configuration
  pattern: PatternConfig;

  // UI state
  panelWidth: number;

  // Actions
  setZoneColor: (zone: HelmetZone, color: string) => void;
  setZoneFinish: (zone: HelmetZone, finish: MaterialFinish) => void;
  setActiveZone: (zone: HelmetZone) => void;
  setPattern: (type: PatternType, intensity?: number) => void;
  togglePatternZone: (zone: HelmetZone) => void;
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
  pattern: {
    type: 'none',
    intensity: 0.5,
    applyToZones: [],
  },
  panelWidth: 384, // 96 * 4 = 384px (w-96 default)

  // Actions
  setZoneColor: (zone, color) => {
    set((state) => ({
      config: {
        ...state.config,
        [zone]: {
          ...state.config[zone],
          color,
        },
      },
    }));
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

  setPattern: (type, intensity = 0.5) => {
    set((state) => ({
      pattern: {
        ...state.pattern,
        type,
        intensity,
      },
    }));
  },

  togglePatternZone: (zone) => {
    set((state) => {
      const applyToZones = state.pattern.applyToZones.includes(zone)
        ? state.pattern.applyToZones.filter((z) => z !== zone)
        : [...state.pattern.applyToZones, zone];

      return {
        pattern: {
          ...state.pattern,
          applyToZones,
        },
      };
    });
  },

  setPanelWidth: (width) => {
    set({ panelWidth: width });
  },

  resetToDefaults: () => {
    set({
      config: defaultConfig,
      activeZone: 'shell',
      pattern: {
        type: 'none',
        intensity: 0.5,
        applyToZones: [],
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

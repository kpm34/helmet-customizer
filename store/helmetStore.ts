import { create } from 'zustand';

// Zone types
export type HelmetZone = 'shell' | 'facemask' | 'chinstrap' | 'padding' | 'hardware';

// Material finish types
export type MaterialFinish = 'glossy' | 'matte' | 'chrome' | 'brushed' | 'satin';

// Pattern types
export type PatternType = 'none' | 'camo' | 'tiger_stripe';

// Finish properties (metalness, roughness)
export interface FinishProperties {
  metalness: number;
  roughness: number;
}

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

  // Actions
  setZoneColor: (zone: HelmetZone, color: string) => void;
  setZoneFinish: (zone: HelmetZone, finish: MaterialFinish) => void;
  setActiveZone: (zone: HelmetZone) => void;
  setPattern: (type: PatternType, intensity?: number) => void;
  togglePatternZone: (zone: HelmetZone) => void;
  resetToDefaults: () => void;
  loadConfig: (config: HelmetConfig) => void;

  // Utility getters
  getZoneConfig: (zone: HelmetZone) => ZoneConfig;
  getFinishProperties: (finish: MaterialFinish) => FinishProperties;
}

// Default zone colors (CFB themed)
const defaultConfig: HelmetConfig = {
  shell: {
    color: '#FFFFFF', // White
    finish: 'glossy',
  },
  facemask: {
    color: '#7F7F7F', // Medium gray
    finish: 'brushed',
  },
  chinstrap: {
    color: '#1C1C1C', // Dark gray
    finish: 'matte',
  },
  padding: {
    color: '#333333', // Charcoal
    finish: 'matte',
  },
  hardware: {
    color: '#C0C0C0', // Silver
    finish: 'chrome',
  },
};

// Material finish presets (matching Spline helper)
const finishPresets: Record<MaterialFinish, FinishProperties> = {
  glossy: {
    metalness: 0.0,
    roughness: 0.1,
  },
  matte: {
    metalness: 0.0,
    roughness: 0.8,
  },
  chrome: {
    metalness: 1.0,
    roughness: 0.05,
  },
  brushed: {
    metalness: 0.9,
    roughness: 0.35,
  },
  satin: {
    metalness: 0.1,
    roughness: 0.5,
  },
};

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
    return finishPresets[finish];
  },
}));

// Export types and presets for use in components
export { finishPresets };

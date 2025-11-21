import type { HelmetZone, MaterialFinish, PatternType } from '@/store/helmetStore';

// CFB Team color preset
export interface TeamColorPreset {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  team: string;
}

// CFB Team color presets (popular college teams)
export const CFB_TEAM_PRESETS: TeamColorPreset[] = [
  {
    name: 'Clemson Tigers',
    team: 'clemson',
    primaryColor: '#FF6600', // Orange
    secondaryColor: '#522D80', // Purple
  },
  {
    name: 'Alabama Crimson Tide',
    team: 'alabama',
    primaryColor: '#9E1B32', // Crimson
    secondaryColor: '#FFFFFF', // White
  },
  {
    name: 'Georgia Bulldogs',
    team: 'georgia',
    primaryColor: '#BA0C2F', // Red
    secondaryColor: '#000000', // Black
  },
  {
    name: 'Ohio State Buckeyes',
    team: 'ohio-state',
    primaryColor: '#BB0000', // Scarlet
    secondaryColor: '#666666', // Gray
  },
  {
    name: 'Michigan Wolverines',
    team: 'michigan',
    primaryColor: '#00274C', // Blue
    secondaryColor: '#FFCB05', // Maize
  },
  {
    name: 'LSU Tigers',
    team: 'lsu',
    primaryColor: '#461D7C', // Purple
    secondaryColor: '#FDD023', // Gold
  },
  {
    name: 'Texas Longhorns',
    team: 'texas',
    primaryColor: '#BF5700', // Burnt Orange
    secondaryColor: '#FFFFFF', // White
  },
  {
    name: 'Oregon Ducks',
    team: 'oregon',
    primaryColor: '#154733', // Green
    secondaryColor: '#FEE123', // Yellow
  },
  {
    name: 'USC Trojans',
    team: 'usc',
    primaryColor: '#990000', // Cardinal
    secondaryColor: '#FFCC00', // Gold
  },
  {
    name: 'Notre Dame',
    team: 'notre-dame',
    primaryColor: '#0C2340', // Navy Blue
    secondaryColor: '#C99700', // Gold
  },
  {
    name: 'Pitt Panthers',
    team: 'pitt',
    primaryColor: '#003594', // Royal Blue
    secondaryColor: '#FFB81C', // Pittsburgh Gold
  },
  {
    name: 'Louisville Cardinals',
    team: 'louisville',
    primaryColor: '#AD0000', // Cardinal Red
    secondaryColor: '#000000', // Black
  },
];

// Basic color palette (non-team specific)
export const BASIC_COLOR_PALETTE = [
  '#000000', // Black
  '#808080', // Grey
  '#FFFFFF', // White
  '#FF0000', // Red
  '#FF6600', // Orange
  '#0033A0', // UK Blue (dark blue)
  '#800000', // Maroon
  '#7BAFD4', // Carolina Blue (UNC baby blue)
  '#00FF00', // Green
  '#FF8C00', // Dark Orange
  '#800080', // Purple
  '#FF69B4', // Pink
  '#FFFF00', // Yellow
  '#154733', // Dark Green
];

// Camera preset positions
export interface CameraPreset {
  name: string;
  position: [number, number, number];
  target?: [number, number, number];
}

export const CAMERA_PRESETS: Record<string, CameraPreset> = {
  front: {
    name: 'Front View',
    position: [0, 0, 5],
    target: [0, 0, 0],
  },
  side: {
    name: 'Side View',
    position: [5, 0, 0],
    target: [0, 0, 0],
  },
  back: {
    name: 'Back View',
    position: [0, 0, -5],
    target: [0, 0, 0],
  },
  threeQuarter: {
    name: '3/4 View',
    position: [3, 2, 4],
    target: [0, 0, 0],
  },
  top: {
    name: 'Top View',
    position: [0, 5, 0],
    target: [0, 0, 0],
  },
};

// Export configuration for saving/loading
export interface HelmetExportConfig {
  version: string;
  timestamp: number;
  zones: Record<HelmetZone, { color: string; finish: MaterialFinish }>;
  pattern: {
    type: PatternType;
    intensity: number;
    applyToZones: HelmetZone[];
  };
}

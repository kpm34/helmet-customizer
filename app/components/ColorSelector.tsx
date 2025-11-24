'use client';

import { CFB_TEAM_PRESETS, BASIC_COLOR_PALETTE } from '@/types/helmet';
import { useState, useRef, useEffect } from 'react';
import { Palette, Sparkles } from 'lucide-react';

// Helper functions to convert between hex and HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  showTeamPresets?: boolean;
  showSliders?: boolean;
  onTeamPresetClick?: (preset: { primaryColor: string; secondaryColor: string; team: string }) => void;
}

export function ColorSelector({ value, onChange, label, showTeamPresets = true, showSliders = false, onTeamPresetClick }: ColorPickerProps) {
  const [lastClickedTeam, setLastClickedTeam] = useState<string | null>(null);
  const presetsContainerRef = useRef<HTMLDivElement>(null);

  // Track HSL values from current color
  const hsl = hexToHSL(value);
  const [hue, setHue] = useState(hsl.h);
  const [saturation, setSaturation] = useState(hsl.s);
  const [lightness, setLightness] = useState(hsl.l);

  // Update sliders when value changes externally (e.g., from team presets)
  useEffect(() => {
    const newHsl = hexToHSL(value);
    setHue(newHsl.h);
    setSaturation(newHsl.s);
    setLightness(newHsl.l);
  }, [value]);

  // Update color when sliders change
  const handleSliderChange = (h: number, s: number, l: number) => {
    setHue(h);
    setSaturation(s);
    setLightness(l);
    const newHex = hslToHex(h, s, l);
    onChange(newHex);
  };

  // Allow scrolling in the CFB presets container
  useEffect(() => {
    const container = presetsContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Allow scrolling within this container by stopping propagation
      e.stopPropagation();
    };

    container.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-400" />
          {label}
        </label>
      )}

      {/* Current Color Display - Non-clickable */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-12 h-12 rounded-xl border-2 border-gray-600/50 shadow-lg"
          style={{
            backgroundColor: value,
            boxShadow: `0 0 20px ${value}40, 0 4px 12px rgba(0,0,0,0.3)`
          }}
          title="Current color"
        />
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800/50 backdrop-blur-xl border border-gray-600/50 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          placeholder="#FFFFFF"
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        />
      </div>

      {/* HSL Color Sliders - Only show if enabled */}
      {showSliders && (
        <div className="space-y-2.5 pt-1">
          {/* Hue Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-300">Hue</label>
              <span className="text-xs font-mono text-gray-400">{hue}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => handleSliderChange(parseInt(e.target.value), saturation, lightness)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
              }}
            />
          </div>

          {/* Lightness Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-300">Lightness</label>
              <span className="text-xs font-mono text-gray-400">{lightness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={lightness}
              onChange={(e) => handleSliderChange(hue, saturation, parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #000000, ${hslToHex(hue, saturation, 50)}, #ffffff)`
              }}
            />
          </div>
        </div>
      )}

      {/* Team Color Presets with Modern Design - Only show if enabled */}
      {showTeamPresets && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            CFB Team Presets
          </div>
          <div
            ref={presetsContainerRef}
            className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1 custom-scrollbar"
          >
            {CFB_TEAM_PRESETS.map((preset) => (
              <button
                key={preset.team}
                onClick={() => {
                  if (onTeamPresetClick) {
                    // Custom handler for dual-zone application
                    onTeamPresetClick(preset);
                    setLastClickedTeam(preset.team);
                  } else {
                    // Fallback to single zone
                    onChange(preset.primaryColor);
                  }
                }}
                className="group relative py-2 px-2.5 rounded-xl border-2 border-gray-700/50 hover:border-gray-500/80 transition-all duration-200 hover:scale-105 hover:shadow-xl font-semibold text-[11px] text-center"
                style={{
                  backgroundColor: preset.primaryColor,
                  color: preset.secondaryColor,
                  boxShadow: `0 0 16px ${preset.primaryColor}40, 0 4px 12px rgba(0,0,0,0.3)`,
                  textShadow: `0 1px 3px rgba(0,0,0,0.5), 0 0 8px ${preset.secondaryColor}30`
                }}
                title={`${preset.name} - Click to apply, click again to swap colors`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

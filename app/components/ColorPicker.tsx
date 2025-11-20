'use client';

import { HexColorPicker } from 'react-colorful';
import { CFB_TEAM_PRESETS, BASIC_COLOR_PALETTE } from '@/types/helmet';
import { useState } from 'react';
import { Palette, Pipette, Sparkles } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  onTeamPresetClick?: (preset: { primaryColor: string; secondaryColor: string; team: string }) => void;
}

export function ColorPicker({ value, onChange, label, onTeamPresetClick }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [lastClickedTeam, setLastClickedTeam] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-400" />
          {label}
        </label>
      )}

      {/* Current Color Display with Glassmorphism */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="group relative w-16 h-16 rounded-xl border-2 border-gray-600/50 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          style={{
            backgroundColor: value,
            boxShadow: `0 0 20px ${value}40, 0 4px 12px rgba(0,0,0,0.3)`
          }}
          title="Click to open color picker"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Pipette className="absolute top-1 right-1 w-4 h-4 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 bg-gray-800/50 backdrop-blur-xl border border-gray-600/50 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          placeholder="#FFFFFF"
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        />
      </div>

      {/* Full Color Picker (Expandable) with Glass Effect */}
      {showPicker && (
        <div className="animate-fade-in space-y-4 p-5 bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl">
          <div className="relative">
            <HexColorPicker color={value} onChange={onChange} style={{ width: '100%', height: '200px' }} />
            <div className="absolute top-2 right-2">
              <Sparkles className="w-5 h-5 text-yellow-400/60" />
            </div>
          </div>
          <button
            onClick={() => setShowPicker(false)}
            className="w-full px-4 py-2.5 text-sm text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all duration-200 font-medium"
          >
            Close Picker
          </button>
        </div>
      )}

      {/* Team Color Presets with Modern Design */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          CFB Team Presets
        </div>
        <div className="grid grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
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
              className="group relative py-3 px-3 rounded-xl border-2 border-gray-700/50 hover:border-gray-500/80 transition-all duration-200 hover:scale-105 hover:shadow-xl font-semibold text-xs text-center"
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

      {/* Basic Color Palette with Enhanced Design */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          Basic Colors
        </div>
        <div className="grid grid-cols-8 gap-2">
          {BASIC_COLOR_PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => onChange(color)}
              className={`group relative w-9 h-9 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                value.toUpperCase() === color.toUpperCase()
                  ? 'border-white scale-110 ring-2 ring-blue-400/50'
                  : 'border-gray-600/50 hover:border-gray-400'
              }`}
              style={{
                backgroundColor: color,
                boxShadow: value.toUpperCase() === color.toUpperCase()
                  ? `0 0 16px ${color}60, 0 4px 12px rgba(0,0,0,0.4)`
                  : `0 0 8px ${color}20, 0 2px 6px rgba(0,0,0,0.2)`
              }}
              title={color}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

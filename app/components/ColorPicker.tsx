'use client';

import { HexColorPicker } from 'react-colorful';
import { CFB_TEAM_PRESETS, BASIC_COLOR_PALETTE } from '@/types/helmet';
import { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {/* Current Color Display */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-12 h-12 rounded-lg border-2 border-gray-600 hover:border-gray-400 transition-colors shadow-md"
          style={{ backgroundColor: value }}
          title="Click to open color picker"
        />
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500"
          placeholder="#FF6600"
        />
      </div>

      {/* Full Color Picker (Expandable) */}
      {showPicker && (
        <div className="space-y-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <HexColorPicker color={value} onChange={onChange} />
          <button
            onClick={() => setShowPicker(false)}
            className="w-full px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Close Picker
          </button>
        </div>
      )}

      {/* Team Color Presets */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          CFB Team Presets
        </div>
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {CFB_TEAM_PRESETS.map((preset) => (
            <button
              key={preset.team}
              onClick={() => onChange(preset.primaryColor)}
              className="group relative"
              title={preset.name}
            >
              <div className="flex items-center gap-1 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all">
                {/* Primary color swatch */}
                <div
                  className="w-6 h-6 rounded border border-gray-600"
                  style={{ backgroundColor: preset.primaryColor }}
                />
                {/* Secondary color swatch */}
                <div
                  className="w-6 h-6 rounded border border-gray-600"
                  style={{ backgroundColor: preset.secondaryColor }}
                />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Basic Color Palette */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Basic Colors
        </div>
        <div className="grid grid-cols-8 gap-2">
          {BASIC_COLOR_PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => onChange(color)}
              className={`w-8 h-8 rounded border-2 transition-all ${
                value.toUpperCase() === color.toUpperCase()
                  ? 'border-white scale-110'
                  : 'border-gray-600 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

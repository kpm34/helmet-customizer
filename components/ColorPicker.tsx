'use client';

import { useState } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const DEFAULT_PRESET_COLORS = [
  '#FFFFFF', // White
  '#000000', // Black
  '#FF0000', // Red
  '#0000FF', // Blue
  '#008000', // Green
  '#FFD700', // Gold
  '#C0C0C0', // Silver
  '#800080', // Purple
  '#FFA500', // Orange
  '#00FFFF', // Cyan
  '#FF1493', // Pink
  '#808080', // Grey
];

export default function ColorPicker({
  label,
  value,
  onChange,
  presetColors = DEFAULT_PRESET_COLORS
}: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="flex items-center gap-3">
        {/* Color preview button */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm hover:border-gray-400 transition-colors"
          style={{ backgroundColor: value }}
          title="Click to change color"
        />

        {/* Hex input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="#000000"
          maxLength={7}
        />

        {/* HTML5 color picker */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
          title="Pick custom color"
        />
      </div>

      {/* Preset colors grid */}
      {showPicker && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-600 mb-2">Preset Colors</p>
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChange(color);
                  setShowPicker(false);
                }}
                className={`w-10 h-10 rounded-md border-2 transition-all hover:scale-110 ${
                  value.toLowerCase() === color.toLowerCase()
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

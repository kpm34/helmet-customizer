'use client';

import { useHelmetStore } from '@/store/helmetStore';
import { BASIC_COLOR_PALETTE } from '@/types/helmet';
import { Palette, Trash2 } from 'lucide-react';

export function PatternColorPicker() {
  const { pattern, setPatternColor, clearPattern } = useHelmetStore();

  // Only show for SVG patterns (stripes, animals)
  // Camo patterns override everything, so no color picker
  if (!pattern.type) return null;

  // Check if it's a camo pattern (starts with 'camo_')
  const isCamo = pattern.type.startsWith('camo_');
  if (isCamo) return null;

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          Pattern Color
        </div>
        <button
          onClick={clearPattern}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear Pattern
        </button>
      </div>

      {/* Color palette */}
      <div className="flex flex-wrap gap-2 p-2.5 bg-gray-800/30 rounded-lg border-2 border-gray-700">
        {BASIC_COLOR_PALETTE.map((color) => (
          <button
            key={color}
            onClick={() => setPatternColor(color)}
            className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
              pattern.color.toUpperCase() === color.toUpperCase()
                ? 'border-white scale-110 shadow-lg'
                : 'border-gray-600 hover:border-gray-500 hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            title={`Pattern color: ${color}`}
          />
        ))}
      </div>

      {/* Selected color display */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div
          className="w-6 h-6 rounded border-2 border-gray-600"
          style={{ backgroundColor: pattern.color }}
        />
        <span className="font-mono">{pattern.color.toUpperCase()}</span>
      </div>
    </div>
  );
}

'use client';

import { CFB_TEAM_PRESETS, BASIC_COLOR_PALETTE } from '@/types/helmet';
import { useState, useRef, useEffect } from 'react';
import { Palette, Sparkles } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  showTeamPresets?: boolean;
  onTeamPresetClick?: (preset: { primaryColor: string; secondaryColor: string; team: string }) => void;
}

export function ColorSelector({ value, onChange, label, showTeamPresets = true, onTeamPresetClick }: ColorPickerProps) {
  const [lastClickedTeam, setLastClickedTeam] = useState<string | null>(null);
  const presetsContainerRef = useRef<HTMLDivElement>(null);

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

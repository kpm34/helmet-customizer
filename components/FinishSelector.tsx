'use client';

import { FINISH_PRESETS, FinishPreset } from '@/lib/helmet-config';

interface FinishSelectorProps {
  label: string;
  value: string;
  onChange: (finish: string) => void;
}

export default function FinishSelector({ label, value, onChange }: FinishSelectorProps) {
  const finishes = Object.values(FINISH_PRESETS);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="grid grid-cols-2 gap-3">
        {finishes.map((finish: FinishPreset) => {
          const isSelected = value === finish.name;

          return (
            <button
              key={finish.name}
              onClick={() => onChange(finish.name)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col gap-2">
                {/* Finish name */}
                <div className="font-semibold text-sm">{finish.label}</div>

                {/* Visual preview of finish properties */}
                <div className="flex gap-1">
                  {/* Metallic indicator */}
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Metal</div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gray-400 to-gray-600"
                        style={{ width: `${finish.metallic * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Roughness indicator */}
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Rough</div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                        style={{ width: `${finish.roughness * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 mt-1">
                  {finish.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import type { MaterialFinish } from '@/store/helmetStore';
import { Sparkles, Circle, Chrome, Waves, Palette } from 'lucide-react';

interface FinishSelectorProps {
  value: MaterialFinish;
  onChange: (finish: MaterialFinish) => void;
  label?: string;
}

// Icons for each finish type
const FINISH_ICONS: Record<MaterialFinish, React.ReactNode> = {
  glossy: <Sparkles className="w-5 h-5" />,
  matte: <Circle className="w-5 h-5" />,
  chrome: <Chrome className="w-5 h-5" />,
  brushed: <Waves className="w-5 h-5" />,
  satin: <Palette className="w-5 h-5" />,
};

const FINISH_LABELS: Record<MaterialFinish, string> = {
  glossy: 'Glossy',
  matte: 'Matte',
  chrome: 'Chrome',
  brushed: 'Brushed',
  satin: 'Satin',
};

const FINISH_DESCRIPTIONS: Record<MaterialFinish, string> = {
  glossy: 'Shiny plastic finish',
  matte: 'Non-reflective surface',
  chrome: 'Mirror-like metal',
  brushed: 'Brushed metal texture',
  satin: 'Soft, semi-gloss finish',
};

export function FinishSelector({ value, onChange, label }: FinishSelectorProps) {
  const finishes: MaterialFinish[] = ['glossy', 'matte', 'chrome', 'brushed', 'satin'];

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      <div className="grid grid-cols-2 gap-2">
        {finishes.map((finish) => (
          <button
            key={finish}
            onClick={() => onChange(finish)}
            className={`group relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
              value === finish
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700'
            }`}
          >
            {/* Icon */}
            <div className={`${value === finish ? 'text-blue-400' : 'text-gray-400'}`}>
              {FINISH_ICONS[finish]}
            </div>

            {/* Label */}
            <div className="text-sm font-medium text-white">
              {FINISH_LABELS[finish]}
            </div>

            {/* Description tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {FINISH_DESCRIPTIONS[finish]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

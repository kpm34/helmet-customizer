'use client';

import type { MaterialFinish } from '@/store/helmetStore';
import {
  Sparkles, Circle, Chrome, Waves, Palette,
  Gem, Car, Droplet, Shield, Zap, Layers
} from 'lucide-react';

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
  pearl_coat: <Gem className="w-5 h-5" />,
  satin_automotive: <Car className="w-5 h-5" />,
  metallic_flake: <Sparkles className="w-5 h-5" />,
  wet_clearcoat: <Droplet className="w-5 h-5" />,
  anodized_metal: <Shield className="w-5 h-5" />,
  brushed_titanium: <Waves className="w-5 h-5" />,
  weathered_metal: <Layers className="w-5 h-5" />,
  carbon_fiber: <Layers className="w-5 h-5" />,
  rubberized_softtouch: <Circle className="w-5 h-5" />,
  ceramic_gloss: <Sparkles className="w-5 h-5" />,
  frosted_polycarbonate: <Zap className="w-5 h-5" />,
  holographic_foil: <Gem className="w-5 h-5" />,
};

const FINISH_LABELS: Record<MaterialFinish, string> = {
  glossy: 'Glossy',
  matte: 'Matte',
  chrome: 'Chrome',
  brushed: 'Brushed',
  satin: 'Satin',
  pearl_coat: 'Pearl Coat',
  satin_automotive: 'Satin Auto',
  metallic_flake: 'Metallic Flake',
  wet_clearcoat: 'Wet Clear Coat',
  anodized_metal: 'Anodized Metal',
  brushed_titanium: 'Brushed Titanium',
  weathered_metal: 'Weathered Metal',
  carbon_fiber: 'Carbon Fiber',
  rubberized_softtouch: 'Soft-Touch',
  ceramic_gloss: 'Ceramic Gloss',
  frosted_polycarbonate: 'Frosted',
  holographic_foil: 'Holographic',
};

const FINISH_DESCRIPTIONS: Record<MaterialFinish, string> = {
  glossy: 'Shiny plastic finish',
  matte: 'Non-reflective surface',
  chrome: 'Mirror-like metal',
  brushed: 'Brushed metal texture',
  satin: 'Soft, semi-gloss finish',
  pearl_coat: 'Iridescent car-paint style',
  satin_automotive: 'Premium wrap finish',
  metallic_flake: 'Sparkle with reflective flakes',
  wet_clearcoat: 'Freshly waxed look',
  anodized_metal: 'Colored engineered metal',
  brushed_titanium: 'Industrial elite vibe',
  weathered_metal: 'Patina finish',
  carbon_fiber: 'High-tech woven pattern',
  rubberized_softtouch: 'Tactical stealth look',
  ceramic_gloss: 'Ultra-premium clean',
  frosted_polycarbonate: 'Translucent futuristic',
  holographic_foil: 'Color-shifting refractive',
};

export function MaterialFinishSelector({ value, onChange, label }: FinishSelectorProps) {
  const finishes: MaterialFinish[] = ['glossy', 'matte', 'brushed', 'satin'];

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

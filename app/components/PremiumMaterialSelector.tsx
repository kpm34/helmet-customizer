'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MaterialFinish } from '@/store/helmetStore';
import { ChevronDown, Sparkles, Zap, Shield, Chrome } from 'lucide-react';

interface PremiumMaterialSelectorProps {
  selectedFinish: MaterialFinish;
  selectedColor: string;
  onFinishSelect: (finish: MaterialFinish) => void;
  onColorSelect: (color: string) => void;
}

// Preview colors matching render script
const PREVIEW_COLORS = [
  { hex: '#FF0000', name: 'red', label: 'Red' },
  { hex: '#0000FF', name: 'blue', label: 'Blue' },
  { hex: '#FFD700', name: 'gold', label: 'Gold' },
  { hex: '#00FF00', name: 'green', label: 'Green' },
  { hex: '#FFFFFF', name: 'white', label: 'White' },
  { hex: '#000000', name: 'black', label: 'Black' },
  { hex: '#FF6B35', name: 'orange', label: 'Orange' },
  { hex: '#8B00FF', name: 'purple', label: 'Purple' },
  { hex: '#00CED1', name: 'cyan', label: 'Cyan' },
];

// Categorized finish data
const FINISH_CATEGORIES = {
  basic: {
    label: 'Basic Finishes',
    icon: <Sparkles className="w-4 h-4" />,
    finishes: [
      {
        id: 'glossy' as MaterialFinish,
        name: 'Glossy',
        description: 'Classic high-gloss plastic',
      },
      {
        id: 'matte' as MaterialFinish,
        name: 'Matte',
        description: 'Non-reflective flat surface',
      },
    ],
  },
  automotive: {
    label: 'Automotive Premium',
    icon: <Zap className="w-4 h-4" />,
    finishes: [
      {
        id: 'pearl_coat' as MaterialFinish,
        name: 'Pearl Coat',
        description: 'Iridescent car-paint style',
        featured: true,
      },
      {
        id: 'satin_automotive' as MaterialFinish,
        name: 'Satin Auto',
        description: 'Premium wrap finish',
        featured: true,
      },
      {
        id: 'metallic_flake' as MaterialFinish,
        name: 'Metallic Flake',
        description: 'Sparkle with reflective flakes',
        featured: true,
      },
      {
        id: 'wet_clearcoat' as MaterialFinish,
        name: 'Wet Clear Coat',
        description: 'Freshly waxed look',
      },
    ],
  },
  metal: {
    label: 'Metal Finishes',
    icon: <Chrome className="w-4 h-4" />,
    finishes: [
      {
        id: 'chrome' as MaterialFinish,
        name: 'Chrome',
        description: 'Mirror-like polish',
      },
      {
        id: 'anodized_metal' as MaterialFinish,
        name: 'Anodized',
        description: 'Colored engineered metal',
        featured: true,
      },
      {
        id: 'brushed_titanium' as MaterialFinish,
        name: 'Brushed Titanium',
        description: 'Industrial elite vibe',
        featured: true,
      },
      {
        id: 'weathered_metal' as MaterialFinish,
        name: 'Weathered',
        description: 'Patina finish',
      },
    ],
  },
  modern: {
    label: 'Modern & Tactical',
    icon: <Shield className="w-4 h-4" />,
    finishes: [
      {
        id: 'carbon_fiber' as MaterialFinish,
        name: 'Carbon Fiber',
        description: 'High-tech woven pattern',
        featured: true,
      },
      {
        id: 'rubberized_softtouch' as MaterialFinish,
        name: 'Soft-Touch',
        description: 'Tactical stealth look',
      },
      {
        id: 'ceramic_gloss' as MaterialFinish,
        name: 'Ceramic Gloss',
        description: 'Ultra-premium clean',
        featured: true,
      },
    ],
  },
  special: {
    label: 'Special Effects',
    icon: <Sparkles className="w-4 h-4" />,
    finishes: [
      {
        id: 'frosted_polycarbonate' as MaterialFinish,
        name: 'Frosted',
        description: 'Translucent futuristic',
      },
      {
        id: 'holographic_foil' as MaterialFinish,
        name: 'Holographic',
        description: 'Color-shifting refractive',
        featured: true,
      },
    ],
  },
};

export function PremiumMaterialSelector({
  selectedFinish,
  selectedColor,
  onFinishSelect,
  onColorSelect,
}: PremiumMaterialSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string>('automotive');
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  const currentColorName = PREVIEW_COLORS.find((c) => c.hex === selectedColor)?.name || 'gold';

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? '' : category);
  };

  return (
    <div className="space-y-4">
      {/* Color Selection */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Preview Color
        </h3>
        <div className="flex flex-wrap gap-2">
          {PREVIEW_COLORS.map((color) => (
            <button
              key={color.hex}
              onClick={() => onColorSelect(color.hex)}
              className={`group relative w-10 h-10 rounded-lg border-2 transition-all ${
                selectedColor === color.hex
                  ? 'border-blue-500 shadow-lg shadow-blue-500/30 scale-110'
                  : 'border-gray-700 hover:border-gray-500 hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.label}
            >
              {selectedColor === color.hex && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Finish Categories */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Material Finish
        </h3>

        {Object.entries(FINISH_CATEGORIES).map(([categoryKey, category]) => {
          const isExpanded = expandedCategory === categoryKey;

          return (
            <div key={categoryKey} className="border border-gray-800 rounded-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(categoryKey)}
                className="w-full flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="text-blue-400">{category.icon}</div>
                  <span className="text-sm font-medium text-gray-200">{category.label}</span>
                  <span className="text-xs text-gray-500">
                    ({category.finishes.length})
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Category Content */}
              {isExpanded && (
                <div className="p-3 grid grid-cols-2 gap-2 bg-gray-900/30">
                  {category.finishes.map((finish) => {
                    const previewPath = `/material-previews/${finish.id}_${currentColorName}.png`;
                    const isSelected = selectedFinish === finish.id;

                    return (
                      <button
                        key={finish.id}
                        onClick={() => onFinishSelect(finish.id)}
                        className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {/* Featured badge */}
                        {finish.featured && (
                          <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded text-[10px] font-bold text-white shadow-lg">
                            PRO
                          </div>
                        )}

                        {/* Preview Image */}
                        <div className="aspect-square relative bg-gradient-to-br from-gray-800 to-gray-900">
                          <Image
                            src={previewPath}
                            alt={`${finish.name} preview`}
                            fill
                            className={`object-contain p-3 transition-opacity ${
                              imageLoaded[previewPath] ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() =>
                              setImageLoaded((prev) => ({ ...prev, [previewPath]: true }))
                            }
                            unoptimized
                          />

                          {/* Loading spinner */}
                          {!imageLoaded[previewPath] && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
                            </div>
                          )}

                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Label */}
                        <div className="p-2 bg-gray-800/90 backdrop-blur">
                          <div className="text-xs font-medium text-white truncate">
                            {finish.name}
                          </div>
                          <div className="text-[10px] text-gray-400 truncate">
                            {finish.description}
                          </div>
                        </div>

                        {/* Hover overlay */}
                        {!isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent transition-all pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Selection Summary */}
      <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg border-2 border-gray-600 flex-shrink-0"
            style={{ backgroundColor: selectedColor }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {Object.values(FINISH_CATEGORIES)
                .flatMap((cat) => cat.finishes)
                .find((f) => f.id === selectedFinish)?.name || 'Unknown'}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {PREVIEW_COLORS.find((c) => c.hex === selectedColor)?.label} •{' '}
              {Object.values(FINISH_CATEGORIES)
                .flatMap((cat) => cat.finishes)
                .find((f) => f.id === selectedFinish)?.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

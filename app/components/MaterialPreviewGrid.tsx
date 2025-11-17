'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { MaterialFinish } from '@/store/helmetStore';

interface MaterialPreviewGridProps {
  selectedFinish: MaterialFinish;
  selectedColor: string;
  onFinishSelect: (finish: MaterialFinish) => void;
  onColorSelect: (color: string) => void;
}

// Material preview colors (matching render script)
const PREVIEW_COLORS = [
  { hex: '#FF0000', name: 'red', label: 'Red' },
  { hex: '#0000FF', name: 'blue', label: 'Blue' },
  { hex: '#FFD700', name: 'gold', label: 'Gold' },
  { hex: '#00FF00', name: 'green', label: 'Green' },
  { hex: '#FFFFFF', name: 'white', label: 'White' },
  { hex: '#000000', name: 'black', label: 'Black' },
];

const FINISH_DATA: Record<MaterialFinish, { label: string; description: string }> = {
  glossy: { label: 'Glossy', description: 'Shiny plastic finish with clear reflections' },
  matte: { label: 'Matte', description: 'Non-reflective, flat surface' },
  chrome: { label: 'Chrome', description: 'Mirror-like polished metal' },
  brushed: { label: 'Brushed', description: 'Brushed metal texture' },
  satin: { label: 'Satin', description: 'Soft, semi-gloss finish' },
  pearl_coat: { label: 'Pearl Coat', description: 'Iridescent car-paint style' },
  satin_automotive: { label: 'Satin Auto', description: 'Premium wrap finish' },
  metallic_flake: { label: 'Metallic Flake', description: 'Sparkle with reflective flakes' },
  wet_clearcoat: { label: 'Wet Clear Coat', description: 'Freshly waxed look' },
  anodized_metal: { label: 'Anodized Metal', description: 'Colored engineered metal' },
  brushed_titanium: { label: 'Brushed Titanium', description: 'Industrial elite vibe' },
  weathered_metal: { label: 'Weathered Metal', description: 'Patina finish' },
  carbon_fiber: { label: 'Carbon Fiber', description: 'High-tech woven pattern' },
  rubberized_softtouch: { label: 'Soft-Touch', description: 'Tactical stealth look' },
  ceramic_gloss: { label: 'Ceramic Gloss', description: 'Ultra-premium clean' },
  frosted_polycarbonate: { label: 'Frosted', description: 'Translucent futuristic' },
  holographic_foil: { label: 'Holographic', description: 'Color-shifting refractive' },
};

export function MaterialPreviewGrid({
  selectedFinish,
  selectedColor,
  onFinishSelect,
  onColorSelect,
}: MaterialPreviewGridProps) {
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const [manifest, setManifest] = useState<any>(null);

  // Load manifest
  useEffect(() => {
    fetch('/material-previews/manifest.json')
      .then((res) => res.json())
      .then((data) => setManifest(data))
      .catch((err) => console.error('Failed to load material preview manifest:', err));
  }, []);

  // Get current color name from hex
  const currentColorName = PREVIEW_COLORS.find((c) => c.hex === selectedColor)?.name || 'red';

  const finishes: MaterialFinish[] = ['glossy', 'matte', 'chrome', 'brushed'];

  return (
    <div className="space-y-6">
      {/* Finish Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-300">Material Finish</h3>

        <div className="grid grid-cols-2 gap-3">
          {finishes.map((finish) => {
            const previewPath = `/material-previews/${finish}_${currentColorName}.png`;
            const isSelected = selectedFinish === finish;
            const data = FINISH_DATA[finish];

            return (
              <button
                key={finish}
                onClick={() => onFinishSelect(finish)}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                {/* Preview Image */}
                <div className="aspect-square relative bg-gradient-to-br from-gray-800 to-gray-900">
                  <Image
                    src={previewPath}
                    alt={`${data.label} finish preview`}
                    fill
                    className={`object-contain p-4 transition-opacity ${
                      imageLoaded[previewPath] ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() =>
                      setImageLoaded((prev) => ({ ...prev, [previewPath]: true }))
                    }
                    unoptimized
                  />

                  {/* Loading state */}
                  {!imageLoaded[previewPath] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
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
                <div className="p-3 bg-gray-800/80 backdrop-blur">
                  <div className="text-sm font-medium text-white">{data.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{data.description}</div>
                </div>

                {/* Hover overlay */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity ${
                    isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-300">Preview Color</h3>

        <div className="flex flex-wrap gap-2">
          {PREVIEW_COLORS.map((color) => {
            const isSelected = selectedColor === color.hex;

            return (
              <button
                key={color.hex}
                onClick={() => onColorSelect(color.hex)}
                className={`group relative w-12 h-12 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-110'
                    : 'border-gray-700 hover:border-gray-600 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white/90 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-blue-600"
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

                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {color.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Selection Info */}
      {manifest && (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border-2 border-gray-600"
              style={{ backgroundColor: selectedColor }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">
                {FINISH_DATA[selectedFinish]?.label} Finish
              </div>
              <div className="text-xs text-gray-400">
                {PREVIEW_COLORS.find((c) => c.hex === selectedColor)?.label} color
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {manifest.renderSettings.samples} samples
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

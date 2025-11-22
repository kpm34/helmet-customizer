'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useHelmetStore, type PatternType } from '@/store/helmetStore';

export interface Pattern {
  id: PatternType;
  name: string;
  thumbnail: string;
  available: boolean;
  description?: string;
}

// Pattern definitions
export const AVAILABLE_PATTERNS: Pattern[] = [
  {
    id: 'none',
    name: 'No Pattern',
    thumbnail: '/patterns/thumbnails/none.png', // Will create a placeholder
    available: true,
    description: 'Solid color, no pattern overlay',
  },
  {
    id: 'stripe_single',
    name: 'Single Stripe',
    thumbnail: '/patterns/thumbnails/stripe_single.png',
    available: true,
    description: 'Single vertical stripe down the middle',
  },
  {
    id: 'stripe_double',
    name: 'Double Stripe',
    thumbnail: '/patterns/thumbnails/stripe_double.png',
    available: true,
    description: 'Two vertical stripes with gap',
  },
  {
    id: 'camo',
    name: 'Camo',
    thumbnail: '/patterns/thumbnails/camo.png',
    available: true,
    description: 'Camouflage pattern overlay',
  },
  {
    id: 'tiger',
    name: 'Tiger',
    thumbnail: '/patterns/thumbnails/tiger.png',
    available: false,
    description: 'Tiger stripe pattern (coming soon)',
  },
  {
    id: 'leopard',
    name: 'Leopard',
    thumbnail: '/patterns/thumbnails/leopard.png',
    available: false,
    description: 'Leopard spot pattern (coming soon)',
  },
  {
    id: 'ram',
    name: 'Ram',
    thumbnail: '/patterns/thumbnails/ram.png',
    available: false,
    description: 'Ram horns pattern (coming soon)',
  },
  {
    id: 'wolverine',
    name: 'Wolverine',
    thumbnail: '/patterns/thumbnails/wolverine.png',
    available: false,
    description: 'Wolverine claws pattern (coming soon)',
  },
];

export default function PatternSelector() {
  const { pattern, setPattern } = useHelmetStore();
  const [hoveredPattern, setHoveredPattern] = useState<string | null>(null);

  const handlePatternSelect = (patternId: PatternType) => {
    if (AVAILABLE_PATTERNS.find((p) => p.id === patternId)?.available) {
      setPattern(patternId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Pattern Grid */}
      <div className="grid grid-cols-2 gap-3">
        {AVAILABLE_PATTERNS.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePatternSelect(p.id)}
            onMouseEnter={() => setHoveredPattern(p.id)}
            onMouseLeave={() => setHoveredPattern(null)}
            disabled={!p.available}
            className={`
              relative p-3 rounded-lg transition-all duration-200
              ${
                pattern.type === p.id
                  ? 'bg-blue-500/30 border-2 border-blue-400'
                  : 'bg-gray-800/50 border-2 border-gray-700/50'
              }
              ${
                p.available
                  ? 'hover:border-blue-400/50 hover:bg-gray-700/50 cursor-pointer'
                  : 'opacity-40 cursor-not-allowed'
              }
            `}
          >
            {/* Pattern Thumbnail */}
            <div className="aspect-square bg-gray-900/50 rounded-md overflow-hidden mb-2 relative">
              {p.id === 'none' ? (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              ) : (
                <Image
                  src={p.thumbnail}
                  alt={p.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}

              {/* Coming Soon Badge */}
              {!p.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="text-xs font-semibold text-gray-300 px-2 py-1 bg-gray-800 rounded">
                    Soon
                  </span>
                </div>
              )}

              {/* Selected Indicator */}
              {pattern.type === p.id && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Pattern Name */}
            <div className="text-sm font-medium text-gray-200">{p.name}</div>

            {/* Description on Hover */}
            {hoveredPattern === p.id && p.description && (
              <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-gray-900 rounded-md shadow-lg text-xs text-gray-300 z-10">
                {p.description}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Pattern Intensity Slider (only show when pattern is selected) */}
      {pattern.type !== 'none' && (
        <div className="pt-2 border-t border-gray-700/50">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Pattern Intensity
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={pattern.intensity * 100}
            onChange={(e) => {
              const intensity = parseInt(e.target.value) / 100;
              setPattern(pattern.type, intensity);
            }}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Subtle</span>
            <span>{Math.round(pattern.intensity * 100)}%</span>
            <span>Bold</span>
          </div>
        </div>
      )}

      {/* Info Text */}
      <div className="text-xs text-gray-500 text-center pt-2">
        {pattern.type === 'none'
          ? 'Select a pattern overlay to customize your helmet'
          : `${AVAILABLE_PATTERNS.find(p => p.id === pattern.type)?.name} pattern applied`
        }
      </div>
    </div>
  );
}

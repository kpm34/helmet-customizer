'use client';

import { useHelmetStore } from '@/store/helmetStore';
import { getPatternTypesByCategory, PATTERN_TYPES } from '@/lib/constants';
import type { PatternType } from '@/store/helmetStore';

export function PatternTypeSelector() {
  const { patternNav, setPatternType, setPatternVariant } = useHelmetStore();

  if (!patternNav.selectedCategory) return null;

  const patternTypes = getPatternTypesByCategory(patternNav.selectedCategory);

  const handleTypeClick = (typeId: PatternType) => {
    const typeConfig = PATTERN_TYPES[typeId];

    setPatternType(typeId);

    // If no variants (like stripes/camo), directly apply the pattern
    if (!typeConfig.hasVariants) {
      setPatternVariant(typeId); // Use type ID as variant ID for direct apply
    }
  };

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
        Select Pattern
      </div>

      <div className="grid grid-cols-3 gap-3">
        {patternTypes.map((typeConfig) => {
          const isSelected = patternNav.selectedType === typeConfig.id;
          const isApplied = patternNav.selectedVariant === typeConfig.id;

          return (
            <button
              key={typeConfig.id}
              onClick={() => handleTypeClick(typeConfig.id)}
              className={`relative flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-200 ${
                isApplied
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : isSelected
                  ? 'bg-blue-500/20 border-2 border-blue-500'
                  : 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              {/* Circular thumbnail */}
              <div
                className={`w-16 h-16 rounded-full bg-gray-700 border-2 overflow-hidden ${
                  isApplied
                    ? 'border-green-400'
                    : isSelected
                    ? 'border-blue-400'
                    : 'border-gray-600'
                }`}
              >
                <img
                  src={typeConfig.thumbnail}
                  alt={typeConfig.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium text-center ${
                  isApplied
                    ? 'text-green-300'
                    : isSelected
                    ? 'text-blue-300'
                    : 'text-gray-400'
                }`}
              >
                {typeConfig.label}
              </span>

              {/* Applied checkmark */}
              {isApplied && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

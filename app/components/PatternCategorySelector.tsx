'use client';

import { useHelmetStore } from '@/store/helmetStore';
import { PATTERN_CATEGORIES } from '@/lib/constants';
import type { PatternCategory } from '@/store/helmetStore';

export function PatternCategorySelector() {
  const { patternNav, setPatternCategory } = useHelmetStore();

  const categories: PatternCategory[] = ['stripes', 'animals', 'camo'];

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
        Select Pattern Category
      </div>

      <div className="flex gap-3 justify-center">
        {categories.map((categoryId) => {
          const category = PATTERN_CATEGORIES[categoryId];
          const isSelected = patternNav.selectedCategory === categoryId;
          const isDisabled = categoryId !== 'stripes'; // Only stripes enabled for now

          return (
            <button
              key={categoryId}
              onClick={() => !isDisabled && setPatternCategory(categoryId)}
              disabled={isDisabled}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                isDisabled
                  ? 'opacity-40 cursor-not-allowed'
                  : isSelected
                  ? 'bg-blue-500/20 border-2 border-blue-500'
                  : 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
              title={isDisabled ? 'Coming soon' : category.description}
            >
              {/* Circular thumbnail */}
              <div className="w-20 h-20">
                <img
                  src={category.thumbnail}
                  alt={category.label}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium ${
                  isSelected ? 'text-blue-300' : 'text-gray-400'
                }`}
              >
                {category.label}
              </span>

              {/* Coming Soon badge */}
              {isDisabled && (
                <div className="absolute -top-2 -right-2 bg-gray-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                  Soon
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

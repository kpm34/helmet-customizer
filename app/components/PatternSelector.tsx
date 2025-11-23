'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useHelmetStore, type PatternType } from '@/store/helmetStore';
import { CircularPatternThumbnail } from './CircularPatternThumbnail';
import { PatternAccordionSection } from './PatternAccordionSection';
import { PatternDrawer } from './PatternDrawer';
import {
  PATTERNS,
  PATTERN_CATEGORIES,
  getPatternsByCategory,
  getSimpleCategories,
  getComplexCategories,
  type PatternCategoryKey,
} from '@/lib/constants';

export default function PatternSelector() {
  const { pattern, setPattern } = useHelmetStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCategory, setDrawerCategory] = useState<PatternCategoryKey | null>(null);

  const handlePatternSelect = (patternId: PatternType) => {
    setPattern(patternId);
  };

  const openDrawer = (category: PatternCategoryKey) => {
    setDrawerCategory(category);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    // Delay clearing category to allow animation to complete
    setTimeout(() => setDrawerCategory(null), 300);
  };

  // Get the "None" pattern
  const nonePattern = PATTERNS.find(p => p.id === 'none');

  // Get simple and complex categories
  const simpleCategories = getSimpleCategories();
  const complexCategories = getComplexCategories();

  return (
    <div className="space-y-2">
      {/* None option (special, always visible) */}
      {nonePattern && (
        <div className="p-4 bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700/50">
          <CircularPatternThumbnail
            pattern={nonePattern}
            size="small"
            selected={pattern.type === 'none'}
            onClick={() => handlePatternSelect('none')}
          />
        </div>
      )}

      {/* Simple categories (accordion sections) */}
      <div className="rounded-xl overflow-hidden border border-gray-700/50">
        {simpleCategories.map(([key, category]) => (
          <PatternAccordionSection
            key={key}
            categoryKey={key}
            category={category}
            patterns={getPatternsByCategory(key)}
            selectedPattern={pattern.type}
            onSelectPattern={handlePatternSelect}
            defaultOpen={key === 'stripes'} // Stripes open by default
          />
        ))}
      </div>

      {/* Complex categories (drawer triggers) */}
      {complexCategories
        .filter(([_, cat]) => cat.available)
        .map(([key, category]) => {
          const categoryPatterns = getPatternsByCategory(key);
          return (
            <button
              key={key}
              onClick={() => openDrawer(key)}
              className="
                w-full p-4
                bg-gray-800/60 hover:bg-gray-700/60
                backdrop-blur-lg rounded-xl
                border border-gray-700/50
                transition-all duration-200
                hover:border-blue-400/50
              "
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold text-white">{category.label}</div>
                    <div className="text-xs text-gray-400">{category.description}</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded font-medium">
                    {categoryPatterns.length} options
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>
            </button>
          );
        })}

      {/* Pattern Intensity Slider (only show when pattern is selected) */}
      {pattern.type !== 'none' && (
        <div className="p-4 bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700/50">
          <label className="block text-sm font-medium text-gray-300 mb-3">
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
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-blue-500
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:shadow-blue-500/50"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Subtle</span>
            <span className="text-blue-400 font-medium">{Math.round(pattern.intensity * 100)}%</span>
            <span>Bold</span>
          </div>
        </div>
      )}

      {/* Info Text */}
      <div className="text-xs text-gray-500 text-center py-2">
        {pattern.type === 'none'
          ? 'Select a pattern overlay to customize your helmet'
          : `${PATTERNS.find((p) => p.id === pattern.type)?.name} pattern applied`}
      </div>

      {/* Pattern Drawer */}
      <PatternDrawer
        isOpen={drawerOpen}
        categoryKey={drawerCategory}
        patterns={drawerCategory ? getPatternsByCategory(drawerCategory) : []}
        selectedPattern={pattern.type}
        onSelectPattern={handlePatternSelect}
        onClose={closeDrawer}
      />
    </div>
  );
}

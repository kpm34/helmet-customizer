'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CircularPatternThumbnail } from './CircularPatternThumbnail';
import type { Pattern, PatternCategory, PatternCategoryKey } from '@/lib/constants';
import type { PatternType } from '@/store/helmetStore';

interface PatternAccordionSectionProps {
  categoryKey: PatternCategoryKey;
  category: PatternCategory;
  patterns: Pattern[];
  selectedPattern: PatternType;
  onSelectPattern: (id: PatternType) => void;
  defaultOpen?: boolean;
}

export function PatternAccordionSection({
  categoryKey,
  category,
  patterns,
  selectedPattern,
  onSelectPattern,
  defaultOpen = false,
}: PatternAccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    if (category.available) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="border-b border-gray-700/50">
      {/* Header */}
      <button
        onClick={toggleOpen}
        disabled={!category.available}
        className={`
          w-full flex items-center justify-between p-4
          transition-colors duration-200
          ${
            category.available
              ? 'hover:bg-gray-700/60 cursor-pointer'
              : 'cursor-not-allowed opacity-60'
          }
          ${isOpen && category.available ? 'bg-gray-800/60' : 'bg-gray-800/40'}
        `}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <span className="text-2xl">{category.icon}</span>

          {/* Label */}
          <span className="font-semibold text-white">{category.label}</span>

          {/* Pattern count badge */}
          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded font-medium">
            {patterns.length}
          </span>

          {/* Coming Soon badge */}
          {!category.available && (
            <span className="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded font-medium">
              Coming Soon
            </span>
          )}
        </div>

        {/* Chevron */}
        {category.available && (
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </button>

      {/* Expandable content */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-96' : 'max-h-0'}
        `}
      >
        <div className="p-4 bg-gray-900/20">
          {/* Pattern grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {patterns.map((pattern) => (
              <CircularPatternThumbnail
                key={pattern.id}
                pattern={pattern}
                size="small"
                selected={selectedPattern === pattern.id}
                onClick={() => onSelectPattern(pattern.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { CircularPatternThumbnail } from './CircularPatternThumbnail';
import type { Pattern, PatternCategory, PatternCategoryKey } from '@/lib/constants';
import type { PatternType } from '@/store/helmetStore';
import { PATTERN_CATEGORIES } from '@/lib/constants';

interface PatternDrawerProps {
  isOpen: boolean;
  categoryKey: PatternCategoryKey | null;
  patterns: Pattern[];
  selectedPattern: PatternType;
  onSelectPattern: (id: PatternType) => void;
  onClose: () => void;
}

export function PatternDrawer({
  isOpen,
  categoryKey,
  patterns,
  selectedPattern,
  onSelectPattern,
  onClose,
}: PatternDrawerProps) {
  const category = categoryKey ? PATTERN_CATEGORIES[categoryKey] : null;

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = () => {
    onClose();
  };

  // Handle pattern selection and close drawer
  const handleSelectPattern = (id: PatternType) => {
    onSelectPattern(id);
    onClose();
  };

  if (!category) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={handleBackdropClick}
      />

      {/* Drawer */}
      <div
        className={`
          fixed right-0 top-0 h-full w-full md:w-[480px]
          bg-gray-900/95 backdrop-blur-2xl border-l border-gray-700
          z-50 transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-900/60">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{category.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{category.label}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{category.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
          </button>
        </div>

        {/* Pattern grid */}
        <div className="p-6 overflow-y-auto h-[calc(100%-88px)]">
          {patterns.length > 0 ? (
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
              {patterns.map((pattern) => (
                <CircularPatternThumbnail
                  key={pattern.id}
                  pattern={pattern}
                  size="large"
                  selected={selectedPattern === pattern.id}
                  onClick={() => handleSelectPattern(pattern.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="text-4xl mb-4 block">{category.icon}</span>
                <p className="text-gray-400">No patterns available yet</p>
                <p className="text-sm text-gray-500 mt-2">Check back soon for new patterns</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Finish Selector Component
 *
 * UI component for selecting material finishes for helmet customization.
 * Uses @blender-workspace/shared-3d material finishes.
 */

'use client';

import { useState, useEffect } from 'react';
import type { Application as SplineApp } from '@splinetool/runtime';
import {
  MaterialFinish,
  MATERIAL_FINISHES,
  GLOSSY,
  MATTE,
  CHROME,
  BRUSHED_METAL,
  SATIN,
  METALLIC_PAINT
} from '@blender-workspace/shared-3d';
import { applyFinishToHelmet } from '@/lib/spline/finishApplicator';

interface FinishSelectorProps {
  splineApp: SplineApp | null;
  onFinishChange?: (finish: MaterialFinish) => void;
  defaultFinish?: MaterialFinish;
  className?: string;
}

const HELMET_FINISHES = [
  GLOSSY,
  MATTE,
  CHROME,
  BRUSHED_METAL,
  SATIN,
  METALLIC_PAINT
];

export function FinishSelector({
  splineApp,
  onFinishChange,
  defaultFinish = GLOSSY,
  className = ''
}: FinishSelectorProps) {
  const [selectedFinish, setSelectedFinish] = useState<MaterialFinish>(defaultFinish);
  const [isApplying, setIsApplying] = useState(false);

  // Apply finish when selection changes
  useEffect(() => {
    if (splineApp && selectedFinish) {
      setIsApplying(true);
      try {
        applyFinishToHelmet(splineApp, selectedFinish);
        onFinishChange?.(selectedFinish);
      } catch (error) {
        console.error('Error applying finish:', error);
      } finally {
        setIsApplying(false);
      }
    }
  }, [splineApp, selectedFinish, onFinishChange]);

  const handleFinishSelect = (finish: MaterialFinish) => {
    setSelectedFinish(finish);
  };

  return (
    <div className={`finish-selector ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Material Finish</h3>

      <div className="grid grid-cols-2 gap-3">
        {HELMET_FINISHES.map((finish) => (
          <button
            key={finish.id}
            onClick={() => handleFinishSelect(finish)}
            disabled={isApplying}
            className={`
              relative p-4 rounded-lg border-2 transition-all
              ${selectedFinish.id === finish.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
              ${isApplying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Finish Name */}
            <div className="font-medium text-sm mb-2">{finish.name}</div>

            {/* Visual Indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span>Roughness</span>
                  <span className="font-mono">{finish.roughness.toFixed(1)}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${finish.roughness * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span>Metalness</span>
                  <span className="font-mono">{finish.metalness.toFixed(1)}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all"
                    style={{ width: `${finish.metalness * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Selected Indicator */}
            {selectedFinish.id === finish.id && (
              <div className="absolute top-2 right-2">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Finish Details */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
        <div className="font-medium mb-2">Current Finish: {selectedFinish.name}</div>
        <div className="space-y-1 text-gray-600">
          <div className="flex justify-between">
            <span>Roughness:</span>
            <span className="font-mono">{selectedFinish.roughness}</span>
          </div>
          <div className="flex justify-between">
            <span>Metalness:</span>
            <span className="font-mono">{selectedFinish.metalness}</span>
          </div>
          {selectedFinish.clearcoat !== undefined && (
            <div className="flex justify-between">
              <span>Clearcoat:</span>
              <span className="font-mono">{selectedFinish.clearcoat}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Finish Selector (for sidebars)
 */
export function CompactFinishSelector({
  splineApp,
  onFinishChange,
  defaultFinish = GLOSSY,
  className = ''
}: FinishSelectorProps) {
  const [selectedFinish, setSelectedFinish] = useState<MaterialFinish>(defaultFinish);

  useEffect(() => {
    if (splineApp && selectedFinish) {
      applyFinishToHelmet(splineApp, selectedFinish);
      onFinishChange?.(selectedFinish);
    }
  }, [splineApp, selectedFinish, onFinishChange]);

  return (
    <div className={`compact-finish-selector ${className}`}>
      <label className="block text-sm font-medium mb-2">
        Finish
      </label>
      <select
        value={selectedFinish.id}
        onChange={(e) => {
          const finish = HELMET_FINISHES.find(f => f.id === e.target.value);
          if (finish) setSelectedFinish(finish);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {HELMET_FINISHES.map((finish) => (
          <option key={finish.id} value={finish.id}>
            {finish.name}
          </option>
        ))}
      </select>

      {/* Quick Stats */}
      <div className="mt-2 flex gap-4 text-xs text-gray-600">
        <div>
          <span className="font-medium">R:</span> {selectedFinish.roughness.toFixed(2)}
        </div>
        <div>
          <span className="font-medium">M:</span> {selectedFinish.metalness.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

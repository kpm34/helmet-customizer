'use client';

import { ChevronLeft, ChevronRight, Save, Download } from 'lucide-react';
import { tokens } from '@/lib/design/tokens';
import type { WizardStep } from './WizardProgress';

interface WizardNavigationProps {
  currentStep: WizardStep;
  onNext?: () => void;
  onPrevious?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  nextLabel?: string;
  previousLabel?: string;
}

export function WizardNavigation({
  currentStep,
  onNext,
  onPrevious,
  onSave,
  onExport,
  canGoNext = true,
  canGoPrevious = true,
  nextLabel,
  previousLabel,
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 4;

  // Auto-generate labels based on step
  const getNextLabel = () => {
    if (nextLabel) return nextLabel;
    if (currentStep === 2) return 'Continue to Advanced';
    if (isLastStep) return null;
    return 'Next';
  };

  const getPreviousLabel = () => {
    if (previousLabel) return previousLabel;
    if (currentStep === 3) return 'Back to Base';
    return 'Previous';
  };

  return (
    <div className="space-y-3">
      {/* Main Navigation */}
      <div className="flex gap-3">
        {/* Previous Button */}
        {!isFirstStep && (
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={`
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200 border flex-1
              ${
                canGoPrevious
                  ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-gray-600'
                  : 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4" />
            {getPreviousLabel()}
          </button>
        )}

        {/* Next Button */}
        {!isLastStep && onNext && (
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={`
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
              transition-all duration-200 flex-1
              ${
                canGoNext
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
              }
            `}
            style={{
              boxShadow: canGoNext ? `0 0 20px ${tokens.colors.accent.blue}20` : undefined,
            }}
          >
            {getNextLabel()}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Final Step Actions (Save/Export) */}
      {isLastStep && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-800/50">
          {/* Save Button */}
          {onSave && (
            <button
              onClick={onSave}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
                       bg-gradient-to-r from-green-500 to-emerald-600 text-white
                       transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105"
            >
              <Save className="w-4 h-4" />
              Save Design
            </button>
          )}

          {/* Export Button */}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
                       bg-gradient-to-r from-blue-500 to-purple-600 text-white
                       transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105"
            >
              <Download className="w-4 h-4" />
              Export GLB
            </button>
          )}
        </div>
      )}

      {/* Step Counter */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <div className={`w-1.5 h-1.5 rounded-full ${isLastStep ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
        <span>
          {isLastStep ? 'Final Step' : `Step ${currentStep} of 4`}
        </span>
      </div>
    </div>
  );
}

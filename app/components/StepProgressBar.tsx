'use client';

import { tokens } from '@/lib/design/tokens';
import { Check } from 'lucide-react';

export type WizardStep = 1 | 2 | 3 | 4;

interface WizardProgressProps {
  currentStep: WizardStep;
  completedSteps?: WizardStep[];
  onStepClick?: (step: WizardStep) => void;
}

interface StepConfig {
  step: WizardStep;
  label: string;
  description: string;
}

const STEPS: StepConfig[] = [
  { step: 1, label: 'Color', description: 'Choose base color' },
  { step: 2, label: 'Finish', description: 'Select material finish' },
  { step: 3, label: 'Pattern', description: 'Add pattern design' },
  { step: 4, label: 'Logo', description: 'Upload custom logo' },
];

export function StepProgressBar({ currentStep, completedSteps = [], onStepClick }: WizardProgressProps) {
  const isStepCompleted = (step: WizardStep) => completedSteps.includes(step);
  const isStepCurrent = (step: WizardStep) => step === currentStep;
  const isStepAccessible = (step: WizardStep) => step <= currentStep || isStepCompleted(step);

  return (
    <div className="space-y-4">
      {/* Step Indicators */}
      <div className="relative">
        {/* Progress Line */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-gray-700"
          style={{ width: '100%', zIndex: 0 }}
        />
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / 3) * 100}%`,
            zIndex: 1,
          }}
        />

        {/* Step Circles */}
        <div className="relative flex justify-between" style={{ zIndex: 2 }}>
          {STEPS.map((stepConfig) => {
            const completed = isStepCompleted(stepConfig.step);
            const current = isStepCurrent(stepConfig.step);
            const accessible = isStepAccessible(stepConfig.step);

            return (
              <button
                key={stepConfig.step}
                onClick={() => onStepClick?.(stepConfig.step)}
                disabled={!accessible}
                className="flex flex-col items-center flex-1 group cursor-pointer disabled:cursor-not-allowed"
              >
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-300 border-2
                    ${
                      completed
                        ? 'bg-gradient-to-br from-blue-400 to-purple-500 border-transparent text-white shadow-lg group-hover:scale-110'
                        : current
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/30'
                        : accessible
                        ? 'bg-gray-800 border-gray-600 text-gray-400 group-hover:border-gray-500 group-hover:scale-105'
                        : 'bg-gray-900 border-gray-700 text-gray-600'
                    }
                  `}
                  style={{
                    boxShadow: current ? `0 0 20px ${tokens.colors.accent.blue}40` : undefined,
                  }}
                >
                  {completed ? <Check className="w-5 h-5" /> : stepConfig.step}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <div
                    className={`
                      text-xs font-semibold transition-colors duration-300
                      ${current ? 'text-blue-400' : accessible ? 'text-gray-300 group-hover:text-gray-100' : 'text-gray-600'}
                    `}
                  >
                    {stepConfig.label}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {stepConfig.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

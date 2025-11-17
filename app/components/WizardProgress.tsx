'use client';

import { tokens } from '@/lib/design/tokens';
import { Check } from 'lucide-react';

export type WizardStep = 1 | 2 | 3 | 4;
export type WizardScene = 1 | 2;

interface WizardProgressProps {
  currentStep: WizardStep;
  completedSteps?: WizardStep[];
}

interface StepConfig {
  step: WizardStep;
  scene: WizardScene;
  label: string;
  description: string;
}

const STEPS: StepConfig[] = [
  { step: 1, scene: 1, label: 'Color', description: 'Choose base color' },
  { step: 2, scene: 1, label: 'Finish', description: 'Select material finish' },
  { step: 3, scene: 2, label: 'Pattern', description: 'Add pattern design' },
  { step: 4, scene: 2, label: 'Logo', description: 'Upload custom logo' },
];

export function WizardProgress({ currentStep, completedSteps = [] }: WizardProgressProps) {
  const isStepCompleted = (step: WizardStep) => completedSteps.includes(step);
  const isStepCurrent = (step: WizardStep) => step === currentStep;
  const isStepAccessible = (step: WizardStep) => step <= currentStep || isStepCompleted(step);

  return (
    <div className="space-y-4">
      {/* Scene Headers */}
      <div className="flex gap-4">
        <SceneGroup scene={1} currentStep={currentStep} />
        <SceneGroup scene={2} currentStep={currentStep} />
      </div>

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
              <div key={stepConfig.step} className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-300 border-2
                    ${
                      completed
                        ? 'bg-gradient-to-br from-blue-400 to-purple-500 border-transparent text-white shadow-lg'
                        : current
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/30'
                        : accessible
                        ? 'bg-gray-800 border-gray-600 text-gray-400'
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
                      ${current ? 'text-blue-400' : accessible ? 'text-gray-300' : 'text-gray-600'}
                    `}
                  >
                    {stepConfig.label}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {stepConfig.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface SceneGroupProps {
  scene: WizardScene;
  currentStep: WizardStep;
}

function SceneGroup({ scene, currentStep }: SceneGroupProps) {
  const sceneSteps = STEPS.filter((s) => s.scene === scene);
  const isActive = sceneSteps.some((s) => s.step === currentStep);
  const sceneLabel = scene === 1 ? 'Base Customization' : 'Advanced Design';

  return (
    <div
      className={`
        flex-1 px-3 py-2 rounded-lg border transition-all duration-300
        ${
          isActive
            ? 'bg-blue-500/10 border-blue-500/30'
            : 'bg-gray-800/30 border-gray-700/50'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <div
          className={`
            w-2 h-2 rounded-full transition-colors duration-300
            ${isActive ? 'bg-blue-400 shadow-lg shadow-blue-400/50' : 'bg-gray-600'}
          `}
        />
        <div>
          <div
            className={`
              text-xs font-semibold transition-colors duration-300
              ${isActive ? 'text-blue-400' : 'text-gray-400'}
            `}
          >
            Scene {scene}
          </div>
          <div className="text-[10px] text-gray-500">{sceneLabel}</div>
        </div>
      </div>
    </div>
  );
}

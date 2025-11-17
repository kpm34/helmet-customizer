'use client';

import { useState } from 'react';
import { useHelmetStore, type HelmetZone } from '@/store/helmetStore';
import { ColorPicker } from './ColorPicker';
import { FinishSelector } from './FinishSelector';
import { ZONES_CONFIG, getZoneConfig } from '@/lib/constants';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { WizardProgress, type WizardStep } from './WizardProgress';
import { WizardNavigation } from './WizardNavigation';
import { ZoneSelector } from './ZoneSelector';
import { LiquidGlassInput } from './LiquidGlassInput';
import { tokens } from '@/lib/design/tokens';

export function CustomizationPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
  const [activeZone, setActiveZone] = useState<HelmetZone>('shell');

  const { config, setZoneColor, setZoneFinish, resetToDefaults } = useHelmetStore();

  // Mark step as completed and optionally move to next
  const completeStep = (step: WizardStep, moveToNext: boolean = true) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    if (moveToNext && step < 4) {
      setCurrentStep((step + 1) as WizardStep);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    completeStep(currentStep, true);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  const handleSave = () => {
    console.log('💾 Saving helmet configuration...', config);
    // TODO: Implement save to database
    alert('Helmet configuration saved!');
  };

  const handleExport = () => {
    console.log('📦 Exporting helmet to GLB...', config);
    // TODO: Implement GLB export
    alert('Exporting to GLB format...');
  };

  // Check if user can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case 1: // Color step - requires color selection
        return config[activeZone].color !== '';
      case 2: // Finish step - requires finish selection
        return config[activeZone].finish !== undefined;
      case 3: // Pattern step - always can proceed
        return true;
      case 4: // Logo step - always can proceed
        return true;
      default:
        return false;
    }
  };

  // Collapsed state
  if (isCollapsed) {
    return (
      <div className="fixed right-0 top-0 h-full z-20 flex items-center">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 p-3 rounded-l-lg hover:bg-gray-800 transition-all duration-200"
          title="Open customization panel"
        >
          <PanelRightOpen className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    );
  };

  const currentZoneConfig = config[activeZone];
  const zoneInfo = getZoneConfig(activeZone);

  return (
    <div className="fixed right-0 top-0 h-full w-96 z-20 flex flex-col bg-gradient-to-b from-gray-900 to-gray-950 shadow-2xl border-l border-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Helmet Editor
        </h1>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          title="Collapse panel"
        >
          <PanelRightClose className="w-5 h-5 text-gray-400" />
        </button>
      </header>

      {/* Wizard Progress */}
      <div className="p-4 border-b border-gray-800/30">
        <WizardProgress currentStep={currentStep} completedSteps={completedSteps} />
      </div>

      {/* Zone Selector - Always Visible */}
      <div className="p-4 border-b border-gray-800/30">
        <ZoneSelector activeZone={activeZone} onZoneChange={setActiveZone} />
      </div>

      {/* Step Content */}
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${tokens.colors.border.base} ${tokens.colors.background.secondary}`,
        }}
      >
        {/* Step 1: Color Selection */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Step 1: Choose Zone Color
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Select a color for the {zoneInfo?.label} zone
              </p>
              <ColorPicker
                value={currentZoneConfig.color}
                onChange={(color) => setZoneColor(activeZone, color)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Material Finish */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Step 2: Select Material Finish
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Choose the surface finish for {zoneInfo?.label}
              </p>
              <FinishSelector
                value={currentZoneConfig.finish}
                onChange={(finish) => setZoneFinish(activeZone, finish)}
              />
            </div>

            {/* Color Preview */}
            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
              <div className="text-xs text-gray-400 mb-2">Current Configuration</div>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-white/20"
                  style={{ backgroundColor: currentZoneConfig.color }}
                />
                <div className="text-xs">
                  <div className="text-gray-300 font-medium">{currentZoneConfig.color}</div>
                  <div className="text-gray-500 capitalize">{currentZoneConfig.finish}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pattern Selection */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Step 3: Add Pattern Design
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Choose a pattern overlay for your helmet
              </p>

              {/* Pattern Grid - Coming Soon */}
              <div className="grid grid-cols-2 gap-3">
                {['None', 'Stripes', 'Camo', 'Carbon Fiber'].map((pattern) => (
                  <button
                    key={pattern}
                    className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-all text-sm text-gray-400"
                  >
                    {pattern}
                  </button>
                ))}
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center py-4 bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                Pattern system coming soon...
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Logo Upload */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Step 4: Upload Custom Logo
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Add your team logo or custom decal
              </p>

              <LiquidGlassInput
                type="file"
                placeholder="Select logo image..."
                accept="image/*"
                onSubmit={(file) => {
                  console.log('Logo uploaded:', file);
                  // TODO: Handle logo upload
                }}
              />

              <div className="mt-4 text-xs text-gray-500 text-center py-4 bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                Logo upload coming soon...
              </div>
            </div>

            {/* Final Summary */}
            <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-lg p-4 border border-green-700/30">
              <div className="text-xs font-semibold text-green-400 mb-3">✓ Design Complete</div>
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Zone:</span>
                  <span>{zoneInfo?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Color:</span>
                  <span className="font-mono">{currentZoneConfig.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Finish:</span>
                  <span className="capitalize">{currentZoneConfig.finish}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <footer className="p-4 border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm space-y-3">
        <WizardNavigation
          currentStep={currentStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSave={handleSave}
          onExport={handleExport}
          canGoNext={canProceed()}
          canGoPrevious={currentStep > 1}
        />

        {/* Reset Button */}
        {currentStep === 1 && (
          <button
            onClick={resetToDefaults}
            className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg
                     border border-gray-700 transition-all duration-200 font-medium text-xs"
          >
            Reset to Defaults
          </button>
        )}
      </footer>
    </div>
  );
}

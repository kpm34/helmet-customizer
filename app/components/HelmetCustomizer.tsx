'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useHelmetStore, type HelmetZone } from '@/store/helmetStore';
import { ColorSelector } from './ColorSelector';
import { MaterialFinishSelector } from './MaterialFinishSelector';
import PatternSelector from './PatternSelector';
import { ZONES_CONFIG, getZoneConfig } from '@/lib/constants';
import { PanelRightClose, PanelRightOpen, Palette, Pipette, X, Sparkles } from 'lucide-react';
import { StepProgressBar, type WizardStep } from './StepProgressBar';
import { StepNavigationButtons } from './StepNavigationButtons';
import { ZoneTabs } from './ZoneTabs';
import { GlassInput } from './GlassInput';
import { tokens } from '@/lib/design/tokens';
import { BASIC_COLOR_PALETTE, CFB_TEAM_PRESETS } from '@/types/helmet';
import { HexColorPicker } from 'react-colorful';
import { motion } from 'framer-motion';

// Helper functions for HSL conversion
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getHue(hex: string): number {
  return hexToHSL(hex).h;
}

function getSaturation(hex: string): number {
  return hexToHSL(hex).s;
}

function getLightness(hex: string): number {
  return hexToHSL(hex).l;
}

export function HelmetCustomizer() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
  const [activeZone, setActiveZone] = useState<HelmetZone>('shell');
  const [lastClickedTeam, setLastClickedTeam] = useState<string | null>(null);
  const [fineTuneColor, setFineTuneColor] = useState<string | null>(null);
  const [tempColor, setTempColor] = useState<string>('#FF0000');
  const [showTeamPresets, setShowTeamPresets] = useState(false);

  // Resizable panel state
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  const { config, setZoneColor, setZoneFinish, resetToDefaults, panelWidth, setPanelWidth } = useHelmetStore();

  // Resize handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const newWidth = window.innerWidth - e.clientX;
    // Constrain between min (300px) and max (800px)
    const constrainedWidth = Math.min(Math.max(newWidth, 300), 800);
    setPanelWidth(constrainedWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection while dragging
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

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

    // If moving to step 3 or 4, and currently on padding/hardware, switch to shell
    const nextStep = currentStep + 1;
    if (nextStep >= 3 && (activeZone === 'padding' || activeZone === 'hardware')) {
      setActiveZone('shell');
    }
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

  // Team preset handler - applies colors to shell & facemask, with toggle swap
  const handleTeamPresetClick = (preset: { primaryColor: string; secondaryColor: string; team: string }) => {
    // Check if this is the same team clicked again
    const isSameTeam = lastClickedTeam === preset.team;

    if (isSameTeam) {
      // Swap colors: shell gets secondary, facemask gets primary
      setZoneColor('shell', preset.secondaryColor);
      setZoneColor('facemask', preset.primaryColor);
      console.log(`🔄 Swapped ${preset.team} colors - Shell: ${preset.secondaryColor}, Facemask: ${preset.primaryColor}`);
      // Reset last clicked team to allow swapping again
      setLastClickedTeam(null);
    } else {
      // First click or different team: shell gets primary, facemask gets secondary
      setZoneColor('shell', preset.primaryColor);
      setZoneColor('facemask', preset.secondaryColor);
      console.log(`🎨 Applied ${preset.team} colors - Shell: ${preset.primaryColor}, Facemask: ${preset.secondaryColor}`);
      setLastClickedTeam(preset.team);
    }
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
    <div
      ref={resizeRef}
      className="fixed right-0 top-0 h-full z-20 flex flex-col bg-gradient-to-b from-gray-900 to-gray-950 shadow-2xl border-l border-gray-800"
      style={{ width: `${panelWidth}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors z-30 group"
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator */}
        <div className="absolute inset-y-0 -left-1 w-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-12 rounded-full bg-blue-500/50 shadow-lg" />
        </div>
      </div>

      {/* Header - Gridiron Studio */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#676767]">
        <div className="flex-1">
          <h1 className="text-white text-2xl font-light tracking-[0.3em] leading-tight">
            GRIDIRON<br />STUDIO
          </h1>
        </div>
        <div className="w-64 h-36 bg-[#D9D9D9] flex items-center justify-center">
          <span className="text-gray-600 text-sm">insert logo here</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-gray-600/50 transition-colors"
          title="Collapse panel"
        >
          <PanelRightClose className="w-4 h-4 text-gray-300" />
        </button>
      </header>

      {/* Tabs Container with grey background for gap */}
      <div className="bg-[#676767]">
        {/* Main Zone Tabs - Shell, Facemask, Chinstrap with 3D pressed effect */}
        <div className="flex gap-1 bg-[#D9D9D9] px-2 pt-2 pb-1">
          {(['shell', 'facemask', 'chinstrap'] as const).map((zone) => (
            <button
              key={zone}
              onClick={() => setActiveZone(zone)}
              className={`flex-1 py-3 text-center text-lg font-normal tracking-wide transition-all rounded-t-xl ${
                activeZone === zone
                  ? 'bg-[#C0C0C0] text-gray-800 font-medium shadow-inner'
                  : 'bg-[#D9D9D9] text-gray-700 hover:bg-gray-200 shadow-sm'
              }`}
              style={
                activeZone === zone
                  ? {
                      boxShadow: 'inset 0 3px 6px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.2)',
                      transform: 'translateY(2px)',
                    }
                  : {
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }
              }
            >
              {zone === 'facemask' ? 'FACEMASK' : zone.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Step Navigation Tabs - Color, Finish, Pattern, Logo with rotating border */}
        <div className="flex gap-1 px-2 pt-2 pb-2 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
        {/* Shell has all 4 steps */}
        {activeZone === 'shell' && (
          <>
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 relative py-2.5 text-center text-sm transition-all rounded-xl overflow-hidden text-gray-800 hover:text-gray-900 bg-[#D9D9D9]"
            >
              {currentStep === 1 && (
                <motion.div
                  className="absolute top-[-450%] left-0 right-0 bottom-0 h-[1000%] rounded-xl opacity-65"
                  style={{
                    background: 'conic-gradient(transparent 200deg, rgba(156, 163, 175, 0.8))',
                    zIndex: 1,
                  }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 6,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                />
              )}
              <span className="relative z-10">Color</span>
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="flex-1 relative py-2.5 text-center text-sm transition-all rounded-xl overflow-hidden text-gray-800 hover:text-gray-900 bg-[#D9D9D9]"
            >
              {currentStep === 2 && (
                <motion.div
                  className="absolute top-[-450%] left-0 right-0 bottom-0 h-[1000%] rounded-xl opacity-65"
                  style={{
                    background: 'conic-gradient(transparent 200deg, rgba(156, 163, 175, 0.8))',
                    zIndex: 1,
                  }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 6,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                />
              )}
              <span className="relative z-10">Finish</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex-1 relative py-2.5 text-center text-sm transition-all rounded-xl overflow-hidden text-gray-800 hover:text-gray-900 bg-[#D9D9D9]"
            >
              {currentStep === 3 && (
                <motion.div
                  className="absolute top-[-450%] left-0 right-0 bottom-0 h-[1000%] rounded-xl opacity-65"
                  style={{
                    background: 'conic-gradient(transparent 200deg, rgba(156, 163, 175, 0.8))',
                    zIndex: 1,
                  }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 6,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                />
              )}
              <span className="relative z-10">Pattern</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="flex-1 relative py-2.5 text-center text-sm transition-all rounded-xl overflow-hidden text-gray-800 hover:text-gray-900 bg-[#D9D9D9]"
            >
              {currentStep === 4 && (
                <motion.div
                  className="absolute top-[-450%] left-0 right-0 bottom-0 h-[1000%] rounded-xl opacity-65"
                  style={{
                    background: 'conic-gradient(transparent 200deg, rgba(156, 163, 175, 0.8))',
                    zIndex: 1,
                  }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 6,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                />
              )}
              <span className="relative z-10">Logo</span>
            </button>
          </>
        )}

        {/* Facemask has Color, Finish, Components */}
        {activeZone === 'facemask' && (
          <>
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 relative py-2.5 text-center text-sm transition-all rounded-xl overflow-hidden text-gray-800 hover:text-gray-900 bg-[#D9D9D9]"
            >
              {currentStep === 1 && (
                <motion.div
                  className="absolute top-[-450%] left-0 right-0 bottom-0 h-[1000%] rounded-xl opacity-65"
                  style={{
                    background: 'conic-gradient(transparent 200deg, rgba(156, 163, 175, 0.8))',
                    zIndex: 1,
                  }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 6,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                />
              )}
              <span className="relative z-10">Color</span>
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="flex-1 relative py-2.5 text-center text-sm transition-all rounded-xl overflow-hidden text-gray-800 hover:text-gray-900 bg-[#D9D9D9]"
            >
              {currentStep === 2 && (
                <motion.div
                  className="absolute top-[-450%] left-0 right-0 bottom-0 h-[1000%] rounded-xl opacity-65"
                  style={{
                    background: 'conic-gradient(transparent 200deg, rgba(156, 163, 175, 0.8))',
                    zIndex: 1,
                  }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 6,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                />
              )}
              <span className="relative z-10">Finish</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex-[2] relative py-2.5 text-center text-sm transition-all rounded-xl overflow-hidden text-gray-800 hover:text-gray-900 bg-[#D9D9D9]"
            >
              {currentStep === 3 && (
                <motion.div
                  className="absolute top-[-450%] left-0 right-0 bottom-0 h-[1000%] rounded-xl opacity-65"
                  style={{
                    background: 'conic-gradient(transparent 200deg, rgba(156, 163, 175, 0.8))',
                    zIndex: 1,
                  }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 6,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                />
              )}
              <span className="relative z-10">Components</span>
            </button>
          </>
        )}

        {/* Chinstrap has only Color */}
        {activeZone === 'chinstrap' && (
          <button
            onClick={() => setCurrentStep(1)}
            className="flex-1 relative py-2.5 text-center text-sm transition-all rounded-xl overflow-hidden text-gray-800 hover:text-gray-900 bg-[#D9D9D9]"
          >
            {currentStep === 1 && (
              <motion.div
                className="absolute top-[-450%] left-0 right-0 bottom-0 h-[1000%] rounded-xl"
                style={{
                  background: 'conic-gradient(transparent 200deg, #60A5FA)',
                  zIndex: 1,
                }}
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatDelay: 0,
                }}
              />
            )}
            <span className="relative z-10">Color</span>
          </button>
        )}
      </div>
      </div>

      {/* Step Content */}
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 space-y-3 bg-[#676767]"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#999999 #676767',
        }}
      >
        {/* Step 1: Color Selection */}
        {currentStep === 1 && (
          <div className="space-y-3 animate-fade-in relative">
            {/* Team Presets Button - Only on Shell - Lollipop Design from Right Border */}
            {activeZone === 'shell' && (
              <div className="absolute top-1/2 -translate-y-1/2 right-0 flex items-center gap-0 group z-50">
                {/* Circular Node (Lollipop) */}
                <button
                  onClick={() => setShowTeamPresets(true)}
                  className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                  title="Team Presets"
                >
                  <Sparkles className="w-6 h-6" />
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Team Presets
                  </span>
                </button>

                {/* Thicker Stem (2.5x = 2.5px) */}
                <div className="h-[2.5px] w-8 bg-blue-500 group-hover:bg-blue-600 transition-all duration-200" />
              </div>
            )}

            <div className={activeZone === 'chinstrap' ? 'flex flex-col items-center' : ''}>
              <div className={activeZone === 'chinstrap' ? 'w-2/3' : 'w-full'}>
                <ColorSelector
                  value={currentZoneConfig.color}
                  onChange={(color) => setZoneColor(activeZone, color)}
                  showTeamPresets={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Material Finish */}
        {currentStep === 2 && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-3 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Step 2: Select Material Finish
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                Choose the surface finish for {zoneInfo?.label}
              </p>
              <MaterialFinishSelector
                value={currentZoneConfig.finish}
                onChange={(finish) => setZoneFinish(activeZone, finish)}
              />
            </div>

            {/* Color Preview */}
            <div className="bg-gray-800/30 rounded-lg p-2.5 border border-gray-700/30">
              <div className="text-xs text-gray-400 mb-1.5">Current Configuration</div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-lg border-2 border-white/20"
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

        {/* Step 3: Pattern Selection (Shell) OR Components (Facemask) */}
        {currentStep === 3 && (
          <div className="space-y-3 animate-fade-in">
            {activeZone === 'shell' ? (
              // Shell Pattern Selection
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  Step 3: Add Pattern Design
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  Choose a pattern overlay for your helmet
                </p>

                {/* Pattern Selector Component */}
                <PatternSelector />
              </div>
            ) : activeZone === 'facemask' ? (
              // Facemask Components (Padding + Hardware)
              <div className="space-y-3">
                {/* Top Half: Padding */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                  <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    Padding
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Customize padding color
                  </p>

                  <ColorSelector
                    value={config.padding.color}
                    onChange={(color) => setZoneColor('padding', color)}
                    showTeamPresets={false}
                  />
                </div>

                {/* Bottom Half: Hardware */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                  <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    Hardware
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Customize hardware color and finish
                  </p>

                  {/* Hardware Color */}
                  <div className="mb-3">
                    <ColorSelector
                      value={config.hardware.color}
                      onChange={(color) => setZoneColor('hardware', color)}
                      showTeamPresets={false}
                    />
                  </div>

                  {/* Hardware Finish */}
                  <MaterialFinishSelector
                    value={config.hardware.finish}
                    onChange={(finish) => setZoneFinish('hardware', finish)}
                  />
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Step 4: Logo Upload */}
        {currentStep === 4 && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-3 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Step 4: Upload Custom Logo
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                Add your team logo or custom decal
              </p>

              <GlassInput
                type="file"
                placeholder="Select logo image..."
                accept="image/*"
                onSubmit={(file) => {
                  console.log('Logo uploaded:', file);
                  // TODO: Handle logo upload
                }}
              />

              <div className="mt-3 text-xs text-gray-500 text-center py-3 bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                Logo upload coming soon...
              </div>
            </div>

            {/* Final Summary */}
            <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-lg p-3 border border-green-700/30">
              <div className="text-xs font-semibold text-green-400 mb-2">✓ Design Complete</div>
              <div className="space-y-1.5 text-xs text-gray-300">
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

      {/* Step Navigation Footer */}
      <footer className="px-4 py-3 border-t border-gray-800/50 bg-[#676767] backdrop-blur-sm space-y-2.5">
        {/* Basic Colors - Always Visible at Bottom with Animated Border Effect */}
        {currentStep === 1 && (
          <div className="space-y-2 relative">
            <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              Basic Colors
              {fineTuneColor && (
                <span className="text-[10px] text-blue-400 flex items-center gap-1">
                  <Pipette className="w-3 h-3" />
                  Fine-tuning...
                </span>
              )}
            </div>

            {/* Fine-Tune Color Picker Popup */}
            {fineTuneColor && (() => {
              const isNeutral = ['#000000', '#808080', '#FFFFFF'].includes(fineTuneColor.toUpperCase());
              return (
                <div className="absolute bottom-full left-0 right-0 mb-2 z-50 animate-fade-in">
                  <div className="bg-gray-800/95 backdrop-blur-xl rounded-2xl border-2 border-blue-500/50 shadow-2xl p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pipette className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-gray-200">Fine-Tune Color</span>
                      </div>
                      <button
                        onClick={() => setFineTuneColor(null)}
                        className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    {isNeutral ? (
                      // Full color picker for black, grey, white
                      <HexColorPicker
                        color={tempColor}
                        onChange={(newColor) => {
                          setTempColor(newColor);
                          setZoneColor(activeZone, newColor);
                        }}
                        style={{ width: '100%', height: '150px' }}
                      />
                    ) : (
                      // Just saturation/lightness sliders for colored options
                      <div className="space-y-2.5">
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400">Saturation</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right,
                                hsl(${getHue(tempColor)}, 0%, ${getLightness(tempColor)}%),
                                hsl(${getHue(tempColor)}, 100%, ${getLightness(tempColor)}%))`
                            }}
                            value={getSaturation(tempColor)}
                            onChange={(e) => {
                              const newColor = hslToHex(
                                getHue(tempColor),
                                parseInt(e.target.value),
                                getLightness(tempColor)
                              );
                              setTempColor(newColor);
                              setZoneColor(activeZone, newColor);
                            }}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400">Lightness</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right,
                                hsl(${getHue(tempColor)}, ${getSaturation(tempColor)}%, 0%),
                                hsl(${getHue(tempColor)}, ${getSaturation(tempColor)}%, 50%),
                                hsl(${getHue(tempColor)}, ${getSaturation(tempColor)}%, 100%))`
                            }}
                            value={getLightness(tempColor)}
                            onChange={(e) => {
                              const newColor = hslToHex(
                                getHue(tempColor),
                                getSaturation(tempColor),
                                parseInt(e.target.value)
                              );
                              setTempColor(newColor);
                              setZoneColor(activeZone, newColor);
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempColor.toUpperCase()}
                        onChange={(e) => {
                          setTempColor(e.target.value);
                          setZoneColor(activeZone, e.target.value);
                        }}
                        className="flex-1 px-2.5 py-1.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                      <div
                        className="w-10 h-8 rounded-lg border-2 border-gray-600"
                        style={{ backgroundColor: tempColor }}
                      />
                    </div>

                    <button
                      onClick={() => setFineTuneColor(null)}
                      className="w-full px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium text-xs transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-center gap-2 p-2.5 bg-gray-800/30 rounded-lg border-2 border-gray-700">
              {BASIC_COLOR_PALETTE.slice(0, 8).map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    // Apply color immediately AND show fine-tune slider
                    setZoneColor(activeZone, color);
                    setTempColor(color);
                    setFineTuneColor(color);
                  }}
                  className={`relative flex-1 h-14 cursor-pointer transition-all duration-500 ease-in-out group ${
                    config[activeZone].color.toUpperCase() === color.toUpperCase()
                      ? 'border-t-[42px] border-b-0'
                      : 'border-b-[42px] border-t-0 hover:border-b-0 hover:border-t-[42px]'
                  }`}
                  style={{
                    backgroundColor: color,
                    borderLeftColor: '#34495E',
                    borderRightColor: '#34495E',
                    borderTopColor: '#34495E',
                    borderBottomColor: '#34495E',
                    borderLeftWidth: '3px',
                    borderRightWidth: '3px',
                  }}
                  title={`${color} - Click to apply and fine-tune`}
                >
                  <Pipette className="absolute top-1 right-1 w-3 h-3 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-2 p-2.5 bg-gray-800/30 rounded-lg border-2 border-gray-700">
              {BASIC_COLOR_PALETTE.slice(8).map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    // Apply color immediately AND show fine-tune slider
                    setZoneColor(activeZone, color);
                    setTempColor(color);
                    setFineTuneColor(color);
                  }}
                  className={`relative flex-1 h-14 cursor-pointer transition-all duration-500 ease-in-out group ${
                    config[activeZone].color.toUpperCase() === color.toUpperCase()
                      ? 'border-t-[42px] border-b-0'
                      : 'border-b-[42px] border-t-0 hover:border-b-0 hover:border-t-[42px]'
                  }`}
                  style={{
                    backgroundColor: color,
                    borderLeftColor: '#34495E',
                    borderRightColor: '#34495E',
                    borderTopColor: '#34495E',
                    borderBottomColor: '#34495E',
                    borderLeftWidth: '3px',
                    borderRightWidth: '3px',
                  }}
                  title={`${color} - Click to apply and fine-tune`}
                >
                  <Pipette className="absolute top-1 right-1 w-3 h-3 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium text-sm"
          >
            Save
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-medium text-sm"
          >
            Export GLB
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetToDefaults}
          className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg
                   border border-gray-600 transition-all duration-200 font-medium text-sm"
        >
          Reset to Defaults
        </button>
      </footer>

      {/* Team Presets Modal */}
      {showTeamPresets && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#676767] px-6 py-4 flex items-center justify-between">
              <h2 className="text-white text-xl font-light tracking-wide">TEAM PRESETS</h2>
              <button
                onClick={() => setShowTeamPresets(false)}
                className="p-2 hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-3 gap-4">
                {CFB_TEAM_PRESETS.map((preset) => (
                  <button
                    key={preset.team}
                    onClick={() => {
                      handleTeamPresetClick(preset);
                      setShowTeamPresets(false);
                    }}
                    className="group relative py-6 px-4 rounded-xl border-2 border-gray-700/50 hover:border-gray-500/80 transition-all duration-200 hover:scale-105 hover:shadow-2xl font-semibold text-base text-center"
                    style={{
                      backgroundColor: preset.primaryColor,
                      color: preset.secondaryColor,
                      boxShadow: `0 0 24px ${preset.primaryColor}40, 0 8px 16px rgba(0,0,0,0.3)`,
                      textShadow: `0 2px 4px rgba(0,0,0,0.5), 0 0 12px ${preset.secondaryColor}30`
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-800/50 px-6 py-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                Select a team to apply their colors to Shell and Facemask. Click again to swap colors.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

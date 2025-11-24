# Component Reference Guide

**Last Updated:** 2025-01-20 (Component Rename)

---

## Overview

This document provides a complete reference for all React components in the Helmet Customizer application. Components were renamed on 2025-01-20 for improved clarity and better code organization.

---

## Component Index

### Core UI Components
1. [HelmetCustomizer](#helmetcustomizer) - Main customization interface
2. [ColorSelector](#colorselector) - Color picker with team presets
3. [MaterialFinishSelector](#materialfinishselector) - Material finish grid
4. [Tooltip](#tooltip) - Unified tooltip component

### Wizard/Step Components
5. [ZoneTabs](#zonetabs) - Zone selection tabs
6. [StepProgressBar](#stepprogressbar) - Visual step progress indicator
7. [StepNavigationButtons](#stepnavigationbuttons) - Navigation buttons

### Form Components
8. [GlassInput](#glassinput) - Styled file input

### Debug/Testing Components
9. [DebugConsole](#debugconsole) - Console logging panel
10. [MaterialTester](#materialtester) - Quick finish testing tool

---

## Component Details

### HelmetCustomizer

**File:** `app/components/HelmetCustomizer.tsx`
**Former Name:** `CustomizationPanel`

Main customization interface panel containing the 4-step wizard for helmet customization.

**Features:**
- Collapsible sidebar
- 4-step wizard (Color → Finish → Pattern → Logo)
- Zone selection
- Team preset colors
- Save/Export functionality

**Props:** None (uses Zustand store directly)

**Usage:**
```tsx
import { HelmetCustomizer } from '@/app/components/HelmetCustomizer';

<HelmetCustomizer />
```

**State Management:**
- Uses `useHelmetStore()` for config state
- Local state for wizard steps and UI

---

### ColorSelector

**File:** `app/components/ColorSelector.tsx`
**Former Name:** `ColorPicker`

Color selection component with hex color picker and team preset buttons.

**Props:**
```typescript
interface ColorSelectorProps {
  value: string;                    // Current color (hex)
  onChange: (color: string) => void; // Color change handler
  onTeamPresetClick?: (preset: {
    primaryColor: string;
    secondaryColor: string;
    team: string;
  }) => void; // Team preset handler (optional)
}
```

**Features:**
- HexColorPicker integration (react-colorful)
- Hex input field
- Team color presets (CFB teams)
- Dual-zone application with swap on second click

**Usage:**
```tsx
import { ColorSelector } from '@/app/components/ColorSelector';

<ColorSelector
  value={config.shell.color}
  onChange={(color) => setZoneColor('shell', color)}
  onTeamPresetClick={handleTeamPreset}
/>
```

---

### MaterialFinishSelector

**File:** `app/components/MaterialFinishSelector.tsx`
**Former Name:** `FinishSelector`

Material finish selection grid showing all available finishes.

**Props:**
```typescript
interface MaterialFinishSelectorProps {
  value: MaterialFinish;                      // Current finish
  onChange: (finish: MaterialFinish) => void; // Finish change handler
}
```

**Features:**
- Grid layout of finish cards
- 14 finish options
- Visual preview of each finish
- Metalness/Roughness indicators

**Available Finishes:**
- Basic: Glossy, Matte, Chrome, Brushed, Satin
- Automotive: Pearl Coat, Satin Auto, Metallic Flake, Wet Clear Coat
- Metal: Anodized, Brushed Titanium, Weathered Metal
- Special: Carbon Fiber, Rubberized Soft Touch

**Usage:**
```tsx
import { MaterialFinishSelector } from '@/app/components/MaterialFinishSelector';

<MaterialFinishSelector
  value={config.shell.finish}
  onChange={(finish) => setZoneFinish('shell', finish)}
/>
```

---

### ZoneTabs

**File:** `app/components/ZoneTabs.tsx`
**Former Name:** `ZoneSelector`

Tab navigation for selecting helmet zones.

**Props:**
```typescript
interface ZoneTabsProps {
  activeZone: HelmetZone;                    // Currently active zone
  onZoneChange: (zone: HelmetZone) => void; // Zone change handler
  currentStep: WizardStep;                   // Current wizard step (1-4)
}
```

**Features:**
- 5 zone tabs (shell, facemask, chinstrap, padding, hardware)
- Color indicator on each tab
- Tooltips with zone descriptions
- Active state highlighting
- Step-based filtering (only shell/facemask/chinstrap in steps 1-2)

**Usage:**
```tsx
import { ZoneTabs } from '@/app/components/ZoneTabs';

<ZoneTabs
  activeZone={activeZone}
  onZoneChange={setActiveZone}
  currentStep={currentStep}
/>
```

---

### StepProgressBar

**File:** `app/components/StepProgressBar.tsx`
**Former Name:** `WizardProgress`

Visual progress indicator for the 4-step wizard.

**Props:**
```typescript
interface StepProgressBarProps {
  currentStep: WizardStep;         // Current step (1-4)
  completedSteps: WizardStep[];    // Array of completed steps
}

type WizardStep = 1 | 2 | 3 | 4;
```

**Features:**
- 4 step indicators
- Visual completion states
- Step labels and icons
- Progress line connecting steps

**Steps:**
1. Color Selection
2. Material Finish
3. Pattern Design
4. Logo Upload

**Usage:**
```tsx
import { StepProgressBar } from '@/app/components/StepProgressBar';

<StepProgressBar
  currentStep={2}
  completedSteps={[1]}
/>
```

---

### StepNavigationButtons

**File:** `app/components/StepNavigationButtons.tsx`
**Former Name:** `WizardNavigation`

Navigation buttons for wizard progression and actions.

**Props:**
```typescript
interface StepNavigationButtonsProps {
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
```

**Features:**
- Contextual button labels
- Disabled states
- Save/Export actions on final step
- Auto-generated labels based on current step

**Usage:**
```tsx
import { StepNavigationButtons } from '@/app/components/StepNavigationButtons';

<StepNavigationButtons
  currentStep={currentStep}
  onNext={handleNext}
  onPrevious={handlePrevious}
  onSave={handleSave}
  onExport={handleExport}
  canGoNext={canProceed()}
/>
```

---

### GlassInput

**File:** `app/components/GlassInput.tsx`
**Former Name:** `LiquidGlassInput`

Styled input component with glass morphism design.

**Props:**
```typescript
interface GlassInputProps {
  type: string;
  placeholder: string;
  accept?: string;                  // For file inputs
  onSubmit: (value: string | File) => void;
}
```

**Features:**
- Glass morphism styling
- File input support
- Submit on Enter key
- Animated borders

**Usage:**
```tsx
import { GlassInput } from '@/app/components/GlassInput';

<GlassInput
  type="file"
  placeholder="Select logo..."
  accept="image/*"
  onSubmit={(file) => console.log('Uploaded:', file)}
/>
```

---

### Tooltip

**File:** `app/components/Tooltip.tsx`
**Former Names:** `Tooltip` + `TooltipEnhanced` (merged 2025-01-20)

Unified tooltip component with simple and enhanced modes.

**Props:**
```typescript
interface TooltipProps {
  content: string | ReactNode;      // Tooltip content
  position?: 'top' | 'right' | 'bottom' | 'left';
  children: ReactNode;              // Element to attach tooltip to
  delay?: number;                   // Delay before showing (ms)
  disabled?: boolean;               // Disable tooltip
  enhanced?: boolean;               // Use enhanced mode (arrow + delay)
}
```

**Modes:**
- **Simple** (`enhanced={false}`): Instant, no arrow (Spline-style)
- **Enhanced** (`enhanced={true}`): Delay, arrow, smooth animation

**Usage:**
```tsx
import { Tooltip } from '@/app/components/Tooltip';

// Enhanced mode (default)
<Tooltip content="Click to select shell zone">
  <button>Shell</button>
</Tooltip>

// Simple mode
<Tooltip content="Quick info" enhanced={false}>
  <span>Hover me</span>
</Tooltip>
```

---

### DebugConsole

**File:** `app/components/DebugConsole.tsx`
**Former Name:** `ConsolePanel`

Console logging panel for debugging.

**Props:** None

**Features:**
- Captures console.log, console.error, console.warn
- Filterable by message type
- Clear logs button
- Message counts
- Collapsible panel

**Usage:**
```tsx
import DebugConsole from '@/app/components/DebugConsole';

<DebugConsole />
```

**Hook Used:**
- `useConsoleCapture()` - Captures all console messages

---

### MaterialTester

**File:** `app/components/MaterialTester.tsx`
**Former Name:** `QuickFinishTest`

Quick testing tool for material finishes.

**Props:**
```typescript
interface MaterialTesterProps {
  splineApp?: Application;
}
```

**Features:**
- Quick buttons for Glossy, Chrome, Matte
- Direct THREE.js material manipulation
- Visual feedback
- Fixed position overlay

**Usage:**
```tsx
import { MaterialTester } from '@/app/components/MaterialTester';

<MaterialTester splineApp={splineRef.current} />
```

---

## Component Naming Convention

### Before (Old Names)
- `CustomizationPanel` - Generic, unclear purpose
- `ColorPicker` - Generic React component name
- `FinishSelector` - Unclear what "finish" means
- `ZoneSelector` - Could mean many things
- `WizardProgress` - "Wizard" is vague
- `WizardNavigation` - Duplicate "wizard" prefix
- `LiquidGlassInput` - Overly creative name
- `ConsolePanel` - "Panel" is redundant
- `QuickFinishTest` - Unclear purpose

### After (New Names)
- `HelmetCustomizer` - Clear: customizes helmets
- `ColorSelector` - Clear: selects colors
- `MaterialFinishSelector` - Clear: selects material finishes
- `ZoneTabs` - Clear: tabs for zones
- `StepProgressBar` - Clear: progress bar for steps
- `StepNavigationButtons` - Clear: navigation for steps
- `GlassInput` - Concise style name
- `DebugConsole` - Clear: console for debugging
- `MaterialTester` - Clear: tests materials

---

## Import Patterns

### Individual Imports
```typescript
import { HelmetCustomizer } from '@/app/components/HelmetCustomizer';
import { ColorSelector } from '@/app/components/ColorSelector';
import { MaterialFinishSelector } from '@/app/components/MaterialFinishSelector';
```

### Barrel Exports (Recommended)
```typescript
import {
  HelmetCustomizer,
  ColorSelector,
  MaterialFinishSelector,
  ZoneTabs,
  StepProgressBar,
  StepNavigationButtons,
  Tooltip
} from '@/app/components';
```

---

## Component File Structure

All components follow this structure:

```
app/components/
├── HelmetCustomizer.tsx       # Main customizer (315 lines)
├── ColorSelector.tsx          # Color picker (120 lines)
├── MaterialFinishSelector.tsx # Finish grid (95 lines)
├── ZoneTabs.tsx               # Zone tabs (90 lines)
├── StepProgressBar.tsx        # Progress bar (85 lines)
├── StepNavigationButtons.tsx  # Nav buttons (110 lines)
├── GlassInput.tsx             # Input component (75 lines)
├── Tooltip.tsx                # Tooltip (unified) (230 lines)
├── DebugConsole.tsx           # Debug console (140 lines)
├── MaterialTester.tsx         # Material tester (39 lines)
└── index.ts                   # Barrel exports
```

**Total Components:** 10
**Total Lines:** ~1,299

---

## Related Documentation

- [App Architecture](./APP_ARCHITECTURE.md) - Overall application structure
- [Finish Architecture](./FINISH_ARCHITECTURE.md) - Material finish system
- [Materials & Colors Reference](./MATERIALS_COLORS_REFERENCE.md) - Color/material constants

---

**Last Updated:** 2025-01-20
**Component Rename Date:** 2025-01-20
**Components Count:** 10 (down from 11 after Tooltip merge)

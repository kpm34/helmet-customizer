# Helmet Customizer - Application Architecture

**Last Updated:** 2025-01-20

---

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Data Flow](#data-flow)
5. [Core Systems](#core-systems)
6. [3D Pipeline](#3d-pipeline)
7. [State Management](#state-management)
8. [API Routes](#api-routes)
9. [Key Files](#key-files)
10. [Deployment](#deployment)

---

## Overview

The Helmet Customizer is a **Next.js web application** that allows users to customize college football helmets in real-time using a **Spline 3D scene**. Users can modify zone colors, material finishes, and patterns through an interactive UI.

### Core Features
- **5-Zone Customization** (shell, facemask, chinstrap, padding, hardware)
- **14 Material Finishes** (glossy, matte, chrome, brushed, pearl coat, carbon fiber, etc.)
- **Real-time 3D Preview** (Spline integration)
- **Team Presets** (dual-zone color schemes for CFB teams)
- **Export/Share** configurations

---

## Tech Stack

### Frontend
- **Framework:** Next.js 15.0.3 (App Router)
- **UI:** React 18.3.1 + TypeScript 5.9.3
- **Styling:** Tailwind CSS 3.4
- **3D Engine:** Spline (@splinetool/react-spline 4.1.0)
- **3D Library:** Three.js 0.181 (underlying Spline)
- **State:** Zustand 5.0.2 (lightweight state management)
- **Icons:** Lucide React 0.294

### Build & Deploy
- **Package Manager:** pnpm (workspace monorepo)
- **Deployment:** Vercel
- **Cache Busting:** Custom Vercel headers

### 3D Asset Pipeline
- **Modeling:** Blender 4.5
- **Export:** GLB/GLTF format
- **Scene Editor:** Spline (web-based 3D editor)

---

## Project Structure

```
helmet-customizer/
├── app/                          # Next.js App Router
│   ├── components/               # React components
│   │   ├── CustomizationPanel.tsx   # Main UI panel
│   │   ├── CustomizationWizard.tsx  # Step-by-step wizard
│   │   ├── ColorPicker.tsx          # Color selection
│   │   ├── FinishSelector.tsx       # Material finish UI
│   │   ├── ZoneSelector.tsx         # Zone selection UI
│   │   ├── ConsolePanel.tsx         # Debug console
│   │   └── ...
│   ├── hooks/
│   │   └── useConsoleCapture.ts     # Console logging hook
│   ├── api/                      # API routes
│   │   ├── webhook/material/        # Spline webhook handler
│   │   └── test-variables/          # Variable testing endpoint
│   ├── page.tsx                  # Main entry point
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── store/                        # State management
│   └── helmetStore.ts            # Zustand store (config, actions)
│
├── lib/                          # Shared utilities
│   ├── spline-helmet.ts          # Spline/THREE.js API
│   ├── constants.ts              # Centralized config
│   ├── design/                   # Design system
│   │   ├── theme.ts                 # Theme tokens
│   │   ├── tokens.ts                # Design tokens
│   │   └── index.ts
│   └── shared-3d/                # Shared 3D utilities (workspace package)
│       └── src/
│           ├── types/engine.ts
│           ├── utils/color-converter.ts
│           └── presets/materials.ts
│
├── types/                        # TypeScript types
│   └── helmet.ts                 # Helmet types
│
├── public/                       # Static assets
│   ├── scene-v2.splinecode       # Spline scene (3.3MB)
│   ├── helmet.glb                # 3D helmet model (1.5MB)
│   ├── boolean.wasm              # Spline boolean ops
│   ├── draco_decoder.wasm        # Draco compression
│   └── material-previews/        # Symlink to Blender renders
│
├── 3d-assets/                    # 3D source files
│   ├── collected-originals/      # Blender source files
│   │   ├── model_x_3.blend          # Production model (35,747 faces)
│   │   └── ...
│   └── hc_helmet_5zone_organized_v1.glb
│
├── blender/                      # Blender automation
│   ├── assets/                   # Blender scene files
│   ├── scripts/                  # Python automation scripts
│   ├── output/previews/          # Rendered material previews
│   └── docs/                     # Blender documentation
│
├── docs/                         # Documentation
│   ├── index.html                # Browser-based docs viewer
│   ├── structure.json            # Docs navigation config
│   ├── architecture/             # Architecture docs
│   ├── guides/                   # Implementation guides
│   └── api-reference/            # API documentation
│
├── scripts/                      # Utility scripts
│   ├── webhook-to-blender.ts     # Webhook → Blender bridge
│   ├── test-webhook.sh           # Webhook testing
│   └── deploy.sh                 # Deployment script
│
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── vercel.json                   # Vercel deployment config
└── package.json                  # Dependencies
```

---

## Data Flow

### User Interaction Flow

```
User clicks color/finish
        ↓
  UI Component (ColorPicker/FinishSelector)
        ↓
  Zustand Store Action (setZoneColor/setZoneFinish)
        ↓
  Store State Updated
        ↓
  useEffect in page.tsx detects change
        ↓
  spline-helmet.ts API called
        ↓
  Direct THREE.js material manipulation
        ↓
  Spline scene updates in real-time
```

### State Sync Pattern

```typescript
// 1. User action updates Zustand store
setZoneColor('shell', '#FF0000');

// 2. useEffect detects config change
useEffect(() => {
  if (!splineRef.current || !helmetLoaded) return;

  // 3. Sync all zones to Spline
  Object.entries(config).forEach(([zone, zoneConfig]) => {
    changeZoneColorDirect(splineRef.current!, zone, zoneConfig.color);
    applyZoneFinishDirect(splineRef.current!, zone, zoneConfig.finish);
  });
}, [config, helmetLoaded]);
```

---

## Core Systems

### 1. State Management (Zustand)

**File:** `store/helmetStore.ts`

**State Shape:**
```typescript
interface HelmetState {
  config: HelmetConfig;           // Zone configurations
  activeZone: HelmetZone;         // Currently selected zone
  pattern: PatternConfig;         // Pattern settings
  // Actions
  setZoneColor: (zone, color) => void;
  setZoneFinish: (zone, finish) => void;
  setActiveZone: (zone) => void;
  // Utilities
  getZoneConfig: (zone) => ZoneConfig;
  getFinishProperties: (finish) => FinishProperties;
}
```

**Key Features:**
- Single source of truth for helmet configuration
- Immutable updates (React best practices)
- Utility getters for computed values
- Reset/load configuration actions

---

### 2. Spline Integration

**File:** `lib/spline-helmet.ts`

**Architecture:**
```
Spline Runtime (@splinetool/react-spline)
        ↓
  Application object
        ↓
  THREE.js Scene (accessed directly)
        ↓
  Zone Objects (Shell_Combined, Facemask_Combined, etc.)
        ↓
  THREE.js Materials (MeshStandardMaterial)
        ↓
  Material Properties (color, metalness, roughness)
```

**Key Functions:**
- `getThreeScene()` - Access underlying THREE.js scene
- `findZoneObjectsDirect()` - Find zone meshes by name
- `changeZoneColorDirect()` - Update material color
- `applyZoneFinishDirect()` - Update material properties
- `forceHelmetOpacityDirect()` - Ensure 100% opacity
- `startOpacityEnforcement()` - Continuous opacity monitoring

**Zone Name Patterns:**
```typescript
const ZONE_PATTERNS: Record<HelmetZone, string[]> = {
  shell: ['Shell_Combined'],
  facemask: ['Facemask_Combined'],
  chinstrap: ['Chinstrap_Cup', 'Chinstrap_Left', 'Chinstrap_Right'],
  padding: ['UV03_Padding'],
  hardware: ['Hardware_Clips', 'Hardware_Plates', 'Hardware_Screws'],
};
```

---

### 3. Constants System

**File:** `lib/constants.ts`

**Centralized Configuration:**
- Zone definitions and labels
- Material finish presets (14 finishes)
- Camera presets
- Default helmet config
- Validation helpers

**Benefits:**
- Single source of truth
- No duplication across components
- Type-safe constants
- Easy to maintain

---

### 4. Component Architecture

**Main Entry:** `app/page.tsx`

**Component Hierarchy:**
```
<Home>
  ├── <Spline>                        # 3D scene
  ├── <HelmetCustomizer>              # Main customization UI
  │   ├── <StepProgressBar>           # Visual step progress (1-4)
  │   ├── <ZoneTabs>                  # Zone selection tabs
  │   ├── <ColorSelector>             # Color picker with team presets
  │   ├── <MaterialFinishSelector>    # Material finish grid
  │   ├── <GlassInput>                # Styled file input for logos
  │   └── <StepNavigationButtons>     # Next/Previous/Save/Export buttons
  ├── <DebugConsole>                  # Console logging panel
  └── <MaterialTester>                # Quick finish testing tool
```

**Component Patterns:**
- **Controlled Components:** All form inputs controlled by Zustand
- **Hooks:** `useHelmetStore()` for state access
- **TypeScript:** Fully typed props and state
- **Tailwind:** Utility-first styling

---

## 3D Pipeline

### Asset Creation Flow

```
Blender 4.5
  ↓
  Model helmet with 5 zones
  ↓
  Export to GLB (with materials)
  ↓
  Import GLB to Spline Editor
  ↓
  Configure materials/lighting in Spline
  ↓
  Export to .splinecode
  ↓
  Deploy to public/scene-v2.splinecode
```

### Current 3D Assets

**Production Models:**
1. **model_x_3.blend** (35,747 faces)
   - Material-based reorganization
   - Clean 5-zone structure
   - Single material per zone
   - Location: `3d-assets/collected-originals/`

2. **hc_helmet_5zone_organized_v1.blend**
   - Perfectly organized zones
   - Physically accurate grouping
   - Location: `blender/assets/`

**Exported Assets:**
- `public/helmet.glb` (1.5MB) - Current production model
- `public/scene-v2.splinecode` (3.3MB) - Spline scene with helmet

---

## State Management

### Zustand Store Design

**Why Zustand?**
- Lightweight (< 1KB)
- No boilerplate (unlike Redux)
- React hooks-based
- TypeScript-friendly
- Perfect for simple state

**Store Structure:**
```typescript
// State
config: {
  shell: { color: '#FFFFFF', finish: 'glossy' },
  facemask: { color: '#7F7F7F', finish: 'brushed' },
  chinstrap: { color: '#1C1C1C', finish: 'matte' },
  padding: { color: '#333333', finish: 'matte' },
  hardware: { color: '#C0C0C0', finish: 'chrome' }
}

// Active zone for UI
activeZone: 'shell'

// Pattern system (future)
pattern: { type: 'none', intensity: 0.5, applyToZones: [] }
```

**Usage Example:**
```typescript
// In component
const { config, setZoneColor, activeZone } = useHelmetStore();

// Update color
<ColorPicker
  color={config[activeZone].color}
  onChange={(color) => setZoneColor(activeZone, color)}
/>
```

---

## API Routes

### 1. Material Webhook (`/api/webhook/material`)

**Purpose:** Receive material change requests from external sources (n8n, webhooks)

**Method:** POST

**Payload:**
```json
{
  "zone": "shell",
  "color": "#FF0000",
  "finish": "chrome"
}
```

**Response:**
```json
{
  "success": true,
  "zone": "shell",
  "color": "#FF0000",
  "finish": "chrome"
}
```

**File:** `app/api/webhook/material/route.ts`

---

### 2. Variable Testing (`/api/test-variables`)

**Purpose:** Test Spline variable manipulation

**Method:** POST

**Payload:**
```json
{
  "variable": "shellFinish",
  "value": 2
}
```

**File:** `app/api/test-variables/route.ts`

---

## Key Files

### Application Entry Points

| File | Purpose | Key Responsibilities |
|------|---------|---------------------|
| `app/page.tsx` | Main page | Spline loading, scene setup, state sync |
| `app/layout.tsx` | Root layout | HTML structure, metadata |
| `app/globals.css` | Global styles | Tailwind directives, custom CSS |

### State & Logic

| File | Purpose | Key Exports |
|------|---------|------------|
| `store/helmetStore.ts` | Zustand store | `useHelmetStore` hook |
| `lib/spline-helmet.ts` | Spline API | Color/finish manipulation functions |
| `lib/constants.ts` | Constants | `FINISH_PRESETS`, `ZONE_LABELS`, etc. |
| `types/helmet.ts` | TypeScript types | `HelmetZone`, `MaterialFinish`, etc. |

### UI Components

| Component | Purpose | Props |
|-----------|---------|-------|
| `HelmetCustomizer` | Main customization panel | None (uses store) |
| `ColorSelector` | Color selection with team presets | `value`, `onChange`, `onTeamPresetClick` |
| `MaterialFinishSelector` | Material finish grid | `value`, `onChange` |
| `ZoneTabs` | Zone selection tabs | `activeZone`, `onZoneChange`, `currentStep` |
| `StepProgressBar` | Visual step indicator | `currentStep`, `completedSteps` |
| `StepNavigationButtons` | Wizard navigation | `currentStep`, `onNext`, `onPrevious`, `onSave`, `onExport` |
| `GlassInput` | Styled file input | `type`, `placeholder`, `accept`, `onSubmit` |
| `DebugConsole` | Debug console logging | None |
| `MaterialTester` | Quick finish testing | `splineApp` |
| `Tooltip` | Unified tooltip | `content`, `position`, `enhanced`, `delay` |

---

## Deployment

### Vercel Configuration

**File:** `vercel.json`

**Cache Busting:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

**Purpose:** Prevent aggressive browser caching of Spline scenes

### Build Process

```bash
# Install dependencies
pnpm install

# Build Next.js app
pnpm build

# Deploy to Vercel
vercel --prod
```

### Environment Variables

**Production:**
- Managed in Vercel dashboard
- No sensitive keys currently needed

**Local Development:**
- Use `.env.local` for overrides
- API keys for future integrations

---

## Material Finish System

### Current Finishes (14 total)

**Basic Finishes:**
1. **Glossy** - Shiny plastic (metalness: 0.0, roughness: 0.1)
2. **Matte** - Flat plastic (metalness: 0.0, roughness: 0.8)
3. **Chrome** - Mirror finish (metalness: 1.0, roughness: 0.05)
4. **Brushed** - Brushed metal (metalness: 0.9, roughness: 0.35)
5. **Satin** - Soft sheen (metalness: 0.1, roughness: 0.5)

**Automotive Finishes:**
6. **Pearl Coat** - Pearl effect (metalness: 0.7, roughness: 0.2)
7. **Satin Auto** - Automotive satin (metalness: 0.3, roughness: 0.6)
8. **Metallic Flake** - Metallic flake paint (metalness: 0.8, roughness: 0.25)
9. **Wet Clear Coat** - Wet paint look (metalness: 0.1, roughness: 0.05)

**Metal Finishes:**
10. **Anodized Metal** - Anodized finish (metalness: 0.95, roughness: 0.15)
11. **Brushed Titanium** - Titanium texture (metalness: 0.9, roughness: 0.35)
12. **Weathered Metal** - Aged metal (metalness: 0.7, roughness: 0.65)

**Special Finishes:**
13. **Carbon Fiber** - Carbon weave (metalness: 0.4, roughness: 0.3)
14. **Rubberized Soft Touch** - Rubber texture (metalness: 0.0, roughness: 0.9)

### Finish Implementation

**Storage:**
```typescript
// lib/constants.ts
export const FINISH_PRESETS: Record<MaterialFinish, FinishProperties> = {
  glossy: { name: 'Glossy Plastic', metalness: 0.0, roughness: 0.1 },
  chrome: { name: 'Chrome Mirror', metalness: 1.0, roughness: 0.05 },
  // ... etc
};
```

**Application:**
```typescript
// lib/spline-helmet.ts
export function applyZoneFinishDirect(
  spline: Application,
  zone: HelmetZone,
  finish: MaterialFinish
): boolean {
  const props = FINISH_PRESETS[finish];
  // Apply metalness and roughness to THREE.js material
  material.metalness = props.metalness;
  material.roughness = props.roughness;
}
```

---

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading:** Spline scene loads asynchronously
2. **Code Splitting:** Next.js automatic code splitting
3. **State Updates:** Batched via Zustand
4. **Three.js Access:** Direct material access (no wrapper overhead)
5. **WASM Support:** Draco compression for 3D assets

### Bundle Sizes

- **Spline Scene:** 3.3MB (compressed)
- **Helmet GLB:** 1.5MB (Draco compressed)
- **Total JS:** ~400KB (Next.js + React + Spline runtime)

---

## Future Enhancements

### Planned Features

1. **Team Presets**
   - CFB team color schemes
   - Dual-zone color application
   - Quick team selector

2. **Pattern System**
   - Stripe patterns (tiger, chevron, etc.)
   - Camo patterns
   - Decal support

3. **Export/Share**
   - Save configurations
   - Share via URL
   - Download renders

4. **Material Previews**
   - Rendered thumbnails for each finish
   - Before/after comparisons

5. **Advanced Lighting**
   - Multiple lighting presets
   - Environment map selection

---

## Development Guidelines

### Code Style

- **TypeScript:** Strict mode enabled
- **Naming:** camelCase for variables, PascalCase for components
- **File Structure:** Feature-based organization
- **Comments:** JSDoc for public APIs

### State Management Rules

1. **Single Store:** Use one Zustand store for helmet config
2. **Immutable Updates:** Never mutate state directly
3. **Computed Values:** Use selectors for derived state
4. **Actions:** Keep actions simple and focused

### Component Guidelines

1. **Separation of Concerns:** UI vs logic
2. **Props:** Prefer controlled components
3. **TypeScript:** Type all props
4. **Hooks:** Extract reusable logic to custom hooks

---

## Troubleshooting

### Common Issues

**Issue:** Spline scene not loading
- **Solution:** Check `public/scene-v2.splinecode` exists
- **Solution:** Clear browser cache (cache busting issue)

**Issue:** Color changes not applying
- **Solution:** Verify zone name patterns in `ZONE_PATTERNS`
- **Solution:** Check THREE.js scene access in console

**Issue:** Material finish not working
- **Solution:** Ensure Spline variables are configured
- **Solution:** Check metalness/roughness values in `FINISH_PRESETS`

**Issue:** TypeScript errors
- **Solution:** Run `pnpm install` to sync types
- **Solution:** Check `types/helmet.ts` for type definitions

---

## Documentation Links

- [Finish Architecture](./FINISH_ARCHITECTURE.md)
- [Materials & Colors Reference](./MATERIALS_COLORS_REFERENCE.md)
- [Spline Runtime API](../api-reference/SPLINE_RUNTIME_API.md)
- [Deployment Guide](../guides/DEPLOYMENT.md)
- [Setup Guide](../guides/SETUP_GUIDE.md)

---

**Last Updated:** 2025-01-20
**Version:** 0.1.1
**Maintainer:** Helmet Customizer Team

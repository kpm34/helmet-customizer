# Helmet Customizer

**Real-time 3D helmet customization system** for College Football Fantasy with 5-zone vertex color system, material finishes, and Spline Runtime integration.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.0.4-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Spline](https://img.shields.io/badge/Spline-Runtime-purple.svg)

## 🎯 Overview

The Helmet Customizer allows users to customize football helmets in real-time with:

- **5 Customizable Zones**: Shell, Facemask, Chinstrap, Padding, Hardware
- **Material Finishes**: Glossy, Matte, Chrome, Brushed Metal, Satin
- **Real-time 3D Preview**: Using Spline Runtime + THREE.js direct manipulation
- **Export to GLB**: For use in other applications
- **Responsive UI**: Built with Next.js 15 and React

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (tested with Node 20)
- pnpm 8+ (package manager)
- Blender 4.5+ (for asset creation)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your KERNEL_API_KEY

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the customizer.

### Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
helmet-customizer/
├── app/                          # Next.js app directory
│   ├── components/              # React components
│   │   ├── CustomizationPanel.tsx    # Main customization UI
│   │   ├── CustomizationWizard.tsx   # Step-by-step wizard
│   │   ├── ZoneSelector.tsx          # Zone selection UI
│   │   ├── ConsolePanel.tsx          # Debug console
│   │   └── design system/            # UI components (Tooltip, etc.)
│   ├── hooks/                   # Custom React hooks
│   │   └── useConsoleCapture.ts      # Console capture for debugging
│   └── page.tsx                 # Main app page
│
├── lib/                         # Core libraries
│   ├── spline-helmet.ts        # Helmet manipulation (THREE.js + Spline)
│   ├── constants.ts            # Centralized configuration
│   └── design/                 # Design system tokens
│
├── store/                       # State management
│   └── helmetStore.ts          # Zustand store for helmet config
│
├── public/                      # Static assets
│   ├── helmet.glb              # Helmet 3D model (1.5MB)
│   └── scene.splinecode        # Spline scene file
│
├── scripts/                     # Automation scripts
│   ├── blender/                # Blender automation
│   └── test-webhook.sh         # Testing utilities
│
├── assets/                      # Source assets (gitignored)
│   └── blender/                # Blender source files
│
└── output/                      # Generated exports (gitignored)
    └── exports/                # GLB exports
```

## 🎨 Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **3D Engine**: Spline Runtime + THREE.js (direct material access)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

### Key Design Decisions

1. **Hybrid Spline + THREE.js Approach**
   - Uses Spline Runtime for scene loading
   - Direct THREE.js material access for reliable color/finish control
   - Eliminates opacity/transparency issues with Spline wrapper

2. **5-Zone Vertex Color System**
   - Each helmet zone has unique vertex colors in Blender
   - Allows selective material application per zone
   - Enables real-time color/finish changes

3. **Centralized Constants**
   - All configuration in `lib/constants.ts`
   - Eliminates code duplication
   - Single source of truth for zones, finishes, etc.

## 🛠️ Development

### Key Components

#### CustomizationPanel
Main UI for helmet customization with zone selection, color picker, and finish selector.

```typescript
import { CustomizationPanel } from '@/app/components/CustomizationPanel';

<CustomizationPanel />
```

#### Helmet Manipulation Functions

```typescript
import {
  changeZoneColorDirect,
  applyZoneFinishDirect,
  setVariable,
  getVariable,
} from '@/lib/spline-helmet';

// Change zone color
changeZoneColorDirect(spline, 'shell', '#FF0000');

// Apply material finish
applyZoneFinishDirect(spline, 'facemask', 'chrome');

// Set/get Spline variables
setVariable(spline, 'testVar', 50);
const value = getVariable(spline, 'testVar');
```

### State Management

The app uses Zustand for state management with the following structure:

```typescript
// lib/store/helmetStore.ts
interface HelmetState {
  config: Record<HelmetZone, ZoneConfig>;
  updateZoneColor: (zone: HelmetZone, color: string) => void;
  updateZoneFinish: (zone: HelmetZone, finish: MaterialFinish) => void;
  resetZone: (zone: HelmetZone) => void;
  resetAll: () => void;
}
```

### Configuration

All zones and finishes are configured in `lib/constants.ts`:

```typescript
// Zone configuration
export const ZONES_CONFIG = [
  { id: 'shell', label: 'Shell', description: 'Main helmet shell body' },
  { id: 'facemask', label: 'Facemask', description: 'Face protection bars' },
  // ... more zones
];

// Material finish presets
export const FINISH_PRESETS = {
  glossy: { metalness: 0.0, roughness: 0.1 },
  matte: { metalness: 0.0, roughness: 0.8 },
  chrome: { metalness: 1.0, roughness: 0.05 },
  // ... more finishes
};
```

## 📚 Documentation

- **[BLENDER_MCP_GUIDE.md](./BLENDER_MCP_GUIDE.md)** - Blender integration and MCP setup
- **[SPLINE_RUNTIME_API.md](./SPLINE_RUNTIME_API.md)** - Complete Spline Runtime API reference
- **[SPLINE_SCENE_HIERARCHY.md](./SPLINE_SCENE_HIERARCHY.md)** - Scene structure and object naming
- **[DEPLOYMENT_v2.md](./DEPLOYMENT_v2.md)** - Deployment guide (Vercel)
- **[TEST_PRODUCTION.md](./TEST_PRODUCTION.md)** - Testing and QA procedures
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Initial setup instructions
- **[scripts/README.md](./scripts/README.md)** - Automation scripts documentation

## 🧪 Testing

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Test webhook integration
./scripts/test-webhook.sh
```

## 🚢 Deployment

The app is deployed on Vercel:

```bash
# Deploy to production
pnpm deploy

# Or use Vercel CLI
vercel --prod
```

See [DEPLOYMENT_v2.md](./DEPLOYMENT_v2.md) for detailed deployment instructions.

## 🔧 Troubleshooting

### Common Issues

**Issue: Helmet appears transparent or invisible**
- **Solution**: The app automatically forces 100% opacity on load. Check console for opacity enforcement logs.

**Issue: Color changes don't apply**
- **Solution**: Ensure Spline scene is fully loaded (`helmetLoaded === true`). Check object names match `ZONE_PATTERNS` in `lib/spline-helmet.ts`.

**Issue: Build fails with TypeScript errors**
- **Solution**: Run `pnpm type-check` to see detailed errors. Ensure all dependencies are installed.

### Debug Mode

Enable console panel in the app (bottom-right toggle) to see:
- Spline variable tests
- Zone object detection
- Material property changes
- THREE.js scene access logs

## 📝 API Reference

### Core Functions

#### `changeZoneColorDirect(spline, zone, color)`
Change the color of a specific helmet zone using direct THREE.js material access.

**Parameters:**
- `spline`: Spline Application instance
- `zone`: HelmetZone ('shell' | 'facemask' | 'chinstrap' | 'padding' | 'hardware')
- `color`: Hex color string (e.g., '#FF0000')

**Returns:** `boolean` - Success status

---

#### `applyZoneFinishDirect(spline, zone, finish)`
Apply material finish to a specific zone.

**Parameters:**
- `spline`: Spline Application instance
- `zone`: HelmetZone
- `finish`: MaterialFinish ('glossy' | 'matte' | 'chrome' | 'brushed' | 'satin')

**Returns:** `boolean` - Success status

---

#### `setVariable(spline, variableName, value)`
Set a Spline variable value for animations/interactions.

**Parameters:**
- `spline`: Spline Application instance
- `variableName`: Variable name (string)
- `value`: Variable value (string | number | boolean)

---

#### `getVariable(spline, variableName)`
Get current value of a Spline variable.

**Parameters:**
- `spline`: Spline Application instance
- `variableName`: Variable name (string)

**Returns:** `any` - Variable value

## 🤝 Contributing

This project is part of the College Football Fantasy platform. For contribution guidelines, see the main repository.

## 📄 License

Proprietary - All rights reserved

## 🔗 Related Projects

- **Blender-Workspace**: Central 3D automation hub with Blender scripts
- **College Football Fantasy App v2**: Main Next.js application

## 📞 Support

For issues or questions:
1. Check the [documentation files](#-documentation)
2. Review the [troubleshooting section](#-troubleshooting)
3. Enable debug mode and check console logs

---

**Built with** ❤️ **using Next.js, Spline, THREE.js, and Blender**

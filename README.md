# Helmet Customizer - React Three Fiber

Self-hosted GLB approach using React Three Fiber.

## Approach

- **3D Library**: React Three Fiber (@react-three/fiber)
- **Helpers**: @react-three/drei
- **Model Format**: Standard GLB/GLTF files
- **Port**: 3002 (to avoid conflict with main Spline app on 3000)

## Benefits

- No proprietary formats (.splinecode)
- Direct access to THREE.js materials
- Standard web 3D format (GLB)
- Full control over rendering
- Better performance for runtime material changes

## Setup

```bash
pnpm install
pnpm dev
```

Visit: `http://localhost:3002`

## Architecture

```
helmet-customizer-r3f/
├── app/
│   ├── page.tsx           # Main R3F viewer
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── public/
│   └── models/            # GLB files
│       ├── 03_material-showcase_glossy.glb
│       ├── 03_material-showcase_chrome.glb
│       └── 03_material-showcase_brushed.glb
└── package.json           # React 19 + R3F 8.17
```

## Comparison with Spline

| Feature | Spline Runtime | React Three Fiber |
|---------|---------------|-------------------|
| Format | .splinecode (proprietary) | .glb (standard) |
| Material Control | Limited by Spline API | Full THREE.js access |
| Bundle Size | Larger (Spline + THREE.js) | Smaller (just THREE.js) |
| Learning Curve | Spline-specific API | Standard THREE.js |
| Export Workflow | Spline → .splinecode | Blender → GLB |

## Next Steps

1. Add color customization UI
2. Implement material finish selector
3. Add zone-based customization
4. Integrate with shared components library

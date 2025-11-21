# Helmet Customizer R3F - Quickstart

## What is this?

This is an **isolated React Three Fiber app** for testing the self-hosted GLB approach to helmet customization. It runs on **port 3002** to avoid conflicts with the main Spline app on port 3000.

## Why separate apps?

- Safe testing without breaking the working Spline app
- Different dependency versions (Next.js 14 vs 15)
- Easy side-by-side comparison
- Can deploy either or both

## Running the app

```bash
cd /Users/kashyapmaheshwari/Blender-Workspace/projects/helmet-customizer-r3f
pnpm dev
```

Visit: **http://localhost:3002**

## What you'll see

- **Left**: 3D helmet viewer with orbit controls
- **Right**: Material preset buttons (Glossy, Chrome, Brushed)
- **Interaction**: Mouse to rotate, scroll to zoom

## Current features

✅ GLB model loading
✅ Material preview (3 presets)
✅ Orbit controls
✅ Studio lighting environment
✅ Responsive layout

## Next steps

1. ✅ Verify materials look good
2. Add color picker UI
3. Add finish selector
4. Add zone selection
5. Implement real-time material updates

## Tech stack

- **Next.js**: 14.2.3 (stable with R3F)
- **React**: 18.2.0 (compatible)
- **@react-three/fiber**: 8.15.0
- **@react-three/drei**: 9.100.0
- **three**: 0.170.0

## File structure

```
helmet-customizer-r3f/
├── app/
│   ├── page.tsx         # Main R3F viewer
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Tailwind styles
├── public/
│   └── models/          # GLB files (3 showcases)
├── package.json         # Dependencies
└── README.md            # Full docs
```

## Comparing with Spline app

| App | Port | Format | Status |
|-----|------|--------|--------|
| Spline | 3000 | .splinecode | ✅ Working |
| R3F | 3002 | .glb | ✅ Ready to test |

## Troubleshooting

**Port conflict**: R3F uses 3002, Spline uses 3000 - no conflicts

**Build errors**: We use Next.js 14.2.3 (not 15) for R3F compatibility

**Missing models**: GLB files are in `/public/models/` (copied from Spline app)

---

**Status**: ✅ Ready for testing
**Last Updated**: 2025-11-20

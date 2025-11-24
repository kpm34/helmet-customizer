# Material Preview System - Complete Guide

## 🎯 Overview

This system renders high-quality material previews using **Blender's native rendering engine**, completely bypassing Spline. You get beautiful, photorealistic previews that load instantly and work offline.

### What You Get

- ✅ **15 Premium Finishes** - From pearl coat to carbon fiber
- ✅ **9 Color Options** - Full spectrum coverage
- ✅ **135 Total Previews** - All combinations pre-rendered
- ✅ **1024×1024 Resolution** - High-quality images
- ✅ **Transparent Backgrounds** - Perfect for web overlays
- ✅ **Categorized UI** - Easy material selection

---

## 📁 File Structure

```
helmet-customizer/
├── scripts/
│   ├── setup_and_render.py              # 1️⃣ START HERE - Import OBJ and test
│   ├── render_premium_material_previews.py  # 2️⃣ Render all 135 previews
│   └── RENDER_INSTRUCTIONS.md           # Detailed render guide
├── app/
│   └── components/
│       └── PremiumMaterialSelector.tsx  # 3️⃣ Use in your UI
├── store/
│   └── helmetStore.ts                   # Updated with all finish types
└── public/
    └── material-previews/               # Output directory
        ├── glossy_red.png
        ├── pearl_coat_gold.png
        ├── carbon_fiber_black.png
        ├── ...
        └── manifest.json                # Metadata
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Test Render (2 minutes)

Open Blender and run the quick test:

```bash
# Open Blender
open -a Blender

# In Blender:
# 1. Scripting tab
# 2. Open: scripts/setup_and_render.py
# 3. Click "Run Script" ▶️
```

**What happens:**
- ✅ Imports your Final_Helmet.obj
- ✅ Sets up studio lighting
- ✅ Positions camera
- ✅ Renders 1 test image (Chrome/Gold)
- ✅ Saves to `public/material-previews/test_chrome_gold.png`

**Check the result** - If it looks good, proceed to Step 2!

### Step 2: Render All Previews (30-60 minutes)

Run the full preview generator:

```bash
# Option A: In Blender UI (recommended for first time)
# 1. Open scripts/render_premium_material_previews.py
# 2. Run Script ▶️

# Option B: Command line (faster, background)
/Users/postgres/Blender.app/Contents/MacOS/Blender \
  /Users/kashyapmaheshwari/projects/helmet-customizer/Final_Helmet.obj \
  --background \
  --python scripts/render_premium_material_previews.py
```

**What happens:**
- 🎨 Renders 15 finishes × 9 colors = **135 previews**
- 📊 Progress updates in console
- 💾 Saves all images to `public/material-previews/`
- 📄 Generates `manifest.json` with metadata

**Estimated time:** ~20-40 seconds per image = **45-90 minutes total**

### Step 3: Integrate into Your App

Import the premium material selector:

```tsx
// In your customization panel
import { PremiumMaterialSelector } from '@/app/components/PremiumMaterialSelector';
import { useHelmetStore } from '@/store/helmetStore';

export function CustomizationPanel() {
  const { config, setZoneColor, setZoneFinish, activeZone } = useHelmetStore();

  return (
    <div>
      {/* Your existing zone selector */}
      <ZoneSelector />

      {/* NEW: Premium material selector */}
      <PremiumMaterialSelector
        selectedFinish={config[activeZone].finish}
        selectedColor={config[activeZone].color}
        onFinishSelect={(finish) => setZoneFinish(activeZone, finish)}
        onColorSelect={(color) => setZoneColor(activeZone, color)}
      />
    </div>
  );
}
```

---

## 🎨 Available Finishes

### Basic Finishes (2)
- **Glossy** - Classic high-gloss plastic
- **Matte** - Non-reflective flat surface

### Automotive Premium (4) 🏆
- **Pearl Coat** ⭐ - Iridescent car-paint style with soft color shift
- **Satin Automotive** ⭐ - Premium wrap finish, no-glare but rich
- **Metallic Flake** ⭐ - Classic sparkle with reflective flakes (Ohio State style)
- **Wet Clear Coat** - Freshly waxed, full specular look

### Metal Finishes (4)
- **Chrome** - Mirror-like polished metal
- **Anodized Metal** ⭐ - Colored engineered metal, tough look
- **Brushed Titanium** ⭐ - Industrial elite engineering vibe
- **Weathered Metal** - Patina finish for themed alternates

### Modern & Tactical (3)
- **Carbon Fiber** ⭐ - High-tech woven pattern
- **Rubberized Soft-Touch** - Tactical stealth, less reflective
- **Ceramic Gloss** ⭐ - Ultra-premium clean (Apple-ish)

### Special Effects (2)
- **Frosted Polycarbonate** - Translucent futuristic look
- **Holographic Foil** ⭐ - Color-shifting refractive finish

⭐ = Featured/Premium finishes

---

## 🎨 Available Colors

- Red (`#FF0000`)
- Blue (`#0000FF`)
- Gold (`#FFD700`)
- Green (`#00FF00`)
- White (`#FFFFFF`)
- Black (`#000000`)
- Orange (`#FF6B35`)
- Purple (`#8B00FF`)
- Cyan (`#00CED1`)

---

## ⚙️ Customization

### Adjust Render Quality

Edit `render_premium_material_previews.py`:

```python
# Lower quality (faster testing)
RENDER_SAMPLES = 64      # Default: 256
RENDER_WIDTH = 512       # Default: 1024
RENDER_HEIGHT = 512      # Default: 1024

# Ultra quality (final production)
RENDER_SAMPLES = 512     # Slower but perfect
```

### Add Custom Colors

```python
PREVIEW_COLORS = [
    # ... existing colors
    ("#1E90FF", "dodger_blue", "Dodger Blue"),
    ("#FF1493", "hot_pink", "Hot Pink"),
]
```

### Modify Material Properties

```python
FINISH_PRESETS = {
    "pearl_coat": {
        "name": "Pearl Coat",
        "metalness": 0.1,
        "roughness": 0.25,      # Adjust shininess
        "clearcoat": 1.0,       # Adjust clear coat
        "anisotropic": 0.2,     # Adjust directional highlights
    },
}
```

### Adjust Lighting

In `setup_studio_lighting()`:

```python
# Brighter previews
key_light.data.energy = 600  # Increase from 400

# Darker/moodier
key_light.data.energy = 250  # Decrease from 400
```

---

## 📊 Performance

### Render Times (per image)

| Samples | Quality | Time/Image | Total (135 images) |
|---------|---------|------------|-------------------|
| 64      | Low     | ~15s       | ~34 mins          |
| 128     | Medium  | ~25s       | ~56 mins          |
| 256     | High    | ~40s       | ~90 mins          |
| 512     | Ultra   | ~80s       | ~180 mins         |

**Note:** GPU rendering is 5-10× faster than CPU

### Optimize for Speed

1. **Use GPU** (automatic if available)
2. **Lower samples** for testing (64-128)
3. **Reduce resolution** for testing (512×512)
4. **Background mode** (no UI overhead)

---

## 🎯 UI Features

### Categorized Selection
Finishes are organized into collapsible categories:
- Basic Finishes
- Automotive Premium
- Metal Finishes
- Modern & Tactical
- Special Effects

### Live Preview
- Color swatches with checkmarks
- Real-time material preview updates
- Featured "PRO" badges on premium finishes
- Loading spinners while images load

### Selection Summary
Shows current selection with:
- Color swatch
- Finish name
- Description
- Render quality info (from manifest)

---

## 🔧 Troubleshooting

### Problem: "OBJ file not found"

**Solution:** Update path in `setup_and_render.py`:
```python
OBJ_PATH = Path("/your/actual/path/to/Final_Helmet.obj")
```

### Problem: Renders are all black

**Solutions:**
1. Check if helmet imported correctly (check console output)
2. Increase light intensity
3. Check camera position
4. Verify materials are being applied

### Problem: Out of memory

**Solutions:**
1. Switch to CPU rendering: `scene.cycles.device = 'CPU'`
2. Lower samples: `RENDER_SAMPLES = 64`
3. Reduce resolution: `RENDER_WIDTH = 512`
4. Close other applications

### Problem: Images not loading in app

**Solutions:**
1. Check images exist in `public/material-previews/`
2. Verify `manifest.json` was generated
3. Check browser console for 404 errors
4. Try hard refresh (Cmd+Shift+R)

---

## 📦 Deployment

### Include Previews in Build

Add to `.gitignore` if too large:
```gitignore
# Exclude preview images (too large for git)
public/material-previews/*.png

# But keep manifest
!public/material-previews/manifest.json
```

### Host on CDN (Optional)

For better performance:
1. Upload all PNGs to CDN (Cloudflare, AWS S3, etc.)
2. Update `manifest.json` with CDN URLs
3. Update `PremiumMaterialSelector` to use CDN paths

---

## 🎓 Advanced Usage

### Batch Multiple Helmet Models

```python
HELMET_MODELS = [
    "Final_Helmet.obj",
    "Helmet_Variant_Wide.obj",
    "Helmet_Vintage.obj",
]

for model_path in HELMET_MODELS:
    # Import, setup, render...
```

### Custom Camera Angles

For multiple views (front, side, 3/4):

```python
CAMERA_ANGLES = {
    'front': (0, -6, 1.8, (math.radians(82), 0, 0)),
    'side': (6, 0, 1.8, (math.radians(82), 0, math.radians(90))),
    'three_quarter': (4, -4, 2, (math.radians(75), 0, math.radians(45))),
}

for angle_name, (x, y, z, rotation) in CAMERA_ANGLES.items():
    camera.location = (x, y, z)
    camera.rotation_euler = rotation
    render_preview(f"{finish}_{color}_{angle_name}.png")
```

### Animation/Turntable

Render 360° rotation:

```python
for frame in range(36):  # 36 frames = 10° steps
    angle = math.radians(frame * 10)
    camera.location = (
        math.sin(angle) * 6,
        -math.cos(angle) * 6,
        1.8
    )
    camera.rotation_euler = (math.radians(82), 0, angle + math.radians(90))
    render_preview(f"{finish}_{color}_frame_{frame:03d}.png")
```

---

## ✅ Final Checklist

Before going live:

- [ ] Test render looks good
- [ ] All 135 previews rendered successfully
- [ ] `manifest.json` generated
- [ ] Images in `public/material-previews/`
- [ ] `PremiumMaterialSelector` integrated
- [ ] Store types updated with all finishes
- [ ] Test material switching in dev mode
- [ ] Check loading performance
- [ ] Verify on mobile/tablet
- [ ] Test with different colors

---

## 🎉 Benefits Over Spline

| Feature | Blender Renders | Spline |
|---------|----------------|--------|
| **Load time** | Instant (cached images) | 3-5s (scene load) |
| **Offline** | ✅ Works offline | ❌ Requires connection |
| **Quality** | ✅ Photorealistic | ⚠️ Real-time limits |
| **Customization** | ✅ Full control | ⚠️ Limited |
| **Performance** | ✅ Lightweight | ⚠️ Heavy 3D viewer |
| **Mobile** | ✅ Perfect | ⚠️ Can be slow |
| **Version control** | ✅ PNG in git | ⚠️ Binary scenes |

---

## 🚀 Next Steps

1. ✅ Run test render
2. ✅ Check test image quality
3. ✅ Adjust lighting/quality if needed
4. ✅ Run full preview generation
5. ✅ Integrate `PremiumMaterialSelector`
6. ✅ Test in development
7. ✅ Deploy to production
8. 🎉 Enjoy beautiful material previews!

---

## 📞 Need Help?

Common issues are covered in [RENDER_INSTRUCTIONS.md](./scripts/RENDER_INSTRUCTIONS.md)

For script customization, see inline comments in:
- `setup_and_render.py` - Quick test setup
- `render_premium_material_previews.py` - Full render system

---

**Your material preview system is ready! 🎨✨**

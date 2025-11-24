# Material Preview Rendering Instructions

This guide shows you how to render high-quality material previews using Blender's native rendering engine, completely bypassing Spline.

## 🎯 What This Does

The `render_material_previews.py` script will:
- ✅ Render your helmet with 4 different material finishes (Glossy, Matte, Metallic, Chrome)
- ✅ Create previews in 6 different colors (Red, Blue, Gold, Green, White, Black)
- ✅ Set up professional studio lighting automatically
- ✅ Generate 24 total preview images (4 finishes × 6 colors)
- ✅ Export images ready for web app integration
- ✅ Create a JSON manifest for easy loading

## 📋 Prerequisites

1. **Blender 4.5** installed at `/Users/postgres/Blender.app`
2. **Your helmet blend file** (Final_Helmet-Blend.blend or helmet_v2_base.blend)
3. Python script: `scripts/render_material_previews.py`

## 🚀 Method 1: Run Inside Blender (Recommended for Testing)

### Step 1: Open Blender
```bash
open -a Blender
```

### Step 2: Load Your Helmet File
1. File → Open
2. Navigate to: `assets/blender/Final_Helmet-Blend.blend`
   (or wherever your helmet file is)
3. Open the file

### Step 3: Open Scripting Workspace
1. At the top of Blender, click **"Scripting"** tab
2. This opens the text editor and Python console

### Step 4: Load the Script
1. Click **"Open"** in the text editor
2. Navigate to: `scripts/render_material_previews.py`
3. Click "Open Text"

### Step 5: Run the Script
1. Click **"Run Script"** button (▶️ icon) or press `Alt + P`
2. Watch the console for progress updates

### Step 6: Monitor Progress
You'll see output like:
```
============================================================
HELMET MATERIAL PREVIEW RENDERER
============================================================
✅ Scene configured: 800x800, 128 samples
✅ Studio lighting configured
✅ Camera positioned
✅ Found 3 helmet object(s): ['Helmet_Shell', 'Facemask', 'Chinstrap']

============================================================
Rendering Glossy finishes...
============================================================
✅ Applied material 'Preview_glossy_red' to 3 object(s)
🎨 Rendering to public/material-previews/glossy_red.png...
✅ Rendered: public/material-previews/glossy_red.png
...
```

### Step 7: Check Output
Your rendered previews will be in:
```
public/
  └── material-previews/
      ├── glossy_red.png
      ├── glossy_blue.png
      ├── glossy_gold.png
      ├── matte_red.png
      ├── metallic_red.png
      ├── chrome_red.png
      ├── ...
      └── manifest.json
```

## 🤖 Method 2: Run from Command Line (Background Rendering)

For faster, automated rendering without the Blender UI:

```bash
# Navigate to project directory
cd /Users/kashyapmaheshwari/Blender-Workspace/projects/helmet-customizer

# Run Blender in background mode
/Users/postgres/Blender.app/Contents/MacOS/Blender \
  assets/blender/Final_Helmet-Blend.blend \
  --background \
  --python scripts/render_material_previews.py
```

### Benefits:
- ✅ Faster rendering (no UI overhead)
- ✅ Can run while you work on other things
- ✅ Better for batch processing
- ✅ Easier to automate

## ⚙️ Customization Options

### Quick Test Render

To test with a single finish/color before rendering all 24 previews:

1. Open the script in Blender
2. Scroll to the bottom
3. Comment out the full render:
```python
if __name__ == "__main__":
    # Render all previews
    # render_all_material_previews()

    # Test with single preview:
    render_single_preview(finish="chrome", color="#FFD700")
```

### Change Render Quality

Edit these settings at the top of the script:

```python
# Lower quality (faster, for testing)
RENDER_SAMPLES = 64  # Default: 128
USE_DENOISE = True

# Higher quality (slower, for final production)
RENDER_SAMPLES = 256  # Or 512 for ultra quality
USE_DENOISE = True
```

### Change Resolution

```python
RENDER_WIDTH = 1024   # Default: 800
RENDER_HEIGHT = 1024  # Default: 800
```

### Add Custom Colors

```python
PREVIEW_COLORS = [
    ("#FF0000", "red"),
    ("#0000FF", "blue"),
    ("#FF6B35", "orange"),  # Add your custom colors
    ("#4ECDC4", "teal"),
    # ...
]
```

### Adjust Material Properties

```python
FINISH_PRESETS = {
    "glossy": {
        "metalness": 0.0,
        "roughness": 0.1,  # Lower = shinier (0.2 → 0.1)
        "clearcoat": 0.8,  # More clearcoat (0.5 → 0.8)
    },
    # ...
}
```

## 🎨 Using Previews in Your Web App

### Step 1: The MaterialPreviewGrid component is already created

Location: `app/components/MaterialPreviewGrid.tsx`

### Step 2: Integrate into your customization panel

```tsx
import { MaterialPreviewGrid } from './MaterialPreviewGrid';

export function CustomizationPanel() {
  const { selectedZone, setZoneColor, setZoneFinish } = useHelmetStore();

  return (
    <div>
      {/* Your existing zone selector */}
      <ZoneSelector />

      {/* NEW: Material preview grid */}
      <MaterialPreviewGrid
        selectedFinish={selectedZone.finish}
        selectedColor={selectedZone.color}
        onFinishSelect={(finish) => setZoneFinish(selectedZone.name, finish)}
        onColorSelect={(color) => setZoneColor(selectedZone.name, color)}
      />
    </div>
  );
}
```

### Step 3: The manifest.json provides metadata

```json
{
  "finishes": {
    "glossy": {
      "name": "Glossy",
      "previews": {
        "red": "/material-previews/glossy_red.png",
        "blue": "/material-previews/glossy_blue.png",
        ...
      }
    }
  },
  "colors": [...],
  "renderSettings": {
    "width": 800,
    "height": 800,
    "samples": 128
  }
}
```

## 📊 Performance Expectations

| Configuration | Render Time (per image) | Total Time (24 images) |
|--------------|-------------------------|------------------------|
| 64 samples   | ~10-15 seconds          | ~4-6 minutes           |
| 128 samples (default) | ~20-30 seconds  | ~8-12 minutes          |
| 256 samples  | ~40-60 seconds          | ~16-24 minutes         |
| 512 samples  | ~80-120 seconds         | ~32-48 minutes         |

**Note:** Times vary based on:
- GPU vs CPU rendering
- Scene complexity
- System specifications

## 🔧 Troubleshooting

### Problem: "No helmet objects found"

**Solution:** The script looks for objects with keywords: 'helmet', 'shell', 'facemask', 'chinstrap', 'mask', 'cage'

If your objects have different names:
1. In Blender, rename your helmet parts to include one of these keywords
2. Or edit the script's `find_helmet_objects()` function to match your naming

### Problem: Renders are too dark

**Solution:** Increase light intensity in `setup_lighting()`:
```python
key_light.data.energy = 500  # Increase from 300
fill_light.data.energy = 250  # Increase from 150
```

### Problem: Renders are too bright

**Solution:** Decrease light intensity or add environment strength:
```python
key_light.data.energy = 200  # Decrease from 300
env_node.inputs['Strength'].default_value = 0.3  # Decrease from 0.5
```

### Problem: Background not transparent

**Solution:** Check these settings in the script:
```python
scene.render.film_transparent = True  # Must be True
```

### Problem: Out of memory / GPU errors

**Solution:** Switch to CPU rendering:
```python
scene.cycles.device = 'CPU'  # Change from 'GPU'
```

Or reduce samples:
```python
RENDER_SAMPLES = 64  # Reduce from 128
```

## 🎯 Next Steps

After rendering previews:

1. ✅ Check `public/material-previews/` folder for all images
2. ✅ Import `MaterialPreviewGrid` component into your UI
3. ✅ Remove Spline dependency from material selection
4. ✅ Test different finishes in your web app
5. ✅ Adjust lighting/quality if needed and re-render

## 📝 Notes

- **First render takes longer** (Blender compiles shaders)
- **Subsequent renders are faster** (cached shaders)
- **GPU rendering is 5-10x faster** than CPU (if available)
- **Denoising improves quality** at minimal performance cost
- **Transparent backgrounds** work great for web overlays

## 🚀 Advanced: Batch Rendering Multiple Helmet Models

To render previews for different helmet variants:

```python
# In the script, add:
HELMET_FILES = [
    'assets/blender/helmet_v2_base.blend',
    'assets/blender/helmet_wide.blend',
    'assets/blender/helmet_vintage.blend',
]

for helmet_file in HELMET_FILES:
    # Load each file
    bpy.ops.wm.open_mainfile(filepath=helmet_file)
    # Render previews
    render_all_material_previews()
```

---

## ✨ Result

You'll have beautiful, high-quality material previews that:
- Load instantly in your web app
- Work offline
- Show accurate material properties
- Don't depend on Spline
- Can be versioned in Git (if needed)

Enjoy your new material preview system! 🎨

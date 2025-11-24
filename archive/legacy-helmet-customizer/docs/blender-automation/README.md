# Helmet Customizer - Blender Automation

This directory contains all Blender-related files for the helmet customizer project, organized with standardized naming conventions and clear separation of concerns.

## 📁 Directory Structure

```
blender/
├── scripts/                    # Python automation scripts
│   ├── materials/             # Material manipulation scripts
│   │   └── hc_materials_update.py
│   ├── rendering/             # Rendering and preview generation
│   │   ├── hc_render_previews_basic.py
│   │   └── hc_render_previews_premium.py
│   └── utilities/             # Helper and setup scripts
│       └── hc_util_quick_render.py
│
├── assets/                    # Blender scene files and 3D models
│   └── hc_helmet_base_v2.blend
│
├── output/                    # Generated files (gitignored)
│   └── previews/             # Rendered material preview images
│
├── docs/                      # Documentation
│   ├── hc_blender_mcp_guide.md
│   ├── hc_materials_analysis.md
│   ├── hc_materials_verdict.md
│   ├── hc_render_instructions.md
│   ├── hc_render_preview_system.md
│   └── README.md (this file)
│
└── README.md                  # This file
```

## 🏷️ Naming Convention

All files follow the standardized naming pattern: `hc_{category}_{action}_{variant}.{ext}`

- **Prefix:** `hc_` - Helmet Customizer (project identifier)
- **Category:** Script type (materials, render, util, etc.)
- **Action:** What the script does (update, preview, etc.)
- **Variant:** Optional specificity (basic, premium, etc.)

### Examples:
- `hc_materials_update.py` - Updates helmet materials
- `hc_render_previews_basic.py` - Renders basic material previews
- `hc_render_previews_premium.py` - Renders premium finish previews
- `hc_util_quick_render.py` - Quick rendering utility
- `hc_helmet_base_v2.blend` - Base helmet model (version 2)

## 🚀 Quick Start

### Prerequisites
- Blender 4.5+ installed
- Python 3.11+ (Blender's Python)
- Helmet model file (`.blend` or `.obj`)

### Running Scripts

#### Option 1: Inside Blender (Interactive)
1. Open Blender
2. Switch to **Scripting** workspace
3. Open the script you want to run
4. Click **Run Script** button

#### Option 2: Command Line (Headless)
```bash
# Render basic previews
/Applications/Blender.app/Contents/MacOS/Blender \
  blender/assets/hc_helmet_base_v2.blend \
  --background \
  --python blender/scripts/rendering/hc_render_previews_basic.py

# Render premium previews
/Applications/Blender.app/Contents/MacOS/Blender \
  blender/assets/hc_helmet_base_v2.blend \
  --background \
  --python blender/scripts/rendering/hc_render_previews_premium.py
```

## 📜 Script Reference

### Materials Scripts

#### `hc_materials_update.py`
**Purpose:** Update helmet material properties for 5-zone vertex color system

**Features:**
- 5-zone helmet system (FACEMASK, SHELL, CHINSTRAP, INTERIOR_PADDING, HARDWARE)
- Material finish presets (glossy, matte, chrome, brushed, satin)
- Webhook integration for remote updates
- PBR properties (metallic, roughness, clearcoat, emissive)

**Usage:**
```bash
blender helmet.blend --background --python blender/scripts/materials/hc_materials_update.py
```

---

### Rendering Scripts

#### `hc_render_previews_basic.py`
**Purpose:** Render basic material preview images for the web app

**Features:**
- 4 basic finishes: Glossy, Matte, Metallic, Chrome
- 6 colors: Red, Blue, Gold, Green, White, Black
- Studio lighting setup
- 800x800 resolution, 128 samples
- Automatic manifest.json generation

**Output:** `blender/output/previews/{finish}_{color}.png`

**Usage:**
```bash
blender helmet.blend --background --python blender/scripts/rendering/hc_render_previews_basic.py
```

---

#### `hc_render_previews_premium.py`
**Purpose:** Render premium automotive-inspired material previews

**Features:**
- 15+ premium finishes including:
  - Pearl Coat, Candy Paint, Metallic Flake
  - Carbon Fiber, Anodized Metal
  - Holographic Foil, Iridescent
  - Chrome variants
- 9 colors
- Procedural textures (carbon weave, iridescence effects)
- 1024x1024 resolution, 256 samples
- Professional automotive rendering quality

**Output:** `blender/output/previews/{finish}_{color}.png`

**Usage:**
```bash
blender helmet.blend --background --python blender/scripts/rendering/hc_render_previews_premium.py
```

---

### Utility Scripts

#### `hc_util_quick_render.py`
**Purpose:** Quick setup and test rendering for development

**Features:**
- Scene cleaning and setup
- OBJ/Blend file import
- Camera and lighting configuration
- Single test render for validation

**Usage:**
```bash
blender --background --python blender/scripts/utilities/hc_util_quick_render.py
```

---

## 📤 Output System

### Generated Files
All rendered images are output to:
```
blender/output/previews/
├── glossy_red.png
├── glossy_blue.png
├── matte_red.png
├── chrome_gold.png
└── manifest.json
```

### Web App Integration
The web app accesses rendered previews via symlink:
```
public/material-previews/ → ../blender/output/previews/
```

This allows:
- ✅ Blender scripts output to `blender/output/previews/`
- ✅ Next.js serves from `public/material-previews/`
- ✅ Single source of truth for preview images
- ✅ No file duplication

## 🔧 Configuration

### Paths
All scripts use relative paths from their location:
```python
# Output directory (relative to blender directory)
OUTPUT_DIR = Path(__file__).parent.parent.parent / "output" / "previews"
```

### Environment
No environment variables required for basic operation. Scripts are self-contained.

### Customization
Edit constants at the top of each script:
- `FINISH_PRESETS` - Material finish definitions
- `COLORS` - Color palette
- `RESOLUTION` - Output image size
- `SAMPLES` - Render quality (higher = better but slower)

## 📚 Documentation

### Available Guides

1. **[hc_blender_mcp_guide.md](docs/hc_blender_mcp_guide.md)**
   Blender MCP integration guide for external system control

2. **[hc_materials_analysis.md](docs/hc_materials_analysis.md)**
   Material editing system analysis and design decisions

3. **[hc_materials_verdict.md](docs/hc_materials_verdict.md)**
   Final decisions on material system implementation

4. **[hc_render_instructions.md](docs/hc_render_instructions.md)**
   Step-by-step rendering instructions for manual workflows

5. **[hc_render_preview_system.md](docs/hc_render_preview_system.md)**
   Material preview system architecture and design

## 🚫 Git Ignore Policy

Per project requirements, the following are **NOT** tracked in Git:

### Ignored (External Storage)
- `*.blend`, `*.blend1`, `*.blend2` - Blender scene files
- `blender/output/` - All rendered outputs
- `blender/assets/*.blend` - Asset files

### Tracked
- ✅ All Python scripts (`blender/scripts/**/*.py`)
- ✅ All documentation (`blender/docs/*.md`)
- ✅ This README

**Rationale:** Use external asset management for large binary files (.blend, rendered images). Keep code and docs in version control.

## 🔄 Workflow

### Typical Development Workflow

1. **Edit helmet in Blender**
   ```bash
   open blender/assets/hc_helmet_base_v2.blend
   # Make changes, save
   ```

2. **Run material updates (if needed)**
   ```bash
   blender helmet.blend --background --python blender/scripts/materials/hc_materials_update.py
   ```

3. **Generate preview images**
   ```bash
   # Basic previews
   blender helmet.blend --background --python blender/scripts/rendering/hc_render_previews_basic.py

   # Premium previews
   blender helmet.blend --background --python blender/scripts/rendering/hc_render_previews_premium.py
   ```

4. **Verify in web app**
   ```bash
   cd ..  # Back to project root
   pnpm dev
   # Open http://localhost:3000
   # Preview images automatically available via symlink
   ```

### Production Rendering

For high-quality production renders:
1. Increase `SAMPLES` in render scripts (256 → 512 or 1024)
2. Increase `RESOLUTION` (800x800 → 1920x1920)
3. Enable denoising in Blender compositor
4. Use Cycles render engine (EEVEE for speed, Cycles for quality)

## 🤝 Integration with Web App

The web app (`app/`, `lib/`, etc.) is kept completely separate from Blender automation:

```
helmet-customizer/
├── blender/              ← Blender automation (this directory)
├── app/                  ← Next.js web application
├── lib/                  ← TypeScript utilities
│   └── spline-helmet.ts  ← THREE.js/Spline integration (NOT Blender)
└── public/
    └── material-previews/ → Symlink to blender/output/previews/
```

**Web app never directly calls Blender scripts.**
Preview images are generated offline and served statically.

## 📊 Statistics

- **Total Scripts:** 4 Python scripts
- **Script Categories:** 3 (materials, rendering, utilities)
- **Documentation Files:** 5 comprehensive guides
- **Asset Files:** 1 base helmet model (v2)
- **Supported Finishes:** 15+ material finishes
- **Supported Colors:** 9 colors
- **Total Possible Previews:** 135+ combinations

## 🐛 Troubleshooting

### Common Issues

**Issue:** "BLENDER_PATH not set"
**Solution:** Use full path to Blender executable in command line

**Issue:** "Module 'bpy' not found"
**Solution:** Scripts must run inside Blender's Python environment

**Issue:** "Output directory not found"
**Solution:** Scripts automatically create output directories. Ensure write permissions.

**Issue:** "Symlink broken"
**Solution:** Recreate symlink:
```bash
cd public
rm material-previews
ln -s ../blender/output/previews material-previews
```

**Issue:** "Renders look wrong"
**Solution:** Check helmet file has proper materials and vertex colors applied

## 📞 Support

For issues or questions:
1. Check documentation in `blender/docs/`
2. Review script comments and docstrings
3. Consult parent workspace documentation at `/Blender-Workspace/CLAUDE.md`

## 🎯 Future Enhancements

Potential improvements:
- [ ] Batch rendering automation with CLI arguments
- [ ] Material library expansion
- [ ] Real-time preview integration with web app
- [ ] Automated texture baking
- [ ] GLB export automation for 3D web viewing
- [ ] CI/CD integration for automatic preview regeneration

---

**Last Updated:** 2025-11-20
**Blender Version:** 4.5+
**Python Version:** 3.11+ (Blender's Python)

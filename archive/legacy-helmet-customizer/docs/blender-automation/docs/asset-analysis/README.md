# Asset Analysis Directory

This directory contains detailed technical analysis for each 3D asset used in the helmet customizer project.

## Purpose

Each asset gets its own analysis subdirectory with complete documentation of:
- Scene hierarchy structure
- Mesh data block names
- Material system and slot assignments
- Vertex colors and UV mapping
- Geometry statistics
- Import/export considerations
- Spline/Three.js integration notes

## Directory Structure

```
asset-analysis/
├── README.md (this file)
└── [asset-name]_analysis/
    ├── HIERARCHY_ANALYSIS.md
    ├── MATERIAL_BREAKDOWN.md (optional)
    ├── IMPORT_NOTES.md (optional)
    └── screenshots/ (optional)
```

## Current Assets Analyzed

### hc_helmet_5zone_organized_v1
**Status:** ✅ Complete
**Location:** `asset-analysis/hc_helmet_5zone_organized_v1_analysis/`
**Files:**
- `HIERARCHY_ANALYSIS.md` - Complete nested hierarchy, materials, and targeting guide

**Asset Files:**
- Blend: `blender/assets/hc_helmet_5zone_organized_v1.blend`
- GLB: `3d-assets/hc_helmet_5zone_organized_v1.glb`

**Key Features:**
- 5-zone color-coded system
- Clean hierarchy (1 root, 5 mesh children)
- Shared material architecture (3 materials across all zones)
- Web-optimized (28,100 vertices)

---

## Why Separate Analysis Per Asset?

### 1. **Different Import Behaviors**
Each asset may import differently into Spline/Three.js depending on:
- Mesh data block naming
- Material structure
- Hierarchy depth
- Vertex color formats

### 2. **Version Tracking**
As assets evolve (v1, v2, v3), each version gets its own analysis to compare:
- What changed between versions?
- Which version works best in Spline?
- Material compatibility across versions

### 3. **Testing Documentation**
Document actual import results:
- Did mesh data names affect Spline object names?
- Were materials preserved correctly?
- Did vertex colors export properly?

### 4. **Troubleshooting Reference**
When issues arise in production:
- Quick reference to exact hierarchy
- Material slot assignments
- Vertex color mappings

---

## Analysis Template

When analyzing a new asset, create:

```
asset-analysis/
└── [asset-name]_analysis/
    └── HIERARCHY_ANALYSIS.md
```

**Minimum Required Sections:**
1. **File Information** - Paths, sizes, dates
2. **Scene Hierarchy** - Complete nested structure
3. **Zone/Object Specifications** - Names, vertex counts, colors
4. **Material System** - Slots, assignments, face counts
5. **Targeting Guide** - How to access objects in code
6. **Import Notes** - Spline/Three.js specific considerations

---

## Naming Convention

Asset analysis directories follow this pattern:

```
[prefix]_[asset_description]_[version]_analysis/
```

**Examples:**
- `hc_helmet_5zone_organized_v1_analysis/`
- `hc_helmet_base_v2_analysis/`
- `hc_facemask_standalone_v1_analysis/`

**Prefix Legend:**
- `hc_` - Helmet Customizer project
- Other projects would use their own prefixes

---

## Best Practices

### ✅ DO:
- Create analysis BEFORE using asset in production
- Document actual import results, not assumptions
- Note any discrepancies between Blender and imported version
- Update analysis when asset is modified
- Include screenshots of hierarchy in target platform

### ❌ DON'T:
- Assume internal Blender names don't affect imports
- Skip documenting material slot assignments
- Forget to test vertex color preservation
- Mix multiple asset analyses in one document

---

## Integration with Main Documentation

This directory complements other docs:

| Document | Purpose |
|----------|---------|
| `blender/README.md` | Overview of Blender automation scripts |
| `blender/docs/hc_*.md` | General guides (MCP, materials, rendering) |
| `blender/docs/asset-analysis/` | **Asset-specific technical details** |

**When to use which:**
- Need to run a render script? → `blender/README.md`
- Want to understand material system? → `blender/docs/hc_materials_*.md`
- Need exact hierarchy of specific model? → `asset-analysis/[asset]_analysis/`

---

## Future Assets to Analyze

As you create or import new assets, analyze:

- [ ] `01_desktop_x-helmet-best.blend` (6.3M)
- [ ] `02_hc-helmet-base-v2.blend` (5.4M)
- [ ] `05_authoritative.glb` (1.6M)
- [ ] Material showcase variants (brushed/chrome/glossy)
- [ ] Any new versions of organized helmet

Each should get its own analysis directory following this structure.

---

**Last Updated:** 2025-11-20
**Maintainer:** Helmet Customizer Team

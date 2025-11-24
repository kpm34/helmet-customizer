# Spline Hierarchy Visual Reference

Quick visual guide for targeting objects in the actual Spline import.

## Complete 5-Level Hierarchy

```
📱 Scene Collection (Level 1 - Spline Root)
 │
 └─📁 Collection (Level 2 - Spline Auto-Wrapper)
     │
     └─📁 Helmet (Level 3 - Your Parent Collection)
         │
         ├─📁 Helmet_Chinstrap (Level 4 - Zone Collection)
         │   ├─🔺 Helmet_UV01_low_LowMat_0003 (Level 5 - Mesh)
         │   ├─🔺 Helmet_UV01_low_LowMat_0003_1 (Level 5 - Mesh)
         │   └─🔺 Helmet_UV01_low_LowMat_0003_2 (Level 5 - Mesh)
         │
         ├─📁 Helmet_Facemask (Level 4 - Zone Collection)
         │   ├─🔺 Helmet_UV01_low_LowMat_0002 (Level 5 - Mesh)
         │   ├─🔺 Helmet_UV01_low_LowMat_0002_1 (Level 5 - Mesh)
         │   └─🔺 Helmet_UV01_low_LowMat_0002_2 (Level 5 - Mesh)
         │
         ├─📁 Helmet_Hardware (Level 4 - Zone Collection)
         │   ├─🔺 Helmet_UV01_low_LowMat_0004 (Level 5 - Mesh)
         │   ├─🔺 Helmet_UV01_low_LowMat_0004_1 (Level 5 - Mesh)
         │   └─🔺 Helmet_UV01_low_LowMat_0004_2 (Level 5 - Mesh)
         │
         ├─📁 Helmet_Padding (Level 4 - Zone Collection)
         │   ├─🔺 Helmet_UV01_low_LowMat_0 (Level 5 - Mesh)
         │   └─🔺 Helmet_UV01_low_LowMat_0_1 (Level 5 - Mesh)
         │
         └─🔺 Helmet_Shell (Level 4 - SINGLE MESH ✅)
             (No children - Shell is directly a mesh, not a collection)
```

## Legend

| Symbol | Type | Description |
|--------|------|-------------|
| 📱 | Scene Root | Spline's top-level scene |
| 📁 | Collection | Container/Group (not renderable) |
| 🔺 | Mesh | Actual 3D geometry (renderable) |

## Key Points

1. ⚠️ **Most zone collections are NOT meshes** - You cannot set `.color` directly on them
2. ✅ **Exception: Helmet_Shell IS a single mesh** - Can set `.color` directly
3. 🔍 **Use `findObjectByName()`** to search recursively through all levels
4. 📂 **Zone collections** (Facemask, Chinstrap, Hardware, Padding) act as logical groupings for related meshes
5. 🎯 **Why Shell is different:** All Shell faces use only 1 material slot, so no split occurred

## Targeting Patterns

### Pattern 1: Target Zone Collection (Get All Meshes)
```javascript
const chinstrap = spline.findObjectByName('Helmet_Chinstrap');
// chinstrap is a collection with 3 mesh children
```

### Pattern 2: Target Specific Mesh
```javascript
const mesh = spline.findObjectByName('Helmet_UV01_low_LowMat_0003');
// mesh is an actual renderable object
```

### Pattern 3: Change All Meshes in Zone
```javascript
const zone = spline.findObjectByName('Helmet_Facemask');
zone.children.forEach(mesh => {
    if (mesh.type === 'mesh') {
        mesh.color = '#FF0000';
    }
});
```

## Comparison: Expected vs Actual

| Level | Expected (Blender) | Actual (Spline Import) |
|-------|-------------------|------------------------|
| 1 | Helmet (root) | Scene Collection (Spline root) |
| 2 | Zone mesh objects | Collection (auto-wrapper) |
| 3 | - | Helmet (your collection) |
| 4 | - | Zone collections |
| 5 | - | Individual meshes (split by material) |

**Total Depth:** Blender = 2 levels → Spline = 5 levels

## Why This Matters

### For Code Targeting:
- Can't assume zone names are meshes
- Must check object type before setting properties
- Need to iterate through children for zone-wide changes

### For Scene Organization:
- Keep "Collection" wrapper (Spline default)
- Don't rename "Collection" (may break Spline)
- Zone collections help logical grouping

### For Performance:
- More levels = slightly more traversal cost
- Minimal impact for this model size
- Structure is worth the organization

---

**Next:** See [SPLINE_IMPORT_RESULTS.md](./SPLINE_IMPORT_RESULTS.md) for detailed analysis

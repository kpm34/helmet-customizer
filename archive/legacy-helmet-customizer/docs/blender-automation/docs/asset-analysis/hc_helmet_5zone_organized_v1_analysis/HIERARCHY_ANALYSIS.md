# Helmet Model Hierarchy Reference
**5-Zone Color-Coded Helmet System**

> Complete technical documentation for `hc_helmet_5zone_organized_v1`
> Created: 2025-11-20
> For use with: Blender, Spline, Three.js

---

## 📁 File Locations

| File Type | Path | Size | Purpose |
|-----------|------|------|---------|
| **Blend File** | `blender/assets/hc_helmet_5zone_organized_v1.blend` | 4.4 MB | Editable source file (Blender) |
| **GLB Export** | `3d-assets/hc_helmet_5zone_organized_v1.glb` | 1.6 MB | Optimized web format (Spline/Three.js) |

---

## 🏗️ Scene Hierarchy Structure

### Complete Nested Hierarchy

```
Helmet (Empty - Root Parent)
├── Helmet_Shell (Mesh Object)
│   └── Helmet_UV01_low_LowMat_0.001 (Mesh Data)
│       ├── [Material Slot 0] Helmet_UV01_low_LowMat_0_EXPORT (3,722 faces)
│       ├── [Material Slot 1] Helmet_UV02_low_LowMat_0_EXPORT (0 faces)
│       └── [Material Slot 2] Helmet_UV03_low_LowMat_0_EXPORT (0 faces)
│
├── Helmet_Facemask (Mesh Object)
│   └── Helmet_UV01_low_LowMat_0.002 (Mesh Data)
│       ├── [Material Slot 0] Helmet_UV01_low_LowMat_0_EXPORT (2,660 faces)
│       ├── [Material Slot 1] Helmet_UV02_low_LowMat_0_EXPORT (1,360 faces)
│       └── [Material Slot 2] Helmet_UV03_low_LowMat_0_EXPORT (2,880 faces)
│
├── Helmet_Chinstrap (Mesh Object)
│   └── Helmet_UV01_low_LowMat_0.003 (Mesh Data)
│       ├── [Material Slot 0] Helmet_UV01_low_LowMat_0_EXPORT (1,146 faces)
│       ├── [Material Slot 1] Helmet_UV02_low_LowMat_0_EXPORT (9,668 faces)
│       └── [Material Slot 2] Helmet_UV03_low_LowMat_0_EXPORT (4,598 faces)
│
├── Helmet_Padding (Mesh Object)
│   └── Helmet_UV01_low_LowMat_0 (Mesh Data)
│       ├── [Material Slot 0] Helmet_UV01_low_LowMat_0_EXPORT (536 faces)
│       ├── [Material Slot 1] Helmet_UV02_low_LowMat_0_EXPORT (1,378 faces)
│       └── [Material Slot 2] Helmet_UV03_low_LowMat_0_EXPORT (2,767 faces)
│
└── Helmet_Hardware (Mesh Object)
    └── Helmet_UV01_low_LowMat_0.004 (Mesh Data)
        ├── [Material Slot 0] Helmet_UV01_low_LowMat_0_EXPORT (3,336 faces)
        ├── [Material Slot 1] Helmet_UV02_low_LowMat_0_EXPORT (78 faces)
        └── [Material Slot 2] Helmet_UV03_low_LowMat_0_EXPORT (789 faces)
```

### Hierarchy Details

**Root Object:**
- **Name:** `Helmet`
- **Type:** Empty (PLAIN_AXES)
- **Purpose:** Parent container for all zones
- **Location:** (0, 0, 0)

**Child Objects:** 5 mesh objects (one per zone)

**Mesh Data Blocks:** Each mesh object has an associated mesh data block with a unique name

**Material System:**
- **Total Unique Materials:** 3 (shared across all zones)
- **Material Slots Per Zone:** 3
- **Material Assignment:** Different faces within each zone use different material slots
- **Shared Materials:** All zones share the same 3 materials for efficiency

---

## 🎨 Zone Specifications

### Overview Table

| Zone | Object Name | Emoji | RGB (0-1) | RGB (0-255) | Hex | Vertices | Faces |
|------|-------------|-------|-----------|-------------|-----|----------|-------|
| **Shell** | `Helmet_Shell` | ⚫ | (0.0, 0.0, 0.0) | (0, 0, 0) | `#000000` | 2,182 | 3,722 |
| **Facemask** | `Helmet_Facemask` | 🔴 | (1.0, 0.0, 0.0) | (255, 0, 0) | `#FF0000` | 5,107 | 6,900 |
| **Chinstrap** | `Helmet_Chinstrap` | 🟢 | (0.0, 1.0, 0.0) | (0, 255, 0) | `#00FF00` | 13,041 | 15,412 |
| **Padding** | `Helmet_Padding` | 🔵 | (0.0, 0.0, 1.0) | (0, 0, 255) | `#0000FF` | 3,295 | 4,681 |
| **Hardware** | `Helmet_Hardware` | 🟡 | (1.0, 1.0, 0.0) | (255, 255, 0) | `#FFFF00` | 4,475 | 4,203 |
| **TOTAL** | - | - | - | - | - | **28,100** | **34,918** |

---

## 🎯 Zone Targeting Guide

### For Spline Scene

When importing into Spline, target zones by object name:

```javascript
// Get all helmet zones
const helmet = spline.findObjectByName('Helmet');
const shell = spline.findObjectByName('Helmet_Shell');
const facemask = spline.findObjectByName('Helmet_Facemask');
const chinstrap = spline.findObjectByName('Helmet_Chinstrap');
const padding = spline.findObjectByName('Helmet_Padding');
const hardware = spline.findObjectByName('Helmet_Hardware');

// Change color of a specific zone
facemask.color = '#FF0000';  // Red
```

### For Three.js

```javascript
// Load GLB
const gltf = await loader.loadAsync('hc_helmet_5zone_organized_v1.glb');
const helmet = gltf.scene;

// Access zones by name
const shell = helmet.getObjectByName('Helmet_Shell');
const facemask = helmet.getObjectByName('Helmet_Facemask');
const chinstrap = helmet.getObjectByName('Helmet_Chinstrap');
const padding = helmet.getObjectByName('Helmet_Padding');
const hardware = helmet.getObjectByName('Helmet_Hardware');

// Change material color
facemask.material.color.setHex(0xFF0000);
```

---

## 📊 Detailed Zone Information

### ⚫ Zone: Shell
**Main helmet shell/body**

- **Object Name:** `Helmet_Shell`
- **Vertex Color:** Black (0, 0, 0) / `#000000`
- **Geometry:**
  - Vertices: 2,182
  - Faces: 3,722
  - Edges: 5,538
- **Description:** The main helmet shell that covers the head
- **Percentage of model:** 7.8% of total vertices
- **Bounding Box:**
  - Min: (-0.15, -0.18, -0.12)
  - Max: (0.15, 0.12, 0.18)

**Contains:**
- Main helmet dome
- Side panels
- Back shell

---

### 🔴 Zone: Facemask
**Front facemask grille**

- **Object Name:** `Helmet_Facemask`
- **Vertex Color:** Red (255, 0, 0) / `#FF0000`
- **Geometry:**
  - Vertices: 5,107
  - Faces: 6,900
  - Edges: 12,007
- **Description:** Front facemask grille bars
- **Percentage of model:** 18.2% of total vertices
- **Bounding Box:**
  - Min: (-0.10, -0.20, -0.10)
  - Max: (0.10, -0.05, 0.10)

**Contains:**
- Horizontal facemask bars
- Vertical center bar
- Attachment points to helmet shell

---

### 🟢 Zone: Chinstrap
**Chinstrap and cage bars**

- **Object Name:** `Helmet_Chinstrap`
- **Vertex Color:** Green (0, 255, 0) / `#00FF00`
- **Geometry:**
  - Vertices: 13,041 (largest zone)
  - Faces: 15,412
  - Edges: 28,453
- **Description:** Chinstrap system including all cage bars
- **Percentage of model:** 46.4% of total vertices
- **Bounding Box:**
  - Min: (-0.16, -0.22, -0.15)
  - Max: (0.16, 0.08, 0.15)

**Contains:**
- Chin cup
- Side strap connections
- Facemask cage bars
- Jaw protection bars

**Note:** Largest zone due to complex cage structure

---

### 🔵 Zone: Padding
**Interior padding**

- **Object Name:** `Helmet_Padding`
- **Vertex Color:** Blue (0, 0, 255) / `#0000FF`
- **Geometry:**
  - Vertices: 3,295
  - Faces: 4,681
  - Edges: 7,976
- **Description:** Interior comfort padding
- **Percentage of model:** 11.7% of total vertices
- **Bounding Box:**
  - Min: (-0.12, -0.15, -0.10)
  - Max: (0.12, 0.10, 0.12)

**Contains:**
- Cheek pads
- Crown padding
- Jaw padding
- Comfort liner sections

---

### 🟡 Zone: Hardware
**Clips, screws, and attachments**

- **Object Name:** `Helmet_Hardware`
- **Vertex Color:** Yellow (255, 255, 0) / `#FFFF00`
- **Geometry:**
  - Vertices: 4,475
  - Faces: 4,203
  - Edges: 8,678
- **Description:** All attachment hardware
- **Percentage of model:** 15.9% of total vertices
- **Bounding Box:**
  - Min: (-0.14, -0.18, -0.12)
  - Max: (0.14, 0.10, 0.12)

**Contains:**
- Facemask clips
- Chin strap buckles
- Screw posts
- Attachment rivets
- Hardware fasteners

---

## 🔧 Technical Details

### Vertex Color System

Each zone uses **vertex colors** to define its boundaries:

- **Color Layer:** `Color` (primary)
- **Color Layer 2:** `Color.001` (backup)
- **Format:** RGB float (0.0 - 1.0)
- **Purpose:** Programmatic zone identification

**How to read vertex colors in Blender Python:**

```python
import bpy

obj = bpy.data.objects['Helmet_Facemask']
vc_layer = obj.data.vertex_colors[0]

for loop in obj.data.loops:
    color = vc_layer.data[loop.index].color
    # color is (R, G, B, A) with values 0.0-1.0
    print(f"RGB: ({color[0]:.1f}, {color[1]:.1f}, {color[2]:.1f})")
```

### UV Mapping

- **UV Map:** `UVMap` (standard)
- **All zones:** Share same UV space
- **Texture support:** Yes (can apply textures to any zone)

### Materials System

#### Shared Material Architecture

All 5 zones share **3 common materials** for efficiency:

| Material Name | Used By | Total Users | Node Count |
|---------------|---------|-------------|------------|
| `Helmet_UV01_low_LowMat_0_EXPORT` | All 5 zones | 6 | 3 |
| `Helmet_UV02_low_LowMat_0_EXPORT` | All 5 zones | 7 | 3 |
| `Helmet_UV03_low_LowMat_0_EXPORT` | All 5 zones | 7 | 3 |

**Why 3 Materials?**
- Originally from 3 UV sets (UV01, UV02, UV03)
- Allows different parts of the model to use different UV layouts
- More efficient than separate materials per zone

#### Material Slot Assignment Per Zone

Each zone has **3 material slots**, but different faces use different slots:

| Zone | Slot 0 Faces | Slot 1 Faces | Slot 2 Faces | Total Faces |
|------|--------------|--------------|--------------|-------------|
| **Shell** | 3,722 (100%) | 0 (0%) | 0 (0%) | 3,722 |
| **Facemask** | 2,660 (39%) | 1,360 (20%) | 2,880 (42%) | 6,900 |
| **Chinstrap** | 1,146 (7%) | 9,668 (63%) | 4,598 (30%) | 15,412 |
| **Padding** | 536 (11%) | 1,378 (29%) | 2,767 (59%) | 4,681 |
| **Hardware** | 3,336 (79%) | 78 (2%) | 789 (19%) | 4,203 |

**Key Insights:**
- **Shell:** Uses only Material Slot 0 (all faces use same material)
- **Facemask:** Evenly split across all 3 material slots
- **Chinstrap:** Primarily uses Material Slot 1 (63% of faces)
- **Padding:** Primarily uses Material Slot 2 (59% of faces)
- **Hardware:** Primarily uses Material Slot 0 (79% of faces)

#### Material Properties

**All 3 materials share identical settings:**
- **Base Color:** RGB(0.8, 0.8, 0.8) - Light gray
- **Roughness:** Default value
- **Metalness:** 0.0 (non-metallic)
- **Specular:** Default value
- **Use Nodes:** Yes (Principled BSDF shader)

**Material Structure:**
```
Material Node Tree:
├── Principled BSDF (shader)
├── Material Output (output node)
└── [Additional nodes as needed]
```

#### Mesh Data Block Names

Each zone's mesh object points to a uniquely named mesh data block:

| Zone Object Name | Mesh Data Block Name | Vertices |
|------------------|----------------------|----------|
| `Helmet_Shell` | `Helmet_UV01_low_LowMat_0.001` | 2,182 |
| `Helmet_Facemask` | `Helmet_UV01_low_LowMat_0.002` | 5,107 |
| `Helmet_Chinstrap` | `Helmet_UV01_low_LowMat_0.003` | 13,041 |
| `Helmet_Padding` | `Helmet_UV01_low_LowMat_0` | 3,295 |
| `Helmet_Hardware` | `Helmet_UV01_low_LowMat_0.004` | 4,475 |

**Important:** These mesh data block names are Blender's internal identifiers. Their impact on Spline/Three.js imports is **UNTESTED** and may affect import behavior, object naming, or material assignments. Test after import to verify.

---

## 🎨 Color Customization Workflows

### Workflow 1: Change Material Color (Blender)

```python
import bpy

# Get zone object
facemask = bpy.data.objects['Helmet_Facemask']

# Access material
mat = facemask.data.materials[0]

# Find Principled BSDF node
for node in mat.node_tree.nodes:
    if node.type == 'BSDF_PRINCIPLED':
        # Set base color (RGBA)
        node.inputs['Base Color'].default_value = (1.0, 0.0, 0.0, 1.0)  # Red
        break
```

### Workflow 2: Change Material Color (Spline)

```javascript
// Target specific zone
const facemask = spline.findObjectByName('Helmet_Facemask');

// Method 1: Direct color change
facemask.color = '#FF0000';

// Method 2: RGB values
facemask.color = { r: 255, g: 0, b: 0 };

// Method 3: With material finish
facemask.color = '#FF0000';
facemask.material.roughness = 0.2;  // Glossy
facemask.material.metalness = 0.0;
```

### Workflow 3: Hide/Show Zones

```javascript
// In Spline
const padding = spline.findObjectByName('Helmet_Padding');
padding.visible = false;  // Hide interior padding

// Show all zones
const helmet = spline.findObjectByName('Helmet');
helmet.children.forEach(zone => {
    zone.visible = true;
});
```

---

## 📐 Geometry Statistics

### Complexity Breakdown

| Zone | Vertices | % of Total | Complexity |
|------|----------|------------|------------|
| Chinstrap | 13,041 | 46.4% | High (complex cage) |
| Facemask | 5,107 | 18.2% | Medium |
| Hardware | 4,475 | 15.9% | Medium |
| Padding | 3,295 | 11.7% | Low |
| Shell | 2,182 | 7.8% | Low |

**Performance Notes:**
- Total 28,100 vertices is **web-optimized** for real-time 3D
- Low-poly model suitable for:
  - Spline web experiences
  - Three.js applications
  - Mobile devices
  - Real-time rendering

---

## 🔍 Zone Identification Methods

### Method 1: By Object Name

```javascript
// Most reliable - use object names
const zones = {
    shell: scene.getObjectByName('Helmet_Shell'),
    facemask: scene.getObjectByName('Helmet_Facemask'),
    chinstrap: scene.getObjectByName('Helmet_Chinstrap'),
    padding: scene.getObjectByName('Helmet_Padding'),
    hardware: scene.getObjectByName('Helmet_Hardware')
};
```

### Method 2: By Vertex Color

```javascript
// Read vertex colors to identify zones
const geometry = mesh.geometry;
const colors = geometry.attributes.color;

if (colors) {
    for (let i = 0; i < colors.count; i++) {
        const r = colors.getX(i);
        const g = colors.getY(i);
        const b = colors.getZ(i);

        // Identify zone
        if (r === 1.0 && g === 0.0 && b === 0.0) {
            console.log('Facemask vertex');
        }
        // ... etc
    }
}
```

### Method 3: By Parent-Child Relationship

```javascript
// Get all zones via parent
const helmet = scene.getObjectByName('Helmet');
const allZones = helmet.children;  // Array of 5 zone meshes

allZones.forEach(zone => {
    console.log(`Zone: ${zone.name}`);
});
```

---

## 📦 Import Guidelines

### Importing into Spline

1. **File Format:** Use GLB (`hc_helmet_5zone_organized_v1.glb`)
2. **Import Settings:**
   - ✅ Preserve hierarchy
   - ✅ Import materials
   - ✅ Import vertex colors (if supported)
3. **Verify:**
   - Check that `Helmet` parent exists
   - Verify 5 child objects with correct names
   - Test zone targeting by name

### Importing into Three.js

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
loader.load('hc_helmet_5zone_organized_v1.glb', (gltf) => {
    const helmet = gltf.scene;

    // Verify structure
    console.log('Root:', helmet.name);
    helmet.children.forEach(child => {
        console.log('Zone:', child.name);
    });

    scene.add(helmet);
});
```

### Importing into React Three Fiber

```jsx
import { useGLTF } from '@react-three/drei';

function Helmet() {
    const { scene } = useGLTF('/hc_helmet_5zone_organized_v1.glb');

    return <primitive object={scene} />;
}
```

---

## 🎯 Use Cases

### Use Case 1: Team Uniform Customization

```javascript
// Apply team colors to different zones
const teamColors = {
    primary: '#003366',    // Navy blue
    secondary: '#FFD700',  // Gold
    accent: '#FFFFFF'      // White
};

helmet.getObjectByName('Helmet_Shell').color = teamColors.primary;
helmet.getObjectByName('Helmet_Facemask').color = teamColors.secondary;
helmet.getObjectByName('Helmet_Chinstrap').color = teamColors.primary;
helmet.getObjectByName('Helmet_Padding').visible = false;  // Hide interior
helmet.getObjectByName('Helmet_Hardware').color = teamColors.accent;
```

### Use Case 2: Material Finish Showcase

```javascript
// Show different material finishes per zone
const facemask = helmet.getObjectByName('Helmet_Facemask');
facemask.material.roughness = 0.05;  // Chrome
facemask.material.metalness = 1.0;

const shell = helmet.getObjectByName('Helmet_Shell');
shell.material.roughness = 0.2;  // Glossy
shell.material.metalness = 0.0;
```

### Use Case 3: Interactive Zone Selection

```javascript
// Highlight zone on hover
helmet.children.forEach(zone => {
    zone.addEventListener('mouseenter', () => {
        zone.material.emissive = 0x444444;  // Glow effect
    });

    zone.addEventListener('mouseleave', () => {
        zone.material.emissive = 0x000000;
    });
});
```

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| v1 | 2025-11-20 | Initial 5-zone organized structure |

---

## 📝 Notes & Best Practices

### Zone Naming Convention
- ✅ **DO:** Use exact names: `Helmet_Shell`, `Helmet_Facemask`, etc.
- ❌ **DON'T:** Rename zones or you'll break targeting logic

### Performance Tips
1. **Hide interior zones** (Padding) for external views
2. **Use LOD** (Level of Detail) for distant cameras
3. **Combine zones** if uniform color (reduces draw calls)

### Vertex Color Preservation
- Vertex colors are preserved in GLB export
- Some platforms may not support vertex colors
- Always test after import to verify colors exist

### Material Customization
- Materials are **separate per zone** - allows independent customization
- Base materials are simple (Principled BSDF)
- Can be replaced with custom shaders

---

## 🆘 Troubleshooting

### Issue: Can't find zone by name in Spline

**Solution:**
1. Check Spline's object hierarchy panel
2. Names may have changed during import
3. Use `findObjectByName()` with exact spelling

### Issue: Vertex colors not showing

**Solution:**
1. Check if platform supports vertex colors
2. In Three.js: Ensure `vertexColors: true` in material
3. In Blender: Verify viewport shading set to "Vertex"

### Issue: Zones are merged together

**Solution:**
1. Re-import from original GLB file
2. Check "Preserve Hierarchy" in import settings
3. Verify each zone is a separate mesh object

### Issue: Materials look wrong

**Solution:**
1. Materials export as simple Principled BSDF
2. Customize materials after import
3. Check lighting setup in your scene

---

## 📚 Related Documentation

- [Blender Scripts README](../README.md)
- [Material System Documentation](hc_materials_system.md)
- [Render Preview System](hc_render_preview_system.md)
- [Spline Integration Guide](../../docs/blender_integration.md)

---

## 📞 Support

For questions or issues with this model:
1. Check this documentation first
2. Review related docs listed above
3. Verify import settings for your platform

---

**Last Updated:** 2025-11-20
**Model Version:** v1
**Blender Version:** 4.5+
**Format:** Blend + GLB

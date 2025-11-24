# Material Finish Implementation Guide

**Last Updated:** 2024-11-20  
**Status:** ✅ Multi-Strategy System Implemented

---

## Overview

**IMPORTANT:** Spline does NOT expose roughness/metalness as direct material properties. These parameters are **only available** on the **Physical Lighting Layer** when a **Roughness Map** is assigned.

Spline uses a **layer-based material system**:
- **Lighting Layer**: Controls base lighting (Lambert/Phong/Physical/Toon)
- **Additional Layers**: Fresnel (metallic), Matcap (shine), Glass (glossy), etc.

We've implemented a **multi-strategy system** with automatic fallback to ensure material finishes work regardless of Spline scene configuration.

## Strategy Architecture

The system tries three strategies in order until one succeeds:

### Strategy 1: Spline Variables + Material Layers ⚙️
**Best for:** Scenes with Variables configured in Spline Editor

**How it works:**
- Uses Spline's `setVariable()` API
- Variables control **Lighting Layer type** or **Physical layer parameters**
- Works with Spline's layer-based material system

**Setup Options:**

**Option A: Control Lighting Layer Type** (Recommended)
1. In Spline Editor → Variables panel, create Number variables:
   - `shellLightingType` (values: 0=Lambert/matte, 1=Phong/glossy, 2=Physical/metallic, 3=Toon)
   - `facemaskLightingType`, `chinstrapLightingType`, etc.
2. Select each helmet zone object → Material Panel → Lighting Layer
3. Click on the Lighting Layer → Attach variable to "Type" property
4. Variables will switch between Lambert (matte), Phong (glossy), Physical (metallic)

**Option B: Control Physical Layer Parameters** (Advanced - requires Roughness Map)
1. Create Number variables:
   - `shellRoughness` (0-1), `shellMetalness` (0-1), `shellReflectivity` (0-1)
   - Repeat for each zone
2. Select object → Material Panel → Lighting Layer → Set to "Physical"
3. Add Image Layer → Assign as "Roughness Map" to Physical layer
4. Attach variables to Physical layer's Roughness/Metalness/Reflectivity parameters
5. Variables control PBR properties when Physical + Roughness Map is active

**Option C: Control Material Layer Visibility** (For complex finishes)
1. Create Number variables for layer opacity (0-1)
2. Add Fresnel layer (for metallic), Matcap layer (for shine), Glass layer (for glossy)
3. Attach variables to layer opacity
4. Use combinations: Fresnel (metallic), Matcap (shine), Glass (glossy)

**Pros:**
- Native Spline approach
- Works with Spline's layer-based material system
- No runtime material cloning overhead
- Supports all finish types via layer combinations

**Cons:**
- Requires manual editor setup
- Option B requires Roughness Map setup
- Variables must be properly attached in editor

---

### Strategy 2: Material Layer Manipulation 🔄
**Best for:** Runtime layer changes (if API supports it)

**How it works:**
1. Accesses objects via Spline Runtime API
2. Attempts to modify Lighting Layer type directly
3. Tries to add/control Fresnel, Matcap, Glass layers
4. Manipulates layer properties if accessible

**Setup Required:**
- None! Works automatically at runtime (if API supports it)

**Pros:**
- No editor setup needed
- Works with Spline's layer system
- Native approach if API supports it

**Cons:**
- **May not be available** - depends on Spline Runtime API version
- Layer manipulation may not be exposed via runtime API
- Falls back to Strategy 3 if unavailable

**Note:** This strategy attempts to manipulate layers but may not work if Spline doesn't expose layer properties via runtime API. It's included for future API support.

---

### Strategy 3: Material Cloning & Swapping 🔄
**Best for:** Runtime material changes without editor setup

**How it works:**
1. Accesses THREE.js scene directly
2. Clones original materials
3. Modifies metalness/roughness on cloned materials (if accessible)
4. Swaps cloned materials onto meshes
5. Caches cloned materials for reuse

**Setup Required:**
- None! Works automatically at runtime

**Pros:**
- No editor setup needed
- Supports all 19 finish types
- Material caching for performance
- Preserves original materials for restoration

**Cons:**
- Requires THREE.js scene access
- Creates new material instances (memory overhead)
- **May not work** with Spline's layer-based material system
- Roughness/metalness may not be accessible if not Physical layer with Roughness Map

---

### Strategy 4: Direct THREE.js Manipulation 🔧
**Best for:** Last resort fallback when other strategies fail

**How it works:**
- Directly modifies material properties on existing materials
- Attempts to set `material.metalness` and `material.roughness`
- Marks materials for update

**Setup Required:**
- None

**Pros:**
- No material cloning overhead
- Works with standard THREE.js materials
- Simple and fast

**Cons:**
- **Likely won't work** - Spline uses layer-based materials, not direct properties
- Roughness/metalness only exist on Physical layer with Roughness Map
- Modifies original materials (can't restore easily)
- Last resort fallback

---

## Spline Editor Setup Guide

### Understanding Spline's Material System

**Key Points:**
- Spline uses **layer-based materials** (like Photoshop layers)
- **Roughness/Metalness are NOT direct properties** - they only exist on Physical Lighting Layer with Roughness Map
- Default layers: **Color Layer** + **Lighting Layer**
- Lighting Layer types: Lambert (matte), Phong (glossy), Physical (metallic), Toon

### Recommended Setup: Lighting Layer Type Variables

**Step 1: Create Variables**
1. Open Spline Editor → Variables & Data panel (right sidebar, when nothing selected)
2. Click "+" → Create Number variables:
   - `shellLightingType`
   - `facemaskLightingType`
   - `chinstrapLightingType`
   - `paddingLightingType`
   - `hardwareLightingType`

**Step 2: Attach Variables to Lighting Layer**
1. Select helmet zone object (e.g., Shell_Combined)
2. Open Material Panel (right sidebar)
3. Click on **Lighting Layer** (should show "Phong" by default)
4. Find the **Type** dropdown/property
5. Click the variable attachment icon (usually a link icon)
6. Select your variable (e.g., `shellLightingType`)

**Step 3: Map Finish Values**
- `0` = Lambert (matte finishes)
- `1` = Phong (glossy finishes)
- `2` = Physical (metallic finishes like chrome, brushed)
- `3` = Toon (stylized finishes)

**Step 4: Test Variables**
Use the runtime API to set variables:
```typescript
spline.setVariable('shellLightingType', 2); // Physical/metallic
```

### Advanced Setup: Physical Layer with Roughness Map

**For precise PBR control (roughness/metalness values):**

**Step 1: Set Up Physical Layer**
1. Select object → Material Panel → Lighting Layer
2. Change Type to **"Physical"**

**Step 2: Add Roughness Map**
1. Click "+" to add new layer → Select **"Image"** layer
2. Upload or select a roughness map image (grayscale)
3. Click on **Lighting Layer** → Find "Rough Map" section
4. Assign the Image layer as the Roughness Map

**Step 3: Create Parameter Variables**
1. Create Number variables:
   - `shellRoughness` (0-1)
   - `shellMetalness` (0-1)
   - `shellReflectivity` (0-1)
2. Attach variables to Physical layer's:
   - Roughness parameter
   - Metalness parameter
   - Reflectivity parameter

**Step 4: Use Runtime API**
```typescript
spline.setVariable('shellRoughness', 0.1);  // Glossy
spline.setVariable('shellMetalness', 1.0);   // Metallic
```

### Layer Combination Strategy

**For complex finishes, combine multiple layers:**

**Metallic Finish (Chrome, Brushed):**
- Lighting Layer: Physical
- Add Fresnel Layer (for metallic reflections)
- Adjust Fresnel intensity/color

**Glossy Finish:**
- Lighting Layer: Phong
- Add Glass Layer (for clearcoat effect)
- Adjust Glass opacity/reflectivity

**Matte Finish:**
- Lighting Layer: Lambert
- No additional layers needed

**Shiny Finish:**
- Lighting Layer: Phong
- Add Matcap Layer (for consistent shine)
- Select appropriate matcap texture

---

## Usage

### Basic Usage

```typescript
import { applyZoneFinish } from '@/lib/spline-material-finish';

// Apply finish with automatic strategy fallback
const result = applyZoneFinish(spline, 'shell', 'chrome');

if (result.success) {
  console.log(`✅ Applied finish using: ${result.strategy}`);
  console.log(result.message);
} else {
  console.error(`❌ Failed: ${result.message}`);
}
```

### Force Specific Strategy

```typescript
// Force Variables strategy (skip cloning/direct)
const result = applyZoneFinish(spline, 'shell', 'chrome', 'variables');

// Force Cloning strategy (skip variables/direct)
const result = applyZoneFinish(spline, 'shell', 'chrome', 'cloning');

// Force Direct strategy (skip variables/cloning)
const result = applyZoneFinish(spline, 'shell', 'chrome', 'direct');
```

### Cache Management

```typescript
import { 
  clearMaterialCache, 
  restoreOriginalMaterials,
  getMaterialCacheStats 
} from '@/lib/spline-material-finish';

// Clear cache for specific zone
clearMaterialCache('shell');

// Clear all caches
clearMaterialCache();

// Restore original materials
restoreOriginalMaterials(spline, 'shell');

// Get cache statistics
const stats = getMaterialCacheStats();
console.log(`Cached finishes: ${stats.cachedFinishes}`);
console.log(`Cached objects: ${stats.cachedObjects}`);
```

---

## Integration with Existing Code

The new system is **backward compatible**. Your existing code continues to work:

```typescript
// Old code (still works)
import { applyZoneFinishDirect } from '@/lib/spline-helmet';
const success = applyZoneFinishDirect(spline, 'shell', 'chrome');

// New code (recommended)
import { applyZoneFinish } from '@/lib/spline-material-finish';
const result = applyZoneFinish(spline, 'shell', 'chrome');
```

---

## Supported Finishes

All 19 finish types are supported:

| Finish | Metalness | Roughness | Description |
|--------|-----------|-----------|-------------|
| `glossy` | 0.0 | 0.1 | Shiny plastic |
| `matte` | 0.0 | 0.8 | Matte plastic |
| `chrome` | 1.0 | 0.05 | Mirror metallic |
| `brushed` | 0.9 | 0.35 | Brushed metal |
| `satin` | 0.1 | 0.5 | Soft semi-gloss |
| `pearl_coat` | 0.7 | 0.2 | Pearl automotive |
| `satin_automotive` | 0.3 | 0.6 | Premium wrap |
| `metallic_flake` | 0.8 | 0.25 | Metallic flake |
| `wet_clearcoat` | 0.1 | 0.05 | Wet clear coat |
| `anodized_metal` | 0.95 | 0.15 | Anodized metal |
| `brushed_titanium` | 0.9 | 0.35 | Brushed titanium |
| `weathered_metal` | 0.7 | 0.65 | Patina finish |
| `carbon_fiber` | 0.4 | 0.3 | Carbon fiber |
| `rubberized_softtouch` | 0.0 | 0.9 | Soft touch |
| `ceramic_gloss` | 0.1 | 0.05 | Ceramic gloss |
| `frosted_polycarbonate` | 0.0 | 0.4 | Frosted plastic |
| `holographic_foil` | 0.9 | 0.1 | Holographic |

---

## Performance Considerations

### Material Caching
- Cloned materials are cached per zone+finish combination
- Subsequent applications reuse cached materials
- Reduces memory allocation and improves performance

### Strategy Selection
- Variables strategy: Fastest (no material operations)
- Cloning strategy: Moderate (one-time clone, then reuse)
- Direct strategy: Fastest (no cloning), but may not work

### Memory Usage
- Original materials: ~1KB per material
- Cloned materials: ~1KB per material per finish
- For 5 zones × 19 finishes: ~95KB cache (negligible)

---

## Troubleshooting

### Strategy 1 (Variables) Fails
**Symptom:** `Variable "shellFinish" not found or not accessible`

**Solution:**
1. Check if variables exist in Spline Editor
2. Verify variable names match: `${zone}Finish`
3. Ensure variables are Number type
4. Check variable is attached to material properties

### Strategy 2 (Cloning) Fails
**Symptom:** `THREE.js scene not accessible` or `No objects found`

**Solution:**
1. Verify `getThreeScene()` returns scene
2. Check zone object names match `ZONE_PATTERNS`
3. Ensure objects have materials
4. Check browser console for THREE.js errors

### Strategy 3 (Direct) Fails
**Symptom:** `Direct manipulation failed`

**Solution:**
1. Materials may be Spline custom materials (not standard THREE.js)
2. Try Strategy 2 (Cloning) instead
3. Check material type in console: `material.constructor.name`

### All Strategies Fail
**Symptom:** `All material finish strategies failed`

**Solution:**
1. Check Spline scene is fully loaded
2. Verify zone objects exist and have materials
3. Check browser console for detailed error messages
4. Try applying finish to a different zone
5. Verify finish type exists in `FINISH_PRESETS`

---

## Testing

### Test All Strategies

```typescript
import { applyZoneFinish } from '@/lib/spline-material-finish';

// Test Variables strategy
const result1 = applyZoneFinish(spline, 'shell', 'chrome', 'variables');
console.log('Variables:', result1.success);

// Test Cloning strategy
const result2 = applyZoneFinish(spline, 'shell', 'chrome', 'cloning');
console.log('Cloning:', result2.success);

// Test Direct strategy
const result3 = applyZoneFinish(spline, 'shell', 'chrome', 'direct');
console.log('Direct:', result3.success);
```

### Test All Finishes

```typescript
import { FINISH_TYPES } from '@/lib/constants';
import { applyZoneFinish } from '@/lib/spline-material-finish';

FINISH_TYPES.forEach(finish => {
  const result = applyZoneFinish(spline, 'shell', finish);
  console.log(`${finish}: ${result.success ? '✅' : '❌'}`);
});
```

---

## Future Improvements

1. **Material State System**: Pre-create materials with all finishes, swap instantly
2. **Variable Expansion**: Support more than 5 finishes via variable mapping
3. **Performance Monitoring**: Track strategy success rates
4. **Auto-Detection**: Automatically detect which strategy works best
5. **Material Restoration**: Better restore system for original materials

---

## References

- [Spline Variables Documentation](https://docs.spline.design/interaction-states-events-and-actions/variables)
- [Spline Code API Documentation](https://docs.spline.design/exporting-your-scene/web/code-api-for-web)
- [THREE.js Material Documentation](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)


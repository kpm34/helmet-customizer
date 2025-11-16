# Materials, Colors, and Textures Reference

Complete documentation of all materials, colors, and texture settings for the helmet customizer.

---

## Default Zone Colors

### Shell (Helmet Main Body)
- **Object**: `UV01_Shell`
- **Default Color**: `#FFFFFF` (White)
- **Default Finish**: `glossy`
- **Purpose**: Main helmet shell - largest visible area

### Facemask
- **Object**: `Facemask_Complete`
- **Default Color**: `#7F7F7F` (Medium Gray)
- **Default Finish**: `brushed`
- **Purpose**: Front face protection bars

### Chinstrap (3 parts)
- **Objects**: `UV01_Chinstrap`, `UV02_Chinstrap_Strap`, `UV03_Chinstrap`
- **Default Color**: `#1C1C1C` (Dark Gray)
- **Default Finish**: `matte`
- **Purpose**: Chin strap components

### Padding (2 parts)
- **Objects**: `UV01_Padding`, `UV03_Padding`
- **Default Color**: `#333333` (Charcoal)
- **Default Finish**: `matte`
- **Purpose**: Interior padding visible through shell

### Hardware (23+ parts)
- **Objects**:
  - `Hardware_P_Clip_01`, `Hardware_P_Clip_02`
  - `Hardware_01` through `Hardware_20`
  - `Hardware_Tiny`
- **Default Color**: `#C0C0C0` (Silver)
- **Default Finish**: `chrome`
- **Purpose**: Clips, screws, connectors, and metal components

---

## Material Finish System

### Material Properties
All finishes use two main properties:
- **Metalness**: 0.0 (plastic) to 1.0 (metal)
- **Roughness**: 0.0 (mirror smooth) to 1.0 (rough/diffuse)

### Available Finishes

#### 1. Glossy
- **Type**: Shiny plastic
- **Metalness**: `0.0` (non-metallic)
- **Roughness**: `0.1` (very smooth, high reflection)
- **Best For**: Helmet shells, visors
- **Visual**: High shine, clear reflections

#### 2. Matte
- **Type**: Non-reflective plastic
- **Metalness**: `0.0` (non-metallic)
- **Roughness**: `0.8` (rough surface)
- **Best For**: Padding, chinstraps, interior parts
- **Visual**: No reflections, diffuse lighting

#### 3. Chrome
- **Type**: Mirror-like metal
- **Metalness**: `1.0` (full metal)
- **Roughness**: `0.05` (very smooth)
- **Best For**: Hardware, screws, clips
- **Visual**: Mirror finish, strong reflections

#### 4. Brushed
- **Type**: Brushed metal texture
- **Metalness**: `0.9` (mostly metallic)
- **Roughness**: `0.35` (moderate roughness)
- **Best For**: Facemasks, metal bars
- **Visual**: Linear brush pattern, moderate reflections

#### 5. Satin
- **Type**: Soft semi-gloss
- **Metalness**: `0.1` (slightly metallic)
- **Roughness**: `0.5` (medium roughness)
- **Best For**: Hybrid materials, logos
- **Visual**: Soft sheen, subtle reflections

---

## Color Application System

### Current System: Material Overlay
Colors are applied using Spline's material system with emissive overlay:

```typescript
// Primary method (with material support)
obj.material.emissive = color;           // Overlay color (glows)
obj.material.emissiveIntensity = 0.7;    // 70% intensity
obj.material.color = color;              // Base color (fallback)

// Fallback method (no material)
obj.color = color;                       // Direct color property
```

### Why Emissive Overlay?
- **Texture Compatible**: Works with existing textures
- **Glow Effect**: Adds depth and vibrancy
- **Consistent**: Maintains visual quality across different materials
- **Intensity Control**: Can adjust brightness via `emissiveIntensity`

---

## Texture System (Future)

### Pattern Overlays (Planned)
Currently in store but not implemented:

```typescript
export type PatternType = 'none' | 'camo' | 'tiger_stripe';

interface PatternConfig {
  type: PatternType;
  intensity: number;      // 0-1 (opacity)
  applyToZones: HelmetZone[];
}
```

### Texture Application (To Be Implemented)
Will use Spline's texture loading:
- Base material texture (UV mapped)
- Pattern overlay texture (blended)
- Decal system for logos/numbers

---

## CFB Team Color Presets

### Available in ColorPicker Component
Located in `types/helmet.ts`:

1. **Clemson** - Orange `#FF6600` / Purple `#522D80`
2. **Alabama** - Crimson `#9E1B32` / White `#FFFFFF`
3. **Georgia** - Red `#BA0C2F` / Black `#000000`
4. **Ohio State** - Scarlet `#BB0000` / Gray `#666666`
5. **Michigan** - Blue `#00274C` / Maize `#FFCB05`
6. **Texas** - Burnt Orange `#BF5700` / White `#FFFFFF`
7. **Notre Dame** - Gold `#0C2340` / Gold `#C99700`
8. **LSU** - Purple `#461D7C` / Gold `#FDD023`
9. **Penn State** - Blue `#041E42` / White `#FFFFFF`
10. **USC** - Cardinal `#990000` / Gold `#FFC72C`
11. **Florida** - Orange `#FA4616` / Blue `#003087`
12. **Oregon** - Green `#154733` / Yellow `#FEE123`

---

## Basic Color Palette

16 standard colors available in ColorPicker:
- Red: `#FF0000`
- Orange: `#FF6600`
- Yellow: `#FFFF00`
- Green: `#00FF00`
- Blue: `#0000FF`
- Purple: `#800080`
- Pink: `#FF69B4`
- White: `#FFFFFF`
- Black: `#000000`
- Gray: `#808080`
- Light Gray: `#D3D3D3`
- Dark Gray: `#404040`
- Brown: `#8B4513`
- Navy: `#000080`
- Teal: `#008080`
- Maroon: `#800000`

---

## Material Debug Info

### Checking Material Availability
The code logs which objects have materials:

```typescript
foundObjects.forEach(obj => {
  const hasMaterial = !!(obj as any).material;
  console.log(`  - ${obj.name}: material=${hasMaterial ? '✓' : '✗'}`);
});
```

### Expected Results (Based on Spline Scene)
All helmet parts should have materials:
- ✅ UV01_Shell: material=✓
- ✅ Facemask_Complete: material=✓
- ✅ UV01_Chinstrap: material=✓
- ✅ UV02_Chinstrap_Strap: material=✓
- ✅ UV03_Chinstrap: material=✓
- ✅ Hardware_* (all): material=✓
- ✅ UV01_Padding: material=✓
- ✅ UV03_Padding: material=✓

---

## Code Location Reference

### Color System
- **Default Colors**: `store/helmetStore.ts` (lines 66-87)
- **Color Application**: `lib/spline-helmet.ts` (changeZoneColor function)
- **Color Picker UI**: `app/components/ColorPicker.tsx`

### Material System
- **Finish Presets**: `store/helmetStore.ts` (lines 90-111)
- **Finish Application**: `lib/spline-helmet.ts` (applyZoneFinish function)
- **Finish Selector UI**: `app/components/FinishSelector.tsx`

### Pattern System (Planned)
- **Pattern Types**: `store/helmetStore.ts` (line 10)
- **Pattern Config**: `store/helmetStore.ts` (lines 33-38)
- **Pattern Actions**: `store/helmetStore.ts` (setPattern, togglePatternZone)
- **Pattern Application**: `lib/spline-helmet.ts` (applyPattern function - TODO)

---

## Summary

### Working Features ✅
- [x] 5-zone color customization
- [x] 5 material finish types
- [x] CFB team color presets
- [x] Basic color palette
- [x] Material overlay system
- [x] Real-time Spline updates

### Planned Features 🔄
- [ ] Pattern/texture overlays (camo, tiger stripe)
- [ ] Decal system (logos, numbers)
- [ ] Texture loading from files
- [ ] Advanced material blending
- [ ] Team preset configurations (full helmet)

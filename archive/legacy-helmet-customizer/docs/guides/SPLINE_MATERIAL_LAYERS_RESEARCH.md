# Spline Material Layers Research

**Last Updated:** 2024-11-20  
**Source:** Spline Official Documentation via MCP

---

## Overview

Spline uses a **layer-based material system** (similar to Photoshop). Understanding these layers is crucial for implementing material finishes since roughness/metalness are NOT direct properties.

---

## Core Layer Properties

**All material layers share these common properties:**
- **Opacity** (0-1): Controls layer transparency
- **Blending**: How layer blends with layers below (Normal, Multiply, Screen, etc.)

**Variables can be attached to:**
- Layer opacity
- Layer-specific properties (if exposed)
- Object properties (position, scale, rotation, color)

---

## Layer Types & Properties

### 1. Color Layer 🎨

**Purpose:** Base color for objects

**Properties:**
- **HUE**: Color picker
- **Opacity/Alpha**: Transparency (0-1)

**Default:** Every object has a Color Layer by default

**Use Cases:**
- Base color for helmet zones
- Variables can be attached to color and opacity

**Runtime Control:**
```typescript
// Color can be changed via object.color property
obj.color = '#FF0000';
```

---

### 2. Lighting Layer 💡

**Purpose:** Controls how object responds to light

**Types:**
- **Lambert**: Matte, no highlights (Concrete, Sand) - Good for matte finishes
- **Phong**: Specular reflection (Plastic, Skin) - Good for glossy finishes
- **Physical**: More controls (Metal, Ceramic) - Good for metallic finishes
  - **Requires Roughness Map** to access Roughness/Metalness/Reflectivity parameters
- **Toon**: Cartoonish effect

**Default:** Phong for 3D objects, None for 2D objects

**Properties:**
- **Type**: Lambert/Phong/Physical/Toon (can be controlled via variables)
- **Roughness** (Physical only, with Roughness Map): 0-1
- **Metalness** (Physical only, with Roughness Map): 0-1
- **Reflectivity** (Physical only, with Roughness Map): 0-1

**Use Cases:**
- **Matte finishes**: Lambert
- **Glossy finishes**: Phong
- **Metallic finishes**: Physical + Roughness Map

**Variables Setup:**
1. Create Number variable: `shellLightingType` (0=Lambert, 1=Phong, 2=Physical, 3=Toon)
2. Attach to Lighting Layer → Type property
3. For Physical: Create `shellRoughness`, `shellMetalness` variables
4. Attach to Physical layer parameters (requires Roughness Map)

---

### 3. Matcap Layer ✨

**Purpose:** Projects texture on geometry for consistent material appearance

**Key Features:**
- **Independent of lighting** - consistent appearance regardless of scene lights
- **Independent of perspective** - same look from all angles
- **Quick material simulation** - metal, plastic, wood, etc.

**Properties:**
- **Matcap Texture**: Upload custom or select from Spline Library
- **Opacity**: Layer transparency
- **Blending**: Blend mode

**Use Cases:**
- **Shiny/metallic finishes**: Use metallic matcap textures
- **Consistent shine**: Add shine independent of lighting
- **Quick material look**: Pre-baked material appearance

**Variables Setup:**
1. Create Number variable: `shellMatcapOpacity` (0-1)
2. Attach to Matcap Layer → Opacity property
3. Control visibility/intensity via opacity

**Runtime Control:**
- May not be directly accessible via runtime API
- Use opacity variable to fade in/out matcap effect

---

### 4. Image Layer 🖼️

**Purpose:** Upload or AI-generate textures

**Properties:**
- **Image**: Upload or generate with AI
- **Opacity**: Layer transparency
- **Blending**: Blend mode
- **Wrapping**: Clamp/Repeat/Mirror
- **Sharpness**: Texture clarity
- **Crop**: Use part of texture
- **Scale**: Texture size
- **Offset**: Texture position (X, Y)
- **Rotation**: Texture angle

**Special Uses:**
- **Roughness Map**: Can be assigned to Physical Lighting Layer
- **Bump Map**: Can be used for surface detail
- **Texture**: Standard texture mapping

**Use Cases:**
- **Roughness Map for Physical layer**: Enables roughness/metalness control
- **Custom textures**: Team logos, patterns, decals
- **AI-generated textures**: Procedural material generation

**Variables Setup:**
1. For Roughness Map: Assign Image layer to Physical Lighting Layer → Rough Map
2. Create variables for Physical layer parameters (roughness, metalness)
3. Variables control PBR properties when Physical + Roughness Map is active

---

### 5. Fresnel Layer 🌈

**Purpose:** Simulates reflections based on viewing angle

**Key Features:**
- **Angle-dependent**: More visible at edges, fades at center
- **Metallic reflections**: Perfect for shiny/metallic surfaces
- **View-dependent**: Changes based on camera angle

**Properties:**
- **Color**: Fresnel reflection color
- **Intensity**: Strength of effect
- **Bias**: Controls where effect appears
- **Scale**: Size of effect
- **Opacity**: Layer transparency
- **Blending**: Blend mode

**Use Cases:**
- **Metallic finishes**: Chrome, brushed metal, anodized
- **Shiny surfaces**: Wet clearcoat, ceramic gloss
- **Edge highlights**: Add rim lighting effect

**Variables Setup:**
1. Create Number variables:
   - `shellFresnelOpacity` (0-1): Control visibility
   - `shellFresnelIntensity` (0-1): Control strength
   - `shellFresnelBias` (0-1): Control position
2. Attach to Fresnel Layer properties
3. Use opacity to fade in/out metallic effect

**Layer Combination:**
- Combine with Physical Lighting Layer for realistic metallic look
- Use with Matcap for enhanced shine

---

### 6. Glass Layer 🔷

**Purpose:** Adds transparent/translucent glass-like appearance

**Key Features:**
- **Clearcoat effect**: Adds glossy protective layer
- **Refraction**: Light bending through material
- **Reflection**: Surface reflections like real glass

**Properties:**
- **Opacity**: Layer transparency (0-1)
- **Refraction**: Index of refraction (IOR)
- **Roughness**: Surface smoothness
- **Blending**: Blend mode
- **Color**: Tint color (optional)

**Use Cases:**
- **Clearcoat finishes**: Wet clearcoat, ceramic gloss
- **Glossy protection**: Add protective layer over base material
- **Glass materials**: Actual glass objects

**Variables Setup:**
1. Create Number variables:
   - `shellGlassOpacity` (0-1): Control visibility
   - `shellGlassRoughness` (0-1): Control surface smoothness
2. Attach to Glass Layer properties
3. Use opacity to fade in/out clearcoat effect

**Layer Combination:**
- Combine with Phong Lighting Layer for glossy finishes
- Use with Fresnel for enhanced reflections

---

### 7. Outline Layer ✏️

**Purpose:** Adds edge/outline effect to objects

**Key Features:**
- **Edge detection**: Automatically detects object edges
- **Stylized look**: Cartoon/comic book style
- **Emphasis**: Highlights object boundaries

**Properties:**
- **Color**: Outline color
- **Width**: Thickness of outline (pixels or world units)
- **Opacity**: Layer transparency
- **Blending**: Blend mode
- **Mode**: Inside/Outside/Center

**Use Cases:**
- **Stylized finishes**: Cartoon/anime style helmets
- **Edge emphasis**: Highlight zone boundaries
- **Visual separation**: Distinguish between helmet zones

**Variables Setup:**
1. Create Number variables:
   - `shellOutlineOpacity` (0-1): Control visibility
   - `shellOutlineWidth` (0-10): Control thickness
2. Create Color variable: `shellOutlineColor`
3. Attach to Outline Layer properties
4. Use opacity to fade in/out outline effect

**Layer Combination:**
- Works with any Lighting Layer type
- Can be combined with other layers for unique effects

**Note:** Outline layer may not be directly accessible via runtime API. Use variables for control.

---

### 8. Additional Layers (Under Investigation)

Based on runtime inspection, these layers may also exist:

#### Noise Layer
- **Purpose**: Adds procedural noise/texture
- **Use Cases**: Surface variation, texture detail
- **Status**: Needs verification

#### Displace Layer
- **Purpose**: Displaces geometry based on texture
- **Use Cases**: Surface detail, bump effects
- **Status**: Needs verification

#### Pattern Layer
- **Purpose**: Repeating patterns/textures
- **Use Cases**: Decorative patterns, logos
- **Status**: Needs verification

#### Gradient Layer
- **Purpose**: Color gradients
- **Use Cases**: Color transitions, fades
- **Status**: Needs verification

---

## Layer Combinations for Finishes

### Glossy Finish
**Layers:**
1. Color Layer (base color)
2. Lighting Layer: Phong
3. Glass Layer (optional, for clearcoat effect)
4. Matcap Layer (optional, for consistent shine)

**Variables:**
- `lightingType = 1` (Phong)
- `glassOpacity` (0-1, optional)
- `matcapOpacity` (0-1, optional)

---

### Matte Finish
**Layers:**
1. Color Layer (base color)
2. Lighting Layer: Lambert
3. No additional layers needed

**Variables:**
- `lightingType = 0` (Lambert)

---

### Chrome/Metallic Finish
**Layers:**
1. Color Layer (base color)
2. Lighting Layer: Physical (with Roughness Map)
3. Fresnel Layer (for metallic reflections)
4. Matcap Layer (optional, for consistent shine)

**Variables:**
- `lightingType = 2` (Physical)
- `roughness = 0.05` (very smooth)
- `metalness = 1.0` (fully metallic)
- `fresnelOpacity = 0.8` (strong metallic reflections)
- `matcapOpacity = 0.3` (subtle shine)

---

### Brushed Metal Finish
**Layers:**
1. Color Layer (base color)
2. Lighting Layer: Physical (with Roughness Map)
3. Fresnel Layer (for metallic reflections)
4. Image Layer (brushed texture pattern)

**Variables:**
- `lightingType = 2` (Physical)
- `roughness = 0.35` (brushed texture)
- `metalness = 0.9` (metallic)
- `fresnelOpacity = 0.6` (moderate reflections)
- `imageOpacity = 0.4` (brushed pattern overlay)

---

### Satin Finish
**Layers:**
1. Color Layer (base color)
2. Lighting Layer: Phong
3. Fresnel Layer (subtle, low opacity)

**Variables:**
- `lightingType = 1` (Phong)
- `fresnelOpacity = 0.2` (subtle reflections)

---

## Variables Attachment Strategy

### Strategy 1: Lighting Layer Type Control
**Best for:** Simple finish switching

**Setup:**
1. Create Number variable: `shellLightingType`
2. Values: 0=Lambert, 1=Phong, 2=Physical, 3=Toon
3. Attach to Lighting Layer → Type property
4. Runtime: `spline.setVariable('shellLightingType', 2)`

**Limitations:**
- Only 4 basic types
- Physical type requires Roughness Map for full control

---

### Strategy 2: Layer Opacity Control
**Best for:** Adding/removing effects (Fresnel, Matcap, Glass)

**Setup:**
1. Create Number variables: `shellFresnelOpacity`, `shellMatcapOpacity`, `shellGlassOpacity`
2. Attach to respective layer → Opacity property
3. Runtime: `spline.setVariable('shellFresnelOpacity', 0.8)`

**Use Cases:**
- Fade in metallic reflections (Fresnel)
- Add/remove shine (Matcap)
- Control clearcoat effect (Glass)

---

### Strategy 3: Physical Layer Parameters (Advanced)
**Best for:** Precise PBR control

**Setup:**
1. Set Lighting Layer to Physical
2. Add Image Layer → Assign as Roughness Map to Physical layer
3. Create Number variables: `shellRoughness`, `shellMetalness`, `shellReflectivity`
4. Attach to Physical layer → Roughness/Metalness/Reflectivity properties
5. Runtime: `spline.setVariable('shellRoughness', 0.1)`

**Requirements:**
- Physical Lighting Layer
- Roughness Map (Image layer) assigned
- Variables attached to Physical layer parameters

---

## Runtime API Limitations

**What's Available:**
- ✅ Object properties: `position`, `rotation`, `scale`, `color`, `visible`
- ✅ Variables: `setVariable()`, `getVariable()`
- ✅ Events: `emitEvent()`, event listeners

**What's NOT Available (likely):**
- ❌ Direct layer property access
- ❌ Layer creation/deletion
- ❌ Layer type switching (may need variables)
- ❌ Layer opacity (may need variables)

**Workaround:**
- Use Variables attached to layer properties
- Control via `setVariable()` at runtime
- Requires editor setup for variable attachment

---

## Recommended Implementation Strategy

### Phase 1: Basic Finishes (Lighting Layer Type)
1. Create variables: `shellLightingType`, `facemaskLightingType`, etc.
2. Attach to Lighting Layer → Type property
3. Map finishes:
   - Matte → Lambert (0)
   - Glossy → Phong (1)
   - Metallic → Physical (2)

### Phase 2: Enhanced Finishes (Layer Combinations)
1. Pre-create layers in Spline Editor:
   - Fresnel layer (for metallic)
   - Matcap layer (for shine)
   - Glass layer (for clearcoat)
2. Create opacity variables for each layer
3. Attach variables to layer opacity
4. Control via runtime: `setVariable('shellFresnelOpacity', 0.8)`

### Phase 3: Advanced PBR (Physical + Roughness Map)
1. Set Lighting Layer to Physical
2. Add Image Layer → Assign as Roughness Map
3. Create roughness/metalness variables
4. Attach to Physical layer parameters
5. Control precise PBR values at runtime

---

## Material Finish → Layer Mapping

| Finish | Lighting Type | Additional Layers | Variables Needed |
|--------|--------------|-------------------|------------------|
| **glossy** | Phong (1) | Glass (optional) | `lightingType`, `glassOpacity` |
| **matte** | Lambert (0) | None | `lightingType` |
| **chrome** | Physical (2) | Fresnel, Matcap | `lightingType`, `roughness`, `metalness`, `fresnelOpacity` |
| **brushed** | Physical (2) | Fresnel, Image (texture) | `lightingType`, `roughness`, `metalness`, `fresnelOpacity` |
| **satin** | Phong (1) | Fresnel (low) | `lightingType`, `fresnelOpacity` |
| **wet_clearcoat** | Phong (1) | Glass, Fresnel | `lightingType`, `glassOpacity`, `fresnelOpacity` |
| **ceramic_gloss** | Phong (1) | Glass, Matcap | `lightingType`, `glassOpacity`, `matcapOpacity` |
| **anodized_metal** | Physical (2) | Fresnel, Rainbow | `lightingType`, `roughness`, `metalness`, `fresnelOpacity` |
| **carbon_fiber** | Physical (2) | Image (pattern), Fresnel | `lightingType`, `roughness`, `metalness`, `imageOpacity` |

---

---

## Research Summary: Material Finish Implementation Strategies

### Key Finding: Runtime API Cannot Directly Change Materials

**Problem:** Spline Runtime API does NOT expose `material.metalness` or `material.roughness` as direct properties. These only exist on Physical Lighting Layer when a Roughness Map is assigned.

**Solution:** Multi-strategy approach using:
1. **Variables** attached to layer properties (recommended)
2. **Layer combinations** (Fresnel, Matcap, Glass)
3. **Material cloning** (fallback via THREE.js)

---

## Complete Layer Reference

| Layer | Purpose | Key Properties | Use For Finishes |
|-------|---------|----------------|------------------|
| **Color** | Base color | HUE, Opacity | All finishes (base) |
| **Lighting** | Light response | Type (Lambert/Phong/Physical/Toon), Roughness, Metalness* | Core finish control |
| **Matcap** | Consistent shine | Texture, Opacity | Shiny/metallic finishes |
| **Image** | Textures | Image, Opacity, Scale, Offset | Roughness Map, textures |
| **Fresnel** | Edge reflections | Color, Intensity, Bias, Opacity | Metallic/shiny finishes |
| **Glass** | Clearcoat | Opacity, Roughness, IOR | Glossy/clearcoat finishes |
| **Outline** | Edge detection | Color, Width, Opacity | Stylized finishes |

*Roughness/Metalness only available on Physical Lighting Layer with Roughness Map

---

## Quick Reference: Finish → Layer Strategy

### Simple Finishes (Lighting Layer Only)
```typescript
// Matte
spline.setVariable('shellLightingType', 0); // Lambert

// Glossy
spline.setVariable('shellLightingType', 1); // Phong

// Metallic (requires Physical + Roughness Map setup)
spline.setVariable('shellLightingType', 2); // Physical
spline.setVariable('shellRoughness', 0.05);
spline.setVariable('shellMetalness', 1.0);
```

### Enhanced Finishes (Layer Combinations)
```typescript
// Chrome (Physical + Fresnel + Matcap)
spline.setVariable('shellLightingType', 2);
spline.setVariable('shellRoughness', 0.05);
spline.setVariable('shellMetalness', 1.0);
spline.setVariable('shellFresnelOpacity', 0.8);
spline.setVariable('shellMatcapOpacity', 0.3);

// Wet Clearcoat (Phong + Glass + Fresnel)
spline.setVariable('shellLightingType', 1);
spline.setVariable('shellGlassOpacity', 0.9);
spline.setVariable('shellFresnelOpacity', 0.4);

// Satin (Phong + Fresnel low)
spline.setVariable('shellLightingType', 1);
spline.setVariable('shellFresnelOpacity', 0.2);
```

---

## Implementation Checklist

### Phase 1: Editor Setup (Required)
- [ ] Create Number variables for Lighting Layer type per zone
- [ ] Attach variables to Lighting Layer → Type property
- [ ] Test variable control in Spline Editor

### Phase 2: Enhanced Finishes (Optional)
- [ ] Pre-create Fresnel layers for metallic finishes
- [ ] Pre-create Matcap layers for shine
- [ ] Pre-create Glass layers for clearcoat
- [ ] Create opacity variables for each layer
- [ ] Attach variables to layer opacity properties

### Phase 3: Advanced PBR (Optional)
- [ ] Set Lighting Layer to Physical
- [ ] Add Image Layer → Assign as Roughness Map
- [ ] Create roughness/metalness variables
- [ ] Attach variables to Physical layer parameters

### Phase 4: Runtime Testing
- [ ] Test all finish types via `setVariable()`
- [ ] Verify layer combinations work correctly
- [ ] Test fallback strategies (cloning, direct)
- [ ] Monitor performance impact

---

## Common Patterns

### Pattern 1: Basic Finish Switch
```typescript
// Switch between matte/glossy/metallic
const finishMap = {
  matte: 0,    // Lambert
  glossy: 1,   // Phong
  chrome: 2    // Physical
};
spline.setVariable(`${zone}LightingType`, finishMap[finish]);
```

### Pattern 2: Layer Fade In/Out
```typescript
// Fade in metallic effect
spline.setVariable(`${zone}FresnelOpacity`, 0); // Start hidden
// ... animate to 0.8 over time
spline.setVariable(`${zone}FresnelOpacity`, 0.8); // Fully visible
```

### Pattern 3: Combined Effect
```typescript
// Apply multiple layers for complex finish
function applyChromeFinish(zone: string) {
  spline.setVariable(`${zone}LightingType`, 2); // Physical
  spline.setVariable(`${zone}Roughness`, 0.05);
  spline.setVariable(`${zone}Metalness`, 1.0);
  spline.setVariable(`${zone}FresnelOpacity`, 0.8);
  spline.setVariable(`${zone}MatcapOpacity`, 0.3);
}
```

---

## Troubleshooting

### Variables Not Working?
- ✅ Check variable exists in Spline Editor
- ✅ Verify variable is attached to correct property
- ✅ Ensure variable type matches (Number vs String)
- ✅ Test variable in Spline Editor preview first

### Layers Not Visible?
- ✅ Check layer opacity is > 0
- ✅ Verify layer blending mode
- ✅ Ensure layer is above Color Layer in stack
- ✅ Check if layer requires specific Lighting Layer type

### Physical Layer Not Responding?
- ✅ Verify Roughness Map is assigned
- ✅ Check Image Layer is assigned to Physical → Rough Map
- ✅ Ensure variables are attached to Physical layer parameters
- ✅ Test with Physical Lighting Layer active

---

## References

- [Spline Material Layers Documentation](https://docs.spline.design/materials-shading/creating-material-layers)
- [Lighting Layer](https://docs.spline.design/materials-shading/lighting-layer)
- [Matcap Layer](https://docs.spline.design/materials-shading/matcap-layer)
- [Fresnel Layer](https://docs.spline.design/materials-shading/fresnel-layer)
- [Image Layer](https://docs.spline.design/materials-shading/image-layer)
- [Color Layer](https://docs.spline.design/materials-shading/color-layer)
- [Variables Documentation](https://docs.spline.design/interaction-states-events-and-actions/variables)


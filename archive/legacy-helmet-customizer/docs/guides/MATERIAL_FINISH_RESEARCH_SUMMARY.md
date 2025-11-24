# Material Finish Research Summary

**Last Updated:** 2024-11-20  
**Purpose:** Quick reference for material finish implementation strategies in Spline

---

## Key Research Findings

### 1. Core Problem
**Spline Runtime API cannot directly change materials.** The `material.metalness` and `material.roughness` properties are NOT exposed as direct properties. They only exist on the **Physical Lighting Layer** when a **Roughness Map** is assigned.

### 2. Solution: Layer-Based Material System
Spline uses a **layer-based material system** (like Photoshop). Material finishes must be implemented using:
- **Variables** attached to layer properties
- **Layer combinations** (Fresnel, Matcap, Glass, etc.)
- **Material cloning** (fallback via THREE.js)

---

## Material Layers Research

### Core Layers

| Layer | Purpose | Key Use Case |
|-------|---------|--------------|
| **Color** | Base color | All finishes (required) |
| **Lighting** | Light response | Core finish control (Lambert/Phong/Physical/Toon) |
| **Matcap** | Consistent shine | Shiny/metallic finishes (independent of lighting) |
| **Image** | Textures | Roughness Map, custom textures |
| **Fresnel** | Edge reflections | Metallic/shiny finishes (view-dependent) |
| **Glass** | Clearcoat | Glossy/clearcoat finishes |
| **Outline** | Edge detection | Stylized finishes |

### Layer Properties Research

**All layers share:**
- Opacity (0-1) - Can be controlled via variables
- Blending mode - How layer blends with layers below

**Lighting Layer specific:**
- Type: Lambert (matte), Phong (glossy), Physical (metallic), Toon
- Physical only: Roughness, Metalness, Reflectivity (requires Roughness Map)

**Fresnel Layer:**
- Color, Intensity, Bias, Scale - Perfect for metallic reflections

**Matcap Layer:**
- Texture selection - Consistent shine independent of lighting

**Glass Layer:**
- Opacity, Roughness, IOR - Clearcoat effect

---

## Implementation Strategies

### Strategy 1: Variables + Lighting Layer Type (Simplest)
```typescript
// Create variables in Spline Editor:
// shellLightingType (Number: 0=Lambert, 1=Phong, 2=Physical, 3=Toon)

// Runtime:
spline.setVariable('shellLightingType', 1); // Glossy (Phong)
spline.setVariable('shellLightingType', 0); // Matte (Lambert)
spline.setVariable('shellLightingType', 2); // Metallic (Physical)
```

**Pros:** Simple, fast, no material cloning  
**Cons:** Limited to 4 basic types, Physical requires Roughness Map setup

---

### Strategy 2: Variables + Layer Opacity (Enhanced)
```typescript
// Pre-create layers in Spline Editor:
// - Fresnel layer (for metallic)
// - Matcap layer (for shine)
// - Glass layer (for clearcoat)

// Create opacity variables:
// shellFresnelOpacity, shellMatcapOpacity, shellGlassOpacity

// Runtime:
spline.setVariable('shellFresnelOpacity', 0.8); // Fade in metallic
spline.setVariable('shellMatcapOpacity', 0.3);   // Add shine
spline.setVariable('shellGlassOpacity', 0.9);    // Add clearcoat
```

**Pros:** More control, can combine layers  
**Cons:** Requires editor setup, more variables to manage

---

### Strategy 3: Variables + Physical Layer Parameters (Advanced)
```typescript
// Setup in Spline Editor:
// 1. Set Lighting Layer to Physical
// 2. Add Image Layer → Assign as Roughness Map
// 3. Create variables: shellRoughness, shellMetalness

// Runtime:
spline.setVariable('shellLightingType', 2);      // Physical
spline.setVariable('shellRoughness', 0.05);      // Very smooth
spline.setVariable('shellMetalness', 1.0);       // Fully metallic
```

**Pros:** Precise PBR control, realistic materials  
**Cons:** Requires Roughness Map setup, more complex

---

## Finish → Layer Mapping

### Simple Finishes
- **Matte**: Lambert Lighting Layer
- **Glossy**: Phong Lighting Layer
- **Metallic**: Physical Lighting Layer + Roughness Map

### Enhanced Finishes
- **Chrome**: Physical + Fresnel + Matcap
- **Brushed Metal**: Physical + Fresnel + Image (texture)
- **Satin**: Phong + Fresnel (low opacity)
- **Wet Clearcoat**: Phong + Glass + Fresnel
- **Ceramic Gloss**: Phong + Glass + Matcap

---

## Research Status

### ✅ Fully Documented
- Color Layer
- Lighting Layer (Lambert, Phong, Physical, Toon)
- Matcap Layer
- Image Layer (including Roughness Map)
- Fresnel Layer
- Glass Layer
- Outline Layer

### 🔍 Under Investigation
- Noise Layer (procedural noise/texture)
- Displace Layer (geometry displacement)
- Pattern Layer (repeating patterns)
- Gradient Layer (color gradients)

---

## Quick Reference: Common Patterns

### Pattern 1: Basic Finish Switch
```typescript
const finishMap = {
  matte: 0,    // Lambert
  glossy: 1,   // Phong
  chrome: 2   // Physical
};
spline.setVariable(`${zone}LightingType`, finishMap[finish]);
```

### Pattern 2: Layer Fade
```typescript
// Fade in metallic effect
spline.setVariable(`${zone}FresnelOpacity`, 0.8);
```

### Pattern 3: Combined Effect
```typescript
// Chrome finish
spline.setVariable(`${zone}LightingType`, 2);
spline.setVariable(`${zone}Roughness`, 0.05);
spline.setVariable(`${zone}Metalness`, 1.0);
spline.setVariable(`${zone}FresnelOpacity`, 0.8);
spline.setVariable(`${zone}MatcapOpacity`, 0.3);
```

---

## Related Documentation

- **[Material Finish Implementation Guide](./MATERIAL_FINISH_IMPLEMENTATION.md)** - Complete implementation guide with code examples
- **[Spline Material Layers Research](./SPLINE_MATERIAL_LAYERS_RESEARCH.md)** - Detailed layer documentation
- **[Spline Runtime API Reference](../api-reference/SPLINE_RUNTIME_API.md)** - Runtime API documentation

---

## Next Steps

1. **Test Layer Combinations**: Experiment with Fresnel + Matcap + Glass combinations
2. **Verify Outline Layer**: Test if Outline layer is accessible via runtime API
3. **Investigate Additional Layers**: Research Noise, Displace, Pattern, Gradient layers
4. **Performance Testing**: Measure impact of layer combinations on performance
5. **Variable Optimization**: Optimize variable setup for all 19 finish types

---

## Notes

- All research based on Spline Runtime API v1.9.98
- Layer accessibility may vary by Spline version
- Variables approach is most reliable (editor setup required)
- Material cloning is fallback when variables not available
- Layer combinations provide most realistic results


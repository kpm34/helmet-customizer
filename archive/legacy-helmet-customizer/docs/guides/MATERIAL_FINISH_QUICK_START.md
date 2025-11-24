# Material Finish Quick Start

**Quick reference for using the new multi-strategy material finish system.**

**⚠️ IMPORTANT:** Spline does NOT expose roughness/metalness as direct properties. These are only available on the **Physical Lighting Layer** with a **Roughness Map** assigned. The system uses multiple strategies to work around this limitation.

---

## 🚀 Basic Usage

```typescript
import { applyZoneFinish } from '@/lib/spline-material-finish';

// Apply finish - automatically tries all strategies
const result = applyZoneFinish(spline, 'shell', 'chrome');

if (result.success) {
  console.log(`✅ Success! Used strategy: ${result.strategy}`);
} else {
  console.error(`❌ Failed: ${result.message}`);
}
```

---

## 📋 Strategy Options

### Option 1: Auto (Recommended)
Tries all strategies automatically:
```typescript
applyZoneFinish(spline, 'shell', 'chrome');
// Tries: Variables → Layers → Cloning → Direct
```

### Option 2: Force Variables
Only use Spline Variables + Material Layers (requires editor setup):
```typescript
applyZoneFinish(spline, 'shell', 'chrome', 'variables');
```

### Option 3: Force Layers
Only use Material Layer manipulation (may not be available):
```typescript
applyZoneFinish(spline, 'shell', 'chrome', 'layers');
```

### Option 4: Force Cloning
Only use material cloning (no editor setup needed):
```typescript
applyZoneFinish(spline, 'shell', 'chrome', 'cloning');
```

### Option 5: Force Direct
Only use direct THREE.js manipulation (last resort):
```typescript
applyZoneFinish(spline, 'shell', 'chrome', 'direct');
```

---

## 🎨 Available Finishes

```typescript
// Basic finishes
'glossy' | 'matte' | 'chrome' | 'brushed' | 'satin'

// Premium finishes
'pearl_coat' | 'satin_automotive' | 'metallic_flake' | 'wet_clearcoat'

// Metal finishes
'anodized_metal' | 'brushed_titanium' | 'weathered_metal'

// Modern finishes
'carbon_fiber' | 'rubberized_softtouch' | 'ceramic_gloss'

// Special effects
'frosted_polycarbonate' | 'holographic_foil'
```

---

## 🔧 Advanced Usage

### Clear Material Cache
```typescript
import { clearMaterialCache } from '@/lib/spline-material-finish';

// Clear cache for one zone
clearMaterialCache('shell');

// Clear all caches
clearMaterialCache();
```

### Restore Original Materials
```typescript
import { restoreOriginalMaterials } from '@/lib/spline-material-finish';

restoreOriginalMaterials(spline, 'shell');
```

### Get Cache Statistics
```typescript
import { getMaterialCacheStats } from '@/lib/spline-material-finish';

const stats = getMaterialCacheStats();
console.log(stats);
// { cachedFinishes: 5, cachedObjects: 12, originalMaterials: 7 }
```

---

## ✅ Integration Checklist

- [x] Import `applyZoneFinish` from `@/lib/spline-material-finish`
- [x] Call `applyZoneFinish()` when finish changes
- [x] Handle result.success for error checking
- [x] (Optional) Set up Spline Variables for Strategy 1
- [x] (Optional) Use cache management for performance

---

## 🐛 Troubleshooting

**Problem:** All strategies fail  
**Solution:** Check zone objects exist and have materials

**Problem:** Variables strategy fails  
**Solution:** 
- Set up variables in Spline Editor (see full docs)
- Attach variables to Lighting Layer "Type" property
- For Physical layer, ensure Roughness Map is assigned

**Problem:** "Roughness/Metalness not available"  
**Solution:** 
- These properties only exist on Physical Lighting Layer with Roughness Map
- Use Lighting Layer Type variables instead (Lambert/Phong/Physical)
- Or set up Physical layer with Roughness Map (see full docs)

**Problem:** Cloning strategy fails  
**Solution:** 
- Check THREE.js scene access
- Verify zone patterns match scene hierarchy
- Spline's layer-based materials may not expose these properties

**Problem:** Direct strategy fails  
**Solution:** 
- Materials use Spline's layer system, not direct properties
- Try Variables or Cloning strategies instead

---

## 📚 Full Documentation

See [MATERIAL_FINISH_IMPLEMENTATION.md](./MATERIAL_FINISH_IMPLEMENTATION.md) for complete details.


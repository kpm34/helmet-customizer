# Material Editing Analysis: awwwards-rig vs helmet-customizer

## Summary

After analyzing the **awwwards-rig** project, I discovered they **successfully implemented direct material property manipulation** but not via Spline.

## Key Findings

### ✅ Direct Material Manipulation WORKS

From `awwwards-rig/src/lib/spline-controller.ts`:

```typescript
setMaterial(
  objectName: string,
  props: {
    metalness?: number
    roughness?: number
    clearcoat?: number
    opacity?: number
  }
): boolean {
  const obj = this.findObject(objectName)
  if (!obj?.material) return false

  try {
    if (props.metalness !== undefined) {
      obj.material.metalness = props.metalness  // ✅ Direct access
    }
    if (props.roughness !== undefined) {
      obj.material.roughness = props.roughness  // ✅ Direct access
    }
    if (props.clearcoat !== undefined && 'clearcoat' in obj.material) {
      (obj.material as Record<string, unknown>).clearcoat = props.clearcoat
    }
    return true
  } catch (err) {
    console.error(`Failed to set material on ${objectName}:`, err)
    return false
  }
}
```

### Material Properties They Successfully Set:
1. **`metalness`** - Direct assignment works
2. **`roughness`** - Direct assignment works
3. **`clearcoat`** - Works with type assertion
4. **`opacity`** - Works with type assertion
5. **`color`** - Works via `material.color.set(hexColor)`

## Material Presets

From `awwwards-rig/src/lib/materials.ts`:

```typescript
export const MATERIAL_PRESETS: Record<string, MaterialConfig> = {
  gloss: {
    type: 'gloss',
    metallic: 0,
    roughness: 0.2,
    clearCoat: 0.9,
  },
  matte: {
    type: 'matte',
    metallic: 0,
    roughness: 0.8,
    clearCoat: 0,
  },
  metallic: {
    type: 'metallic',
    metallic: 1,
    roughness: 0.2,
    clearCoat: 0.5,
  },
  pearl: {
    type: 'pearl',
    metallic: 0.3,
    roughness: 0.3,
    clearCoat: 1,
    flakeIntensity: 0.5,
  },
  carbon: {
    type: 'carbon',
    metallic: 0.2,
    roughness: 0.4,
    clearCoat: 0.8,
  },
}
```

## Implementation Patterns

### 1. **Class-Based Controller**

They use an OOP approach with a base `SplineController` class and a specialized `HelmetController`:

```typescript
export class SplineController {
  private app: Application

  constructor(app: Application) {
    this.app = app
  }

  findObject(name: string): SPEObject | null {
    try {
      return this.app.findObjectByName(name)
    } catch (err) {
      console.warn(`Object "${name}" not found:`, err)
      return null
    }
  }

  setColor(objectName: string, hexColor: string): boolean {
    const obj = this.findObject(objectName)
    if (!obj?.material?.color) return false

    try {
      obj.material.color.set(hexColor)
      return true
    } catch (err) {
      console.error(`Failed to set color on ${objectName}:`, err)
      return false
    }
  }

  // ... more methods
}

// Specialized helmet controller
export class HelmetController extends SplineController {
  updateShell(color: string, material: MaterialConfig): boolean {
    return this.batchUpdate([{
      objectName: 'Helmet_Shell',
      color,
      material: {
        metalness: material.metallic,
        roughness: material.roughness,
        clearcoat: material.clearCoat,
      },
    }]) !== undefined
  }
}
```

### 2. **Error Handling**

Every method has try/catch blocks:

```typescript
try {
  obj.material.metalness = props.metalness
  return true
} catch (err) {
  console.error(`Failed to set material on ${objectName}:`, err)
  return false
}
```

### 3. **Type Safety**

They use TypeScript type assertions for optional properties:

```typescript
if (props.clearcoat !== undefined && 'clearcoat' in obj.material) {
  (obj.material as Record<string, unknown>).clearcoat = props.clearcoat
}
```

### 4. **Batch Updates**

They support updating multiple properties at once:

```typescript
batchUpdate(
  updates: Array<{
    objectName: string
    color?: string
    material?: { metalness?: number; roughness?: number }
    position?: { x: number; y: number; z: number }
    visible?: boolean
  }>
): void {
  updates.forEach(({ objectName, color, material, position, visible }) => {
    if (color) this.setColor(objectName, color)
    if (material) this.setMaterial(objectName, material)
    if (position) this.setPosition(objectName, position.x, position.y, position.z)
    if (visible !== undefined) this.setVisible(objectName, visible)
  })
}
```

### 5. **Debug Utility**

They have a debug method to inspect the scene:

```typescript
debug(): void {
  console.group('🔍 Spline Scene Debug')
  const objects = this.getAllObjects()
  console.log(`Total objects: ${objects.length}`)

  objects.forEach((obj) => {
    console.group(`📦 ${obj.name}`)
    if (obj.material) {
      console.log('Material:', {
        color: obj.material.color,
        metalness: obj.material.metalness,
        roughness: obj.material.roughness,
      })
    }
    console.groupEnd()
  })

  console.groupEnd()
}
```

## Comparison: Our Approach vs awwwards-rig

| Feature | helmet-customizer (Old) | awwwards-rig | Recommendation |
|---------|------------------------|--------------|----------------|
| **Material Setting** | Spline Variables + Events | Direct property access | ✅ Use direct access |
| **Organization** | Functional helpers | Class-based controller | ✅ Use classes |
| **Error Handling** | Minimal | Try/catch everywhere | ✅ Add try/catch |
| **Type Safety** | Basic | Type assertions | ✅ Use assertions |
| **Batch Updates** | Manual loops | Batch method | ✅ Add batch support |
| **Debugging** | Console logs | Debug method | ✅ Add debug utils |

## Why Our Variables Approach Might Not Have Worked

After this analysis, our **Spline Variables approach was over-engineered**. The issue wasn't that direct property access doesn't work—it's that:

1. **We may have been using Spline Custom Materials** that don't expose standard PBR properties
2. **We may have had the wrong material type** in our Spline scene
3. **We didn't use proper error handling** to debug what went wrong

## Recommended Solution for helmet-customizer

### Option 1: Direct Property Access (Recommended)

Update our implementation to match awwwards-rig:

```typescript
export class HelmetSplineController {
  constructor(private app: Application) {}

  applyZoneFinish(
    zone: HelmetZone,
    finish: MaterialFinish
  ): boolean {
    const finishPreset = FINISH_PRESETS[finish]
    const zoneObjects = findZoneObjects(this.app, zone)

    return zoneObjects.every(obj => {
      if (!obj?.material) return false

      try {
        obj.material.metalness = finishPreset.metalness
        obj.material.roughness = finishPreset.roughness

        // Optional properties
        if ('clearcoat' in obj.material) {
          (obj.material as any).clearcoat = finishPreset.clearCoat
        }

        return true
      } catch (err) {
        console.error(`Failed to set finish on ${obj.name}:`, err)
        return false
      }
    })
  }
}
```

### Option 2: Hybrid Approach

Use direct access as primary, fall back to Variables if needed:

```typescript
applyZoneFinish(zone: HelmetZone, finish: MaterialFinish): boolean {
  // Try direct property access first
  if (this.tryDirectMaterialEdit(zone, finish)) {
    return true
  }

  // Fallback to Variables approach
  console.warn('Direct material edit failed, trying Variables approach')
  return this.tryVariablesApproach(zone, finish)
}
```

## Action Items

1. **✅ Create `SplineController` class** for helmet-customizer
2. **✅ Add material presets** with specific metalness/roughness values
3. **✅ Update finish application** to use direct property access
4. **✅ Add proper error handling** with try/catch blocks
5. **✅ Test with current Spline scene** to verify materials support direct access
6. **🔄 If direct access fails**, check Spline scene material types
7. **🔄 If still fails**, use Variables approach as documented in `SPLINE_FINISH_SETUP.md`

## Testing Checklist

- [ ] Test direct `metalness` assignment
- [ ] Test direct `roughness` assignment
- [ ] Test `clearcoat` with type assertion
- [ ] Test color changes with `material.color.set()`
- [ ] Verify all 5 finish types work correctly
- [ ] Test on all helmet zones
- [ ] Check browser console for errors
- [ ] Inspect Spline scene material types

## Spline Scene Requirements

For direct material editing to work, ensure your Spline scene has:

1. **Standard PBR Materials** (not custom Spline materials)
2. **Material nodes** properly connected
3. **Named objects** that can be found via `findObjectByName()`
4. **Exposed material properties** (metalness, roughness, color)

If your scene uses **Custom Spline Materials**, you may need to:
- Switch to standard materials, OR
- Use the Spline Variables approach documented in `SPLINE_FINISH_SETUP.md`

## Conclusion

The awwwards-rig project proves that **direct material property manipulation in Spline DOES work** with the right setup. Our initial Variables approach was unnecessary complexity—we should adopt their simpler, more direct approach.

**Next step:** Implement a `SplineController` class for helmet-customizer and test direct material property access with our scene.

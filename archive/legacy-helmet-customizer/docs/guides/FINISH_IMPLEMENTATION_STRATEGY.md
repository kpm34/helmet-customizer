# Material Finish Implementation Strategy

## The Verdict: Spline Variables Approach is Correct ✅

After analyzing the **awwwards-rig** project and your current implementation, here's the conclusion:

### Why Direct Material Access Won't Work for You

| Factor | awwwards-rig | helmet-customizer |
|--------|--------------|-------------------|
| **Scene Type** | Imported GLB/GLTF models | Spline-native objects |
| **Material System** | Standard Three.js PBR | Custom Spline materials |
| **`metalness`/`roughness`** | ✅ Accessible | ❌ Not exposed |
| **Direct Property Access** | ✅ Works | ❌ Doesn't work |
| **Solution** | Direct manipulation | Spline Variables |

### Evidence from Your Code

From `lib/spline-helmet.ts:104-105`:
```typescript
// Spline uses custom materials that don't respect THREE.js material.color changes
// We must use Spline's native getAllObjects() and direct color assignment
```

You **already discovered** that Spline custom materials don't work with direct Three.js manipulation.

## Why awwwards-rig's Approach Works for Them

The awwwards-rig project likely uses **imported 3D models** (GLB/GLTF files) that have:

1. **Standard Three.js materials** (MeshStandardMaterial, MeshPhysicalMaterial)
2. **Exposed PBR properties** (metalness, roughness, clearcoat)
3. **Direct property access** via `material.metalness = 0.5`

### Your Scene is Different

Your scene uses **Spline-native objects** created in the Spline editor:

1. **Custom Spline material system** (proprietary)
2. **Wrapped material API** (properties are hidden/abstracted)
3. **No direct PBR property access**

## The Solution: Hybrid Approach

### Option 1: Spline Variables (Recommended) ✅

**How it works:**
1. Create Number variables in Spline editor (`shellFinish`, `facemaskFinish`, etc.)
2. Use Variable Change events to swap materials or adjust properties
3. Set variables from runtime: `spline.setVariable('shellFinish', 0)`

**Pros:**
- ✅ Works with Spline custom materials
- ✅ Designer-friendly (controlled in Spline editor)
- ✅ No code changes needed for new finishes
- ✅ Visual feedback in Spline editor

**Cons:**
- ⚠️ Requires setup in Spline editor
- ⚠️ More complex initial configuration

**Implementation:**
```typescript
// Already implemented in your code!
export function applyZoneFinishDirect(
  spline: Application,
  zone: HelmetZone,
  finish: MaterialFinish
): boolean {
  const finishValues = {
    glossy: 0,
    matte: 1,
    chrome: 2,
    brushed: 3,
    satin: 4,
  };

  const variableName = `${zone}Finish`;
  const finishValue = finishValues[finish];

  spline.setVariable?.(variableName, finishValue);
  return true;
}
```

### Option 2: Convert Scene to Use Imported Models ⚙️

**How it works:**
1. Export helmet from Blender as GLB
2. Import GLB into Spline
3. Use standard Three.js materials
4. Apply awwwards-rig approach

**Pros:**
- ✅ Direct property access works
- ✅ More control over materials
- ✅ Better performance (fewer material instances)

**Cons:**
- ⚠️ Major scene reconstruction needed
- ⚠️ Lose Spline editor flexibility
- ⚠️ More complex material setup in Blender

### Option 3: Material Swapping (Alternative)

**How it works:**
1. Create pre-made materials for each finish in Spline
2. Swap materials programmatically

**Pros:**
- ✅ No variables needed
- ✅ Full visual control in Spline

**Cons:**
- ⚠️ More materials to manage (5 finishes × 5 zones = 25 materials)
- ⚠️ Larger scene file size
- ⚠️ Complex material management

**Implementation:**
```typescript
function applyFinish(zone: HelmetZone, finish: MaterialFinish): boolean {
  const obj = spline.findObjectByName(`${zone}_mesh`);
  const material = spline.findObjectByName(`${zone}_${finish}_material`);

  if (!obj || !material) return false;

  // This may or may not work depending on Spline version
  obj.material = material;
  return true;
}
```

## Recommended Path Forward

### Phase 1: Test Current Scene ✅

Run the material access test to confirm:

```typescript
// In browser console after scene loads
testMaterialAccess(splineRef.current);
```

### Phase 2: Spline Variables Setup ⚙️

Follow the setup guide in `SPLINE_FINISH_SETUP.md`:

1. Create 5 Number variables (one per zone)
2. Set up Variable Change events
3. Create material states or use expressions
4. Test in Spline editor
5. Export and test in app

### Phase 3: Fallback Strategy 🔄

If Spline Variables don't work:

**Plan B: Material Swapping**
- Create 25 pre-made materials (5 zones × 5 finishes)
- Implement material swapping logic

**Plan C: Scene Reconstruction**
- Export helmet from Blender
- Import as GLB into Spline
- Use awwwards-rig approach

## Testing Checklist

- [ ] Run `testMaterialAccess()` in browser console
- [ ] Check if `metalness`/`roughness` properties exist
- [ ] Determine material type (Three.js vs Spline custom)
- [ ] Test Spline Variables approach
- [ ] Verify `setVariable()` API exists
- [ ] Test Variable Change events in Spline
- [ ] Confirm finish changes work in browser

## Expected Results

### If Your Materials are Standard Three.js:
```
✅ Standard Three.js material - Direct property access should work
Recommendation: Use awwwards-rig approach (direct access)
```

**Action:** Adopt awwwards-rig's `SplineController` class

### If Your Materials are Spline Custom:
```
⚠️ Custom Spline material detected
Recommendation: Use Spline Variables approach
```

**Action:** Continue with Variables approach as documented

## Conclusion

**Your Variables approach was correct all along!** 🎯

The awwwards-rig project works because they use **imported 3D models with standard materials**. Your scene uses **Spline-native objects with custom materials**, which require the Variables approach.

### Next Steps:

1. **Test:** Run `testMaterialAccess()` to confirm material type
2. **Setup:** Configure Spline Variables in Spline editor
3. **Test:** Verify finish changes work
4. **Document:** Update code comments with findings

Your implementation in `lib/spline-helmet.ts` is already on the right track—you just need to complete the Spline editor setup!

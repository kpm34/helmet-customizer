# Performance: Cloning vs Duplicating Objects/Materials

**Last Updated:** 2024-11-20  
**Context:** Material Finish Implementation

---

## Quick Answer: **Cloning is Better** ✅

For your material finish system, **cloning materials** (what you're currently doing) is the correct and performant approach. **Duplicating objects** would be much worse for performance.

---

## Material Cloning (Current Implementation) ✅

### What You're Doing
```typescript
// Clone material, modify properties, swap on existing mesh
const clonedMaterial = originalMaterial.clone();
clonedMaterial.metalness = 0.9;
clonedMaterial.roughness = 0.1;
mesh.material = clonedMaterial; // Swap material on existing mesh
```

### Performance Characteristics

**Memory Usage:**
- **Low**: Only creates new material instance (~1-2KB per material)
- **Geometry shared**: All meshes share the same geometry/buffers
- **Cached**: Materials cached per zone+finish combination

**CPU Cost:**
- **Low**: Material cloning is fast (~0.1ms per material)
- **One-time**: Cloned materials cached and reused
- **No geometry processing**: Geometry stays untouched

**GPU Cost:**
- **Minimal**: Only shader uniforms change (metalness/roughness)
- **No new draw calls**: Same number of objects rendered
- **Efficient**: GPU can batch objects with same geometry

**Example:**
```typescript
// 5 zones × 19 finishes = 95 material clones
// Memory: ~95KB (negligible)
// Performance: Excellent ✅
```

---

## Object Duplicating (NOT Recommended) ❌

### What This Would Look Like
```typescript
// Create new object with new geometry
const newMesh = originalMesh.clone();
newMesh.material = modifiedMaterial;
scene.add(newMesh); // Add new object to scene
```

### Performance Characteristics

**Memory Usage:**
- **High**: Creates new geometry buffers (~50-500KB per object)
- **No sharing**: Each duplicate has its own geometry
- **Exponential growth**: 5 zones × 19 finishes = 95 objects

**CPU Cost:**
- **High**: Geometry cloning is expensive (~5-50ms per object)
- **Every time**: No caching benefit
- **Transform updates**: More objects to update per frame

**GPU Cost:**
- **High**: More draw calls (one per duplicate)
- **More geometry**: GPU must process more vertices
- **No batching**: Can't batch objects with different transforms

**Example:**
```typescript
// 5 zones × 19 finishes = 95 duplicate objects
// Memory: ~5-50MB (significant!)
// Performance: Poor ❌
```

---

## Performance Comparison

| Metric | Material Cloning ✅ | Object Duplicating ❌ |
|--------|-------------------|----------------------|
| **Memory per finish** | ~1-2KB | ~50-500KB |
| **CPU cost** | ~0.1ms | ~5-50ms |
| **GPU draw calls** | Same (5-20) | More (95-380) |
| **Geometry memory** | Shared | Duplicated |
| **Caching benefit** | Yes | No |
| **Scalability** | Excellent | Poor |

---

## Your Current Implementation (Optimal) ✅

### Material Cloning with Caching

```typescript
// From spline-material-finish.ts
const materialCache = new Map<string, Map<string, THREE.Material>>();

// Cache key: `${zone}-${finish}`
// Object UUID -> cloned material

// First time: Clone material
const clonedMaterial = originalMaterial.clone();
clonedMaterial.metalness = finishProps.metalness;
clonedMaterial.roughness = finishProps.roughness;
zoneCache.set(objectId, clonedMaterial);

// Subsequent times: Reuse cached material
const cachedMaterial = zoneCache.get(objectId);
mesh.material = cachedMaterial; // Instant!
```

### Performance Benefits

1. **One-time cloning**: Material cloned once per zone+finish
2. **Instant switching**: Cached materials swapped instantly
3. **Memory efficient**: ~95KB for all finishes (vs 5-50MB for duplicates)
4. **GPU efficient**: Same geometry, different materials

---

## When to Use Each Approach

### Use Material Cloning ✅ (Your Current Approach)

**Best for:**
- Material variations (finishes, colors)
- Same geometry, different appearance
- Runtime material switching
- Performance-critical applications

**Your use case:** ✅ Perfect fit
- Same helmet geometry
- Different material finishes
- Runtime switching
- Caching for performance

---

### Use Object Duplicating (Rare Cases)

**Only when:**
- You need different geometry per instance
- Objects need independent transforms
- Instancing is not possible
- You're okay with performance cost

**Your use case:** ❌ Not applicable
- Same geometry for all finishes
- Same transforms
- Material-only changes

---

## THREE.js Instancing (Alternative - Even Better)

For even better performance with many instances, consider **InstancedMesh**:

```typescript
// Create instanced mesh (shared geometry, per-instance materials)
const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

// Set per-instance material properties
instancedMesh.setColorAt(index, color);
instancedMesh.setMatrixAt(index, matrix);
```

**Benefits:**
- Single draw call for all instances
- Shared geometry
- Per-instance properties
- Best performance for many instances

**Trade-off:**
- More complex setup
- Requires geometry access
- May not work with Spline's custom materials

---

## Recommendations

### ✅ Keep Your Current Approach

Your material cloning strategy is **optimal** for your use case:

1. **Performance**: Excellent (cloning materials, not objects)
2. **Memory**: Efficient (caching prevents duplicates)
3. **Compatibility**: Works with Spline's material system
4. **Scalability**: Handles all 19 finishes efficiently

### 🚀 Potential Optimizations

1. **Pre-clone all materials** on scene load:
   ```typescript
   // Pre-create all material variants
   function preloadAllFinishes(spline: Application) {
     const zones = ['shell', 'facemask', 'chinstrap', 'padding', 'hardware'];
     const finishes = Object.keys(FINISH_PRESETS);
     
     zones.forEach(zone => {
       finishes.forEach(finish => {
         applyZoneFinish(spline, zone, finish); // Pre-clone
       });
     });
   }
   ```

2. **Use Variables strategy** when possible (fastest):
   ```typescript
   // Variables strategy: No cloning needed!
   spline.setVariable('shellLightingType', 2); // Instant
   ```

3. **Batch material swaps**:
   ```typescript
   // Swap all materials in one frame
   requestAnimationFrame(() => {
     objects.forEach(obj => {
       obj.material = cachedMaterial;
     });
   });
   ```

---

## Performance Metrics

### Current Implementation (Material Cloning)

**Memory:**
- 5 zones × 19 finishes × ~1KB = ~95KB ✅

**CPU:**
- Initial clone: ~0.1ms per material
- Material swap: <0.01ms (cached)
- Total: ~10ms for all finishes ✅

**GPU:**
- Draw calls: Same (5-20 objects)
- Geometry: Shared
- Materials: Different uniforms only ✅

### If Using Object Duplicating

**Memory:**
- 5 zones × 19 finishes × ~100KB = ~9.5MB ❌

**CPU:**
- Object clone: ~5ms per object
- Transform updates: Ongoing
- Total: ~500ms+ for all finishes ❌

**GPU:**
- Draw calls: 95-380 (much more)
- Geometry: Duplicated
- Performance: Poor ❌

---

## Conclusion

**Your current material cloning approach is optimal.** ✅

- **Cloning materials**: Fast, memory-efficient, scalable
- **Duplicating objects**: Slow, memory-intensive, not scalable

**Stick with material cloning** and consider:
1. Pre-loading materials on scene load
2. Using Variables strategy when available (fastest)
3. Keeping your caching system (already optimal)

---

## References

- [THREE.js Material Cloning](https://threejs.org/docs/#api/en/core/Object3D.clone)
- [THREE.js InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh)
- [Performance Best Practices](https://threejs.org/manual/#en/fundamentals)


# Spline Material Finish Setup Guide

This guide explains how to set up material finishes in the Spline editor using Variables, since Spline's custom materials don't support direct property manipulation via the runtime API.

## Why Use Variables?

Spline uses custom materials that don't expose `metalness` and `roughness` properties through the runtime API. The solution is to use **Spline Variables** which can control material properties and trigger material state changes.

## Setup Steps in Spline Editor

### 1. Create Finish Variables

For each helmet zone, create a **Number variable**:

1. Open your Spline scene in the Spline editor
2. With nothing selected, open the **Variables & Data Panel** (right sidebar)
3. Click on **Variables** tab
4. Click **New Variable**
5. Create the following Number variables:

| Variable Name | Type | Initial Value | Description |
|--------------|------|---------------|-------------|
| `shellFinish` | Number | 0 | Shell material finish |
| `facemaskFinish` | Number | 0 | Facemask material finish |
| `chinstrapFinish` | Number | 0 | Chinstrap material finish |
| `paddingFinish` | Number | 0 | Padding material finish |
| `hardwareFinish` | Number | 0 | Hardware material finish |

### 2. Finish Type Values

Each variable uses numeric values to represent different finishes:

| Value | Finish Type | Material Properties |
|-------|-------------|-------------------|
| 0 | **Glossy** | High metalness, low roughness |
| 1 | **Matte** | Low metalness, high roughness |
| 2 | **Chrome** | Very high metalness, very low roughness |
| 3 | **Brushed** | Medium metalness, medium roughness |
| 4 | **Satin** | Low metalness, low roughness |

### 3. Option A: Direct Material Property Binding

If your materials support it, attach variables directly to material properties:

1. Select a helmet zone object (e.g., `Shell_Combined`)
2. In the **Properties Panel**, find the **Material** section
3. For **Roughness** property:
   - Click the small dot next to the property
   - Select "Expression"
   - Use a conditional expression based on the variable:
   ```
   shellFinish == 0 ? 0.1 :
   shellFinish == 1 ? 0.9 :
   shellFinish == 2 ? 0.05 :
   shellFinish == 3 ? 0.5 :
   0.2
   ```
4. For **Metalness** property:
   - Click the small dot next to the property
   - Select "Expression"
   - Use a similar conditional:
   ```
   shellFinish == 0 ? 0.8 :
   shellFinish == 1 ? 0.2 :
   shellFinish == 2 ? 1.0 :
   shellFinish == 3 ? 0.6 :
   0.4
   ```

### 4. Option B: Material States (Recommended)

For more control, create separate material states and switch between them:

1. **Create Material Variations:**
   - Duplicate your base material 5 times (one for each finish)
   - Name them: `Shell_Glossy`, `Shell_Matte`, `Shell_Chrome`, etc.
   - Configure each with appropriate roughness/metalness values

2. **Set Up Variable Change Events:**
   - In the **Events Panel**, create a **Variable Change Event**
   - Select `shellFinish` as the variable
   - Add **Set Material** actions with conditions:
     - If `shellFinish == 0` → Set material to `Shell_Glossy`
     - If `shellFinish == 1` → Set material to `Shell_Matte`
     - If `shellFinish == 2` → Set material to `Shell_Chrome`
     - etc.

### 5. Material Property Reference

#### Glossy Finish (value: 0)
- **Roughness**: 0.1
- **Metalness**: 0.8
- **Visual**: Shiny, reflective surface

#### Matte Finish (value: 1)
- **Roughness**: 0.9
- **Metalness**: 0.2
- **Visual**: Non-reflective, flat surface

#### Chrome Finish (value: 2)
- **Roughness**: 0.05
- **Metalness**: 1.0
- **Visual**: Mirror-like, highly reflective

#### Brushed Metal (value: 3)
- **Roughness**: 0.5
- **Metalness**: 0.6
- **Visual**: Directional reflection pattern

#### Satin Finish (value: 4)
- **Roughness**: 0.2
- **Metalness**: 0.4
- **Visual**: Soft sheen, slightly reflective

## Testing in Spline Editor

1. **Test Variables Manually:**
   - In the Variables panel, change a variable value (e.g., `shellFinish = 1`)
   - Press Play and verify the material changes
   - Test all values (0-4) for each zone

2. **Test Runtime Integration:**
   - Export your scene
   - Load in your Next.js app
   - Use the customization panel to change finishes
   - Check browser console for variable updates

## Troubleshooting

### Variables Not Working?

**Check:**
- ✅ Variable names match exactly (case-sensitive)
- ✅ Variables are type `Number`, not `String`
- ✅ Material states or expressions are correctly configured
- ✅ Events are enabled and have correct conditions

### Materials Not Changing?

**Check:**
- ✅ Material names are correct in events
- ✅ Variable Change events are set up for each variable
- ✅ Conditions use `==` (equals) operator
- ✅ All possible values (0-4) are covered

### Performance Issues?

**Optimize:**
- ⚠️ Use Option A (direct binding) for better performance
- ⚠️ Limit the number of material variations
- ⚠️ Cache material instances

## Code Integration

The Next.js app uses this code to set finish variables:

```typescript
// From lib/spline-helmet.ts
export function applyZoneFinishDirect(
  spline: Application,
  zone: HelmetZone,
  finish: MaterialFinish
): boolean {
  const finishValues: Record<MaterialFinish, number> = {
    glossy: 0,
    matte: 1,
    chrome: 2,
    brushed: 3,
    satin: 4,
  };

  const variableName = `${zone}Finish`;
  const finishValue = finishValues[finish];

  spline.setVariable(variableName, finishValue);
  return true;
}
```

## Alternative: Swap Materials Directly (Not Recommended)

If variables don't work, you can swap materials programmatically:

```typescript
// Find the zone object
const zoneObj = spline.findObjectByName('Shell_Combined');

// Find the material
const glossyMaterial = spline.findObjectByName('Shell_Glossy_Material');

// Swap material (if Spline exposes this API)
zoneObj.material = glossyMaterial;
```

**Note:** This approach is not recommended because:
- Requires creating many material instances
- More memory usage
- Harder to maintain
- May not be supported by Spline runtime

## Recommended Approach

**✅ Use Option B (Material States)** for the best balance of:
- Visual quality control
- Performance
- Maintainability
- Designer-friendly workflow

This allows designers to fine-tune each finish type in Spline without touching code.

## Next Steps

1. Set up variables in Spline editor (5 variables)
2. Create material variations for each finish type (5 × 5 = 25 materials, or use expressions)
3. Set up Variable Change events
4. Test in Spline editor
5. Export and test in Next.js app
6. Verify finish changes work correctly

## Questions?

If finishes still don't work after setup:
1. Check browser console for variable update messages
2. Verify Spline scene has the variables defined
3. Use Spline's Preview mode to test variable changes
4. Check that material properties respond to variable changes

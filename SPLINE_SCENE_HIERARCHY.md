# Spline Scene Hierarchy Reference

Complete mapping of the Spline scene for helmet customizer.

---

## Complete Scene Hierarchy

```
📦 Scene Root
│
├── 📁 Preview Button (group)
│   ├── 📝 Preview (text)
│   └── ⬜ PREVIEW BUTTON (shape/button)
│
├── 📁 Assets (group)
│   ├── 🏈 Football (toggle visibility object)
│   └── 📁 helmet_for_spline ⭐ MAIN HELMET GROUP
│       ├── Facemask_Complete
│       ├── UV01_Shell
│       ├── UV01_Chinstrap
│       ├── UV02_Chinstrap_Strap
│       ├── UV03_Chinstrap
│       ├── Hardware_P_Clip_01
│       ├── Hardware_P_Clip_02
│       ├── UV01_Padding
│       ├── UV03_Padding
│       ├── Hardware_01
│       ├── Hardware_05
│       ├── Hardware_07
│       ├── Hardware_12
│       ├── Hardware_13
│       ├── Hardware_14
│       ├── Hardware_15
│       ├── Hardware_16
│       ├── Hardware_17
│       ├── Hardware_18
│       ├── Hardware_19
│       ├── Hardware_20
│       └── Hardware_Tiny
│
├── 💡 Spot Light
│
├── 📁 Floor (group)
│   ├── ⭕ Floor (shape)
│   ├── ⭕ Bottom Floating (shape)
│   └── ⭕ Platform floor (shape)
│
├── 📁 Boolean (group) ✅ KEEP VISIBLE
│   └── ⬜ panel (shape)
│
├── 📁 Roof (group)
│   ├── ⭕ roof (shape)
│   ├── ⭕ platform roof (shape)
│   └── ⭕ smallest platform roof (shape)
│
└── 💡 Directional Light
```

---

## Floor Group Transform Reference

Critical transform values for the Floor group objects. These values ensure proper scene framing, helmet scale, and platform positioning.

### Floor (shape)
```
Position: X 214.2,  Y -604,   Z -0.00
Scale:    X 45,     Y 55,     Z 13.80
Rotation: X -90,    Y 0,      Z -90
```

**Purpose:** Main platform base for the helmet display

---

### Bottom Floating (shape)
```
Position: X -319,   Y 287.9,  Z 188.7
Scale:    X 2,      Y 2,      Z 2.40
Rotation: X -90,    Y 0,      Z -90
```

**Purpose:** Secondary floating platform element

---

### Platform floor (shape)
```
Position: X 46.18,  Y 43.66,  Z 151.13
Scale:    X 3,      Y 3.00,   Z 3.00
Rotation: X -90,    Y 0,      Z -90
```

**Purpose:** Third platform component

---

### Usage Notes
- **All rotations are consistent:** X -90, Y 0, Z -90
- These values provide correct helmet framing in the viewport
- Platform scales vary to create layered depth effect
- Use these values when rebuilding or syncing Spline scenes
- Deviating from these transforms will affect scene composition and helmet appearance

---

## Helmet Zone Mapping (Current vs Actual)

### Zone: `shell` ✅
**Current Code:**
```typescript
shell: ['UV01_Shell']
```
**Actual Objects:**
- `UV01_Shell`

**Status:** ✅ Perfect match

---

### Zone: `facemask` ✅
**Current Code:**
```typescript
facemask: ['Facemask_Complete']
```
**Actual Objects:**
- `Facemask_Complete`

**Status:** ✅ Perfect match

---

### Zone: `chinstrap` ⚠️
**Current Code:**
```typescript
chinstrap: ['UV01_Chinstrap', 'UV02_Chinstrap', 'UV03_Chinstrap']
```
**Actual Objects:**
- `UV01_Chinstrap` ✅
- `UV02_Chinstrap_Strap` ❌ (CODE HAS WRONG NAME!)
- `UV03_Chinstrap` ✅

**Status:** ⚠️ **NEEDS FIX** - `UV02_Chinstrap` should be `UV02_Chinstrap_Strap`

---

### Zone: `padding` ✅
**Current Code:**
```typescript
padding: ['UV01_Padding', 'UV03_Padding']
```
**Actual Objects:**
- `UV01_Padding`
- `UV03_Padding`

**Status:** ✅ Perfect match

---

### Zone: `hardware` ⚠️
**Current Code:**
```typescript
hardware: ['Hardware_']  // Prefix match
```
**Actual Objects:**
- `Hardware_P_Clip_01` ✅ (matches prefix)
- `Hardware_P_Clip_02` ✅ (matches prefix)
- `Hardware_01` through `Hardware_20` ✅ (all match prefix)
- `Hardware_Tiny` ✅ (matches prefix)

**Status:** ✅ Prefix match works for all hardware parts

---

## Issues Found

### 🔴 CRITICAL: Chinstrap UV02 Wrong Name
- **Current:** `UV02_Chinstrap`
- **Actual:** `UV02_Chinstrap_Strap`
- **Impact:** UV02 chinstrap part is NOT being colored!
- **Fix Required:** Update `ZONE_PATTERNS` in `lib/spline-helmet.ts`

---

## Objects to Keep Visible

✅ Preview Button (group and children)
✅ Football (toggle visibility via button)
✅ helmet_for_spline (all parts - customizable)
✅ Spot Light
✅ Floor (group and children)
✅ Boolean (group and panel child) - IMPORTANT, DO NOT HIDE
✅ Roof (group and children)
✅ Directional Light

---

## Objects to Hide

**NONE** - All objects in the scene are functional and should remain visible:
- Preview Button: UI element
- Assets (Football + helmet): Main 3D models
- Spot Light: Scene lighting
- Floor: Platform display
- Boolean (panel): Important scene element
- Roof: Top platform
- Directional Light: Scene lighting

---

## Summary of Required Code Changes

### Fix Required in `lib/spline-helmet.ts`:

```typescript
// BEFORE (WRONG):
chinstrap: ['UV01_Chinstrap', 'UV02_Chinstrap', 'UV03_Chinstrap']

// AFTER (CORRECT):
chinstrap: ['UV01_Chinstrap', 'UV02_Chinstrap_Strap', 'UV03_Chinstrap']
```

This is likely why the chinstrap middle part is not changing color!

# Spline Scene Hierarchy - Helmet Customizer

**Last Updated:** 2024-11-17
**Source:** Actual Spline scene inspection

---

## Main Helmet Structure

```
📦 x helmet best (root)
│
├── 📁 Helmet_Parent (main container)
│   │
│   ├── 📁 Chinstrap_Cup (container)
│   │   ├── Helmet_UV01_low_LowMat_0004
│   │   ├── Helmet_UV01_low_LowMat_0004_1
│   │   └── Helmet_UV01_low_LowMat_0004_2
│   │
│   ├── 📁 Chinstrap_Left (container)
│   │   ├── Helmet_UV01_low_LowMat_0007
│   │   └── Helmet_UV01_low_LowMat_0007_1
│   │
│   ├── 📁 Chinstrap_Right (container)
│   │   ├── Helmet_UV01_low_LowMat_0006
│   │   └── Helmet_UV01_low_LowMat_0006_1
│   │
│   ├── 📁 Facemask_Combined (container)
│   │   ├── Helmet_UV01_low_LowMat_0001
│   │   ├── Helmet_UV01_low_LowMat_0001_1
│   │   ├── Helmet_UV01_low_LowMat_0001_2
│   │   ├── Helmet_UV01_low_LowMat_0001_3
│   │   ├── Helmet_UV01_low_LowMat_0001_4
│   │   ├── Helmet_UV01_low_LowMat_0001_5
│   │   ├── Helmet_UV01_low_LowMat_0001_6
│   │   ├── Helmet_UV01_low_LowMat_0001_7
│   │   ├── Helmet_UV01_low_LowMat_0001_8
│   │   ├── Helmet_UV01_low_LowMat_0001_9
│   │   ├── Helmet_UV01_low_LowMat_0001_10
│   │   ├── Helmet_UV01_low_LowMat_0001_11
│   │   ├── Helmet_UV01_low_LowMat_0001_12
│   │   ├── Helmet_UV01_low_LowMat_0001_13
│   │   ├── Helmet_UV01_low_LowMat_0001_14
│   │   ├── Helmet_UV01_low_LowMat_0001_15
│   │   └── Helmet_UV01_low_LowMat_0001_16
│   │
│   ├── facemask_Helmet_Mount (mesh)
│   │
│   ├── Hardware_Clips (mesh)
│   ├── Hardware_Plates (mesh)
│   ├── Hardware_Screws (mesh)
│   │
│   ├── Shell_Combined (mesh)
│   │
│   └── UV03_Padding (mesh)
│
├── 📷 Camera
├── 📁 Preview Button
├── 📁 Assets
├── 💡 Spot Light
├── 📁 Floor
├── 📁 Boolean
├── 📁 Roof
└── 🔦 Directional Light
```

---

## Zone Mappings (ZONE_PATTERNS)

### Shell
- **Container:** `Shell_Combined`
- **Type:** Mesh
- **Note:** Direct mesh, not a container

### Facemask
- **Container:** `Facemask_Combined`
- **Children:** 16 mesh instances (Helmet_UV01_low_LowMat_0001 to 0001_16)
- **Type:** Container with multiple child meshes

### Chinstrap
- **Containers:**
  - `Chinstrap_Cup` (3 children)
  - `Chinstrap_Left` (2 children)
  - `Chinstrap_Right` (2 children)
- **Total:** 7 mesh instances
- **Type:** Multiple containers

### Padding
- **Object:** `UV03_Padding`
- **Type:** Direct mesh

### Hardware
- **Objects:**
  - `Hardware_Clips`
  - `Hardware_Plates`
  - `Hardware_Screws`
- **Type:** Direct meshes

---

## Important Notes

1. **Shell_Combined** is a direct mesh, not a container
2. **Facemask_Combined** is a container with 16+ child meshes
3. **Chinstrap** uses 3 separate containers (Cup, Left, Right)
4. All helmet parts are under **Helmet_Parent** main container
5. Scene uses Spline's custom material system (not standard THREE.js materials)

---

## Troubleshooting

If colors don't change:
1. Verify object names match this hierarchy exactly
2. Use Spline native API (`changeZoneColorSplineAPI`) instead of THREE.js
3. Check browser console for object name mismatches
4. Traverse children recursively for containers

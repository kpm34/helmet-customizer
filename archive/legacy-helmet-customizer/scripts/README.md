# Helmet Customizer Scripts

Collection of scripts for testing and integrating the helmet material webhook system.

---

## 📁 Scripts Overview

### `test-webhook.sh`
**Bash script to test all webhook endpoints**

Runs 8 comprehensive tests:
- ✅ GET current material state
- ✅ Simple color updates
- ✅ Apply finish presets
- ✅ Batch zone updates
- ✅ Advanced material properties (emissive, clearcoat)
- ❌ Validation errors (invalid zones, colors, ranges)

**Usage:**
```bash
# Start dev server first
npm run dev

# Run tests (requires jq for JSON formatting)
./scripts/test-webhook.sh
```

**Requirements:**
- Next.js dev server running on `http://localhost:3000`
- `jq` installed: `brew install jq`

---

### `webhook-to-blender.ts`
**TypeScript integration between webhook API and Blender MCP**

Bridges the gap between web updates and Blender 3D model updates.

**Usage:**
```typescript
import { sendToBlenderMCP } from './scripts/webhook-to-blender';

const updates = [
  { zone: 'SHELL', properties: { color: '#FF0000', finish: 'glossy' } }
];

await sendToBlenderMCP(updates);
```

**Features:**
- Formats webhook payloads for Blender Python
- Executes Blender MCP commands
- Error handling and logging

---

### `blender/update_helmet_materials.py`
**Python script for updating Blender helmet materials**

Complete 5-zone material system for Blender with vertex color identification.

**Direct Usage:**
```bash
# Background execution
blender --background helmet.blend \
  --python scripts/blender/update_helmet_materials.py

# Via Blender MCP
mcp execute_blender_code --file scripts/blender/update_helmet_materials.py
```

**Features:**
- 5-zone vertex color system (FACEMASK, SHELL, CHINSTRAP, PADDING, HARDWARE)
- Material finish presets (glossy, matte, chrome, brushed, satin)
- Advanced PBR properties (metallic, roughness, clearcoat, emissive)
- Webhook payload processing

**Python API:**
```python
# Apply webhook updates
apply_webhook_updates([
    {
        "zone": "SHELL",
        "properties": {
            "color": "#1E3A8A",
            "finish": "glossy",
            "clearcoat": 0.9
        }
    }
])

# Individual updates
update_zone_color(material, "SHELL", "#FF0000")
update_zone_metallic(material, "FACEMASK", 1.0)
apply_finish_preset(material, "SHELL", "chrome")
```

---

## 🚀 Quick Start

### 1. Test Webhook API

```bash
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Run tests
./scripts/test-webhook.sh
```

### 2. Test Spline Integration

```typescript
// In your React component
import { fetchAndApplyWebhookUpdates } from '@/lib/spline-helmet';
import type { Application } from '@splinetool/runtime';

function onLoad(spline: Application) {
  // Update shell to red
  fetchAndApplyWebhookUpdates(
    spline,
    '/api/webhook/material',
    [{ zone: 'shell', properties: { color: '#FF0000' } }]
  );
}
```

### 3. Test Blender Integration

```bash
# Start Blender MCP server
uvx blender-mcp

# Execute material update
blender --background helmet.blend \
  --python scripts/blender/update_helmet_materials.py
```

---

## 📊 Material Properties Reference

### Zone Names
- `SHELL` - Main helmet shell
- `FACEMASK` - Face protection bars
- `CHINSTRAP` - Chin retention strap
- `INTERIOR_PADDING` - Interior padding
- `HARDWARE` - Screws, clips, fasteners

### Properties
```typescript
{
  color: "#RRGGBB"           // Hex color
  finish: "glossy|matte|chrome|brushed|satin"
  metallic: 0.0-1.0          // Metal vs dielectric
  roughness: 0.0-1.0         // Surface roughness
  clearcoat: 0.0-1.0         // Clear coating layer
  clearcoatRoughness: 0.0-1.0
  emissive: "#RRGGBB"        // Glow color
  emissiveIntensity: 0.0+    // Glow strength
}
```

### Finish Presets

| Finish | Metallic | Roughness | Use Case |
|--------|----------|-----------|----------|
| glossy | 0.0 | 0.1 | Shiny plastic |
| matte | 0.0 | 0.8 | Flat plastic |
| chrome | 1.0 | 0.05 | Mirror metal |
| brushed | 0.9 | 0.35 | Brushed metal |
| satin | 0.1 | 0.5 | Semi-gloss |

---

## 🧪 Example Workflows

### Team Color Update (Navy Blue + Chrome)

```bash
curl -X POST http://localhost:3000/api/webhook/material \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"zone": "SHELL", "properties": {"color": "#003366", "finish": "glossy"}},
      {"zone": "FACEMASK", "properties": {"color": "#FFFFFF", "finish": "chrome"}}
    ]
  }'
```

### Glowing Neon Effect

```bash
curl -X POST http://localhost:3000/api/webhook/material \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "zone": "SHELL",
        "properties": {
          "color": "#000000",
          "metallic": 0.9,
          "roughness": 0.2,
          "emissive": "#00FF00",
          "emissiveIntensity": 2.0
        }
      }
    ]
  }'
```

### Gold Hardware + Brushed Finish

```bash
curl -X POST http://localhost:3000/api/webhook/material \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "zone": "HARDWARE",
        "properties": {
          "color": "#FFD700",
          "finish": "brushed"
        }
      }
    ]
  }'
```

---

## 🔍 Troubleshooting

### Webhook API not responding
```bash
# Check Next.js server is running
lsof -ti:3000

# Restart dev server
npm run dev
```

### Validation errors
- Zone names must be UPPERCASE: `SHELL`, not `shell`
- Colors must be hex: `#FF0000`, not `red`
- Values must be in range: `0.0-1.0` for most properties

### Blender MCP not working
```bash
# Check Blender MCP is installed
uvx blender-mcp --version

# Verify Blender path
which blender
```

### Spline not updating
- Check browser console for errors
- Verify Spline object names match `ZONE_PATTERNS` in `lib/spline-helmet.ts`
- Ensure Spline scene is loaded before calling update functions

---

## 📚 Additional Resources

- **Webhook API Docs:** `docs/WEBHOOK_INTEGRATION.md`
- **Zone Mapping:** `~/projects/college-football-fantasy-app-v2/DevDocs/helmet-customizer/docs/helmet_island_zone_mapping.md`
- **Spline Runtime API:** `SPLINE_RUNTIME_API.md`
- **Blender MCP:** https://github.com/your-repo/blender-mcp

---

## 🎯 Next Steps

1. **Database Integration:** Save customizations to Appwrite/Supabase
2. **Real-time Sync:** WebSocket updates for multiplayer editing
3. **Preset Library:** Save and share material configurations
4. **GLB Export:** Export final helmet with applied materials
5. **Team Management:** Link to CFB Fantasy team colors

---

**Happy Customizing! 🎨**

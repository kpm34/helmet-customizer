# Blender MCP Integration Guide

This guide explains how to use Blender MCP (Model Context Protocol) with the Helmet Customizer project for AI-assisted 3D model generation and manipulation.

---

## What is Blender MCP?

Blender MCP enables AI assistants to control Blender directly, allowing for:
- 🎨 **Automated model generation** from text prompts
- 🔧 **Scene manipulation** via Python scripts
- 📦 **Asset importing** from PolyHaven, Hyper3D, Sketchfab
- 🖼️ **Rendering** and viewport screenshots
- 📊 **Scene analysis** and object inspection

---

## Configuration

### MCP Server Config

Location: `.claude/mcp.json`

```json
{
  "mcpServers": {
    "blender": {
      "command": "python",
      "args": ["-m", "blender_mcp"],
      "env": {
        "BLENDER_EXECUTABLE": "/Users/postgres/Blender.app/Contents/MacOS/Blender",
        "BLENDER_PYTHON": "/Users/postgres/Blender.app/Contents/Resources/4.5/python/bin/python3.11",
        "BLENDER_VERSION": "4.5",
        "POLYHAVEN_ENABLED": "true",
        "HYPER3D_ENABLED": "true",
        "HYPER3D_MODE": "FAL_AI",
        "SKETCHFAB_ENABLED": "false"
      }
    }
  }
}
```

### Environment Variables

Add to `.env.local`:

```bash
# Blender Paths (from parent workspace paths.json)
BLENDER_EXECUTABLE=/Users/postgres/Blender.app/Contents/MacOS/Blender
BLENDER_PYTHON=/Users/postgres/Blender.app/Contents/Resources/4.5/python/bin/python3.11
BLENDER_VERSION=4.5

# Asset APIs
POLYHAVEN_ENABLED=true
HYPER3D_ENABLED=true
HYPER3D_API_KEY=your_hyper3d_api_key_here
HYPER3D_MODE=FAL_AI

# Optional: Sketchfab
SKETCHFAB_ENABLED=false
SKETCHFAB_API_KEY=your_sketchfab_key_here
```

---

## Installation

### 1. Install Blender MCP Server

```bash
# From project root
pip install blender-mcp

# Or if using parent workspace Python
cd ~/Blender-Workspace
source .venv/bin/activate
pip install blender-mcp
```

### 2. Verify Blender Installation

```bash
# Check Blender is accessible
/Users/postgres/Blender.app/Contents/MacOS/Blender --version

# Expected output:
# Blender 4.5.x
```

### 3. Test MCP Connection

```bash
# In Claude Code, run:
# This will test if MCP server can connect to Blender
```

---

## Use Cases for Helmet Customizer

### 1. Generate Custom Helmet Models

**Prompt:**
```
Using Blender MCP, generate a football helmet model with:
- Rounded shell geometry
- Face mask bars
- Chinstrap attachments
- Export as GLB to public/assets/3d/
```

**What happens:**
1. AI uses `mcp__blender__execute_blender_code` to create geometry
2. Applies materials and UVs
3. Exports to GLB format
4. Places in Next.js public folder

### 2. Import and Customize Assets

**Prompt:**
```
Search PolyHaven for "metal" materials and apply to helmet hardware zone
```

**What happens:**
1. `mcp__blender__search_polyhaven_assets` finds materials
2. Downloads PBR textures
3. Applies to Hardware objects in scene

### 3. Automated Rendering

**Prompt:**
```
Render the helmet from front, side, and three-quarter views at 1920x1080
```

**What happens:**
1. `mcp__blender__get_viewport_screenshot` captures angles
2. Saves to `output/helmet-customizer/renders/`
3. Returns image paths for Next.js

### 4. AI-Generated Pattern Textures

**Prompt:**
```
Use Hyper3D to generate a tiger stripe pattern texture from text prompt
```

**What happens:**
1. `mcp__blender__generate_hyper3d_model_via_text` creates pattern
2. Converts to texture map
3. Applies to shell UV map

### 5. Scene Analysis

**Prompt:**
```
Analyze the current helmet scene and list all material zones
```

**What happens:**
1. `mcp__blender__get_scene_info` scans scene
2. `mcp__blender__get_object_info` inspects objects
3. Returns zone mapping for validation

---

## Available MCP Tools

### Scene Management

| Tool | Description | Use Case |
|------|-------------|----------|
| `get_scene_info` | Get scene overview | Verify helmet is loaded |
| `get_object_info` | Inspect specific object | Check material properties |
| `get_viewport_screenshot` | Capture viewport | Generate preview images |

### Code Execution

| Tool | Description | Use Case |
|------|-------------|----------|
| `execute_blender_code` | Run Python in Blender | Custom geometry, modifiers |

### Asset Libraries

| Tool | Description | Use Case |
|------|-------------|----------|
| `search_polyhaven_assets` | Search PBR materials | Find metal/plastic textures |
| `download_polyhaven_asset` | Download and import | Apply realistic materials |
| `get_polyhaven_status` | Check API status | Verify connection |

### AI Generation (Hyper3D)

| Tool | Description | Use Case |
|------|-------------|----------|
| `generate_hyper3d_model_via_text` | Text → 3D model | Generate custom parts |
| `generate_hyper3d_model_via_images` | Image → 3D model | Recreate from reference |
| `poll_rodin_job_status` | Check generation status | Monitor long tasks |
| `import_generated_asset` | Import AI model | Add to scene |
| `get_hyper3d_status` | Check API status | Verify key/quota |

### Sketchfab (Optional)

| Tool | Description | Use Case |
|------|-------------|----------|
| `search_sketchfab_models` | Search model library | Find helmet references |
| `download_sketchfab_model` | Import models | Use as base mesh |

---

## Example Workflows

### Workflow 1: Generate New Helmet Variant

```typescript
// 1. Ask AI via Claude Code:
"Create a new helmet variant with:
- Wider shell geometry
- 3-bar facemask instead of 2-bar
- Export to public/assets/3d/helmet-wide.glb"

// 2. AI executes:
// - execute_blender_code: Modify base mesh
// - execute_blender_code: Rebuild facemask
// - Export GLB

// 3. Use in Next.js:
<Spline scene="/assets/3d/helmet-wide.splinecode" />
```

### Workflow 2: Apply Realistic Materials

```typescript
// 1. Ask AI:
"Find a glossy plastic material from PolyHaven and apply to shell zone"

// 2. AI executes:
// - search_polyhaven_assets: Find "plastic glossy"
// - download_polyhaven_asset: Get PBR maps
// - execute_blender_code: Apply to UV01_Shell

// 3. Re-export to Spline
```

### Workflow 3: Generate Pattern Textures

```typescript
// 1. Ask AI:
"Generate tiger stripe pattern using Hyper3D text-to-3D,
 then bake to texture for shell overlay"

// 2. AI executes:
// - generate_hyper3d_model_via_text: "tiger stripe pattern"
// - poll_rodin_job_status: Wait for completion
// - import_generated_asset: Load model
// - execute_blender_code: Bake to texture
// - Save to public/textures/tiger-stripe.png

// 3. Use in pattern system
```

### Workflow 4: Batch Render All Zones

```typescript
// 1. Ask AI:
"Render each zone separately with transparent background:
 - Shell only
 - Facemask only
 - Chinstrap only
 - Padding only
 - Hardware only"

// 2. AI executes:
// - execute_blender_code: Hide all except shell
// - get_viewport_screenshot: Render
// - Repeat for each zone
// - Save to output/zones/

// 3. Use for zone selector UI
```

---

## Integration with Helmet Customizer

### 1. GLB Export Pipeline

```typescript
// app/api/export/glb/route.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  const { config } = await request.json();

  // Call Blender via MCP to export GLB
  const blendFile = './assets/helmet_base.blend';
  const outputPath = './public/exports/helmet_custom.glb';

  // Use Blender MCP to customize and export
  // (Claude Code can execute this via MCP)

  return Response.json({
    success: true,
    glbPath: '/exports/helmet_custom.glb'
  });
}
```

### 2. Pattern Texture Generation

```typescript
// app/api/patterns/generate/route.ts
export async function POST(request: Request) {
  const { patternType, color } = await request.json();

  // Use Hyper3D via MCP to generate pattern
  // Then bake to texture in Blender

  return Response.json({
    texturePath: `/textures/${patternType}.png`
  });
}
```

### 3. Real-time Preview Updates

```typescript
// Use Blender MCP to update .blend file
// Then re-export to Spline format
// Spline hot-reloads in browser
```

---

## Troubleshooting

### Issue: MCP Server Not Starting

```bash
# Check Python environment
which python
python --version

# Install blender-mcp
pip install blender-mcp

# Verify installation
python -m blender_mcp --help
```

### Issue: Blender Not Found

```bash
# Update path in .claude/mcp.json
"BLENDER_EXECUTABLE": "/Applications/Blender.app/Contents/MacOS/Blender"

# Test manually
/Applications/Blender.app/Contents/MacOS/Blender --version
```

### Issue: Hyper3D API Errors

```bash
# Check API key in .env.local
HYPER3D_API_KEY=sk_...

# Verify mode is correct
HYPER3D_MODE=FAL_AI  # or MAIN_SITE

# Test status
# Ask Claude: "Check Hyper3D status via MCP"
```

### Issue: PolyHaven Download Fails

```bash
# Check internet connection
# PolyHaven requires no API key

# Verify setting
POLYHAVEN_ENABLED=true
```

---

## Best Practices

### 1. Version Control for .blend Files

```bash
# Use Git LFS for large Blender files
git lfs track "*.blend"
git lfs track "*.glb"

# Commit base helmet file
git add assets/helmet_base.blend
git commit -m "Add base helmet mesh"
```

### 2. Automated Testing

```typescript
// Test Blender MCP integration
describe('Blender MCP', () => {
  it('should export GLB successfully', async () => {
    // Use MCP to export
    const result = await exportHelmetGLB(config);
    expect(result.success).toBe(true);
    expect(fs.existsSync(result.glbPath)).toBe(true);
  });
});
```

### 3. Caching Generated Assets

```typescript
// Cache Hyper3D textures to avoid regeneration
const cacheKey = `pattern_${patternType}_${color}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return cached; // Serve from cache
} else {
  // Generate via MCP and cache
}
```

### 4. Error Handling

```typescript
try {
  // Execute Blender script via MCP
  const result = await blenderMCP.execute(script);
} catch (error) {
  if (error.code === 'BLENDER_NOT_FOUND') {
    // Fallback to pre-rendered assets
  } else if (error.code === 'TIMEOUT') {
    // Queue for background processing
  }
}
```

---

## Performance Considerations

### Blender Script Execution Times

| Operation | Time | Notes |
|-----------|------|-------|
| Simple color change | ~100ms | Fast |
| Mesh modification | ~500ms | Moderate |
| Material baking | ~2-5s | Slow |
| High-res render | ~10-30s | Very slow |
| Hyper3D generation | ~30-60s | Very slow |

### Optimization Strategies

1. **Pre-generate common variants** during build
2. **Cache textures** in public/textures/
3. **Use low-poly preview** models for customization
4. **Background jobs** for heavy operations (renders, AI gen)
5. **Queue system** for multiple requests

---

## Next Steps

1. **Test MCP Connection**
   ```
   Ask Claude: "Get Blender scene info via MCP"
   ```

2. **Generate First Asset**
   ```
   Ask Claude: "Create a simple sphere in Blender and export to GLB"
   ```

3. **Import PolyHaven Material**
   ```
   Ask Claude: "Search PolyHaven for 'metal brushed' and show results"
   ```

4. **Integrate with Webhook**
   ```typescript
   // app/api/webhook/material/route.ts
   // Add Blender MCP calls to update .blend file
   ```

5. **Build Pattern System**
   ```
   Ask Claude: "Generate 5 pattern textures for helmet shell using procedural noise"
   ```

---

## Additional Resources

- **Blender Python API**: https://docs.blender.org/api/current/
- **MCP Specification**: https://modelcontextprotocol.io/
- **PolyHaven**: https://polyhaven.com/
- **Hyper3D Rodin**: https://hyperhuman.deemos.com/rodin
- **Blender-Workspace**: `~/Blender-Workspace/` (parent workspace)

---

## Example: Complete Helmet Generation Flow

```bash
# 1. Start with base mesh
Ask: "Load helmet_base.blend and show scene info"

# 2. Apply team colors
Ask: "Set shell to #FF0000 red, facemask to #FFD700 gold"

# 3. Add pattern
Ask: "Generate tiger stripe pattern and apply to shell"

# 4. Add logo
Ask: "Import team logo from public/logos/team1.png and apply as decal"

# 5. Render previews
Ask: "Render front, side, back views at 1920x1080"

# 6. Export
Ask: "Export final helmet as GLB to public/exports/team1_helmet.glb"

# 7. Convert to Spline
Ask: "Convert GLB to Spline format for web viewer"
```

---

**Blender MCP is configured and ready to use! 🎉**

Ask Claude Code to execute Blender operations using the MCP tools listed above.

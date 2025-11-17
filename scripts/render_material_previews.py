"""
Helmet Material Preview Renderer
Renders high-quality material previews for web app using Blender's native engine
Bypasses Spline - creates beautiful standalone preview images

Usage:
    Run this script inside Blender with your helmet file open:
    1. Open Final_Helmet-Blend.blend in Blender
    2. Open Scripting workspace
    3. Paste this script and run

    Or run from command line:
    blender Final_Helmet-Blend.blend --background --python render_material_previews.py
"""

import bpy
import os
from pathlib import Path
from mathutils import Vector, Color
import math

# ============================================================
# CONFIGURATION
# ============================================================

# Output directory (relative to project root)
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "material-previews"

# Material finish presets matching your web app
FINISH_PRESETS = {
    "glossy": {
        "name": "Glossy",
        "metalness": 0.0,
        "roughness": 0.2,
        "clearcoat": 0.5,
        "sheen": 0.0,
    },
    "matte": {
        "name": "Matte",
        "metalness": 0.0,
        "roughness": 0.9,
        "clearcoat": 0.0,
        "sheen": 0.1,
    },
    "metallic": {
        "name": "Metallic",
        "metalness": 1.0,
        "roughness": 0.3,
        "clearcoat": 0.0,
        "sheen": 0.0,
    },
    "chrome": {
        "name": "Chrome",
        "metalness": 1.0,
        "roughness": 0.05,
        "clearcoat": 1.0,
        "sheen": 0.0,
    },
}

# Sample colors for previews
PREVIEW_COLORS = [
    ("#FF0000", "red"),
    ("#0000FF", "blue"),
    ("#FFD700", "gold"),
    ("#00FF00", "green"),
    ("#FFFFFF", "white"),
    ("#000000", "black"),
]

# Render settings
RENDER_WIDTH = 800
RENDER_HEIGHT = 800
RENDER_SAMPLES = 128  # Increase for final quality (256-512)
USE_DENOISE = True

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple (0-1 range)"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))


def setup_scene():
    """Configure scene for optimal preview rendering"""
    scene = bpy.context.scene

    # Set render engine to Cycles (best quality)
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'GPU'  # Use GPU if available

    # Render settings
    scene.render.resolution_x = RENDER_WIDTH
    scene.render.resolution_y = RENDER_HEIGHT
    scene.cycles.samples = RENDER_SAMPLES

    # Enable denoising for cleaner renders
    if USE_DENOISE:
        scene.cycles.use_denoising = True
        scene.render.use_compositing = True

    # Transparent background
    scene.render.film_transparent = True

    # Color management for accurate colors
    scene.view_settings.view_transform = 'Standard'
    scene.view_settings.look = 'None'

    print(f"✅ Scene configured: {RENDER_WIDTH}x{RENDER_HEIGHT}, {RENDER_SAMPLES} samples")


def setup_lighting():
    """Create professional studio lighting setup"""
    # Clear existing lights
    bpy.ops.object.select_by_type(type='LIGHT')
    bpy.ops.object.delete()

    # Key light (main light, 45° angle)
    bpy.ops.object.light_add(type='AREA', location=(3, -3, 4))
    key_light = bpy.context.object
    key_light.name = "Key_Light"
    key_light.data.energy = 300
    key_light.data.size = 3
    key_light.rotation_euler = (math.radians(60), 0, math.radians(45))

    # Fill light (soften shadows, opposite side)
    bpy.ops.object.light_add(type='AREA', location=(-2, -2, 3))
    fill_light = bpy.context.object
    fill_light.name = "Fill_Light"
    fill_light.data.energy = 150
    fill_light.data.size = 4
    fill_light.rotation_euler = (math.radians(60), 0, math.radians(-45))

    # Rim light (edge definition, from behind)
    bpy.ops.object.light_add(type='AREA', location=(0, 3, 3))
    rim_light = bpy.context.object
    rim_light.name = "Rim_Light"
    rim_light.data.energy = 200
    rim_light.data.size = 2
    rim_light.rotation_euler = (math.radians(30), 0, math.radians(180))

    # Add HDRI environment for realistic reflections
    world = bpy.context.scene.world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    nodes.clear()

    # Environment texture node
    env_node = nodes.new(type='ShaderNodeBackground')
    env_node.inputs['Strength'].default_value = 0.5
    env_node.inputs['Color'].default_value = (1, 1, 1, 1)  # White

    output_node = nodes.new(type='ShaderNodeOutputWorld')
    world.node_tree.links.new(env_node.outputs['Background'], output_node.inputs['Surface'])

    print("✅ Studio lighting configured")


def setup_camera():
    """Position camera for optimal helmet view"""
    # Clear existing cameras
    for obj in bpy.data.objects:
        if obj.type == 'CAMERA':
            bpy.data.objects.remove(obj, do_unlink=True)

    # Create camera
    bpy.ops.object.camera_add(location=(0, -5, 1.5))
    camera = bpy.context.object
    camera.name = "Preview_Camera"

    # Point camera at helmet (assuming helmet is at origin)
    camera.rotation_euler = (math.radians(85), 0, 0)

    # Set as active camera
    bpy.context.scene.camera = camera

    # Camera settings for nice depth of field (optional)
    camera.data.lens = 50  # 50mm lens
    camera.data.sensor_width = 36

    print("✅ Camera positioned")


def find_helmet_objects():
    """Find all helmet mesh objects in scene"""
    helmet_objects = []

    # Look for objects with common helmet naming patterns
    patterns = ['helmet', 'shell', 'facemask', 'chinstrap', 'mask', 'cage']

    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            name_lower = obj.name.lower()
            if any(pattern in name_lower for pattern in patterns):
                helmet_objects.append(obj)

    # If no matches, just get all mesh objects
    if not helmet_objects:
        helmet_objects = [obj for obj in bpy.data.objects if obj.type == 'MESH']

    print(f"✅ Found {len(helmet_objects)} helmet object(s): {[obj.name for obj in helmet_objects]}")
    return helmet_objects


def create_material(name, base_color_hex, finish_preset):
    """Create a Principled BSDF material with specified properties"""
    # Create new material
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()

    # Create Principled BSDF
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)

    # Set base color
    rgb = hex_to_rgb(base_color_hex)
    bsdf.inputs['Base Color'].default_value = (*rgb, 1.0)

    # Set finish properties
    bsdf.inputs['Metallic'].default_value = finish_preset['metalness']
    bsdf.inputs['Roughness'].default_value = finish_preset['roughness']
    bsdf.inputs['Sheen Tint'].default_value = finish_preset['sheen']
    bsdf.inputs['Clearcoat'].default_value = finish_preset.get('clearcoat', 0.0)

    # Output node
    output = nodes.new(type='ShaderNodeOutputMaterial')
    output.location = (300, 0)

    # Link nodes
    mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    return mat


def apply_material_to_objects(objects, material):
    """Apply material to all objects"""
    for obj in objects:
        # Clear existing materials
        obj.data.materials.clear()

        # Assign new material
        obj.data.materials.append(material)

    print(f"✅ Applied material '{material.name}' to {len(objects)} object(s)")


def render_preview(output_path):
    """Render current scene to file"""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    scene = bpy.context.scene
    scene.render.filepath = str(output_path)

    print(f"🎨 Rendering to {output_path}...")
    bpy.ops.render.render(write_still=True)
    print(f"✅ Rendered: {output_path}")


# ============================================================
# MAIN RENDERING FUNCTION
# ============================================================

def render_all_material_previews():
    """Main function - renders all material finish previews"""
    print("=" * 60)
    print("HELMET MATERIAL PREVIEW RENDERER")
    print("=" * 60)

    # Setup scene
    setup_scene()
    setup_lighting()
    setup_camera()

    # Find helmet objects
    helmet_objects = find_helmet_objects()

    if not helmet_objects:
        print("❌ No helmet objects found in scene!")
        return

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Render preview for each finish type
    for finish_key, finish_data in FINISH_PRESETS.items():
        print(f"\n{'='*60}")
        print(f"Rendering {finish_data['name']} finishes...")
        print(f"{'='*60}")

        # Render with different colors
        for color_hex, color_name in PREVIEW_COLORS:
            # Create material
            mat_name = f"Preview_{finish_key}_{color_name}"
            material = create_material(mat_name, color_hex, finish_data)

            # Apply to helmet
            apply_material_to_objects(helmet_objects, material)

            # Render
            output_file = OUTPUT_DIR / f"{finish_key}_{color_name}.png"
            render_preview(output_file)

            # Clean up material
            bpy.data.materials.remove(material)

    print("\n" + "=" * 60)
    print("✅ ALL PREVIEWS RENDERED SUCCESSFULLY!")
    print(f"📁 Output directory: {OUTPUT_DIR}")
    print("=" * 60)

    # Generate JSON manifest for web app
    generate_manifest()


def generate_manifest():
    """Generate JSON manifest of all rendered previews"""
    import json

    manifest = {
        "finishes": {},
        "colors": [{"hex": hex_color, "name": name} for hex_color, name in PREVIEW_COLORS],
        "renderSettings": {
            "width": RENDER_WIDTH,
            "height": RENDER_HEIGHT,
            "samples": RENDER_SAMPLES,
        }
    }

    for finish_key, finish_data in FINISH_PRESETS.items():
        manifest["finishes"][finish_key] = {
            "name": finish_data["name"],
            "previews": {
                color_name: f"/material-previews/{finish_key}_{color_name}.png"
                for _, color_name in PREVIEW_COLORS
            }
        }

    manifest_path = OUTPUT_DIR / "manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"✅ Generated manifest: {manifest_path}")


# ============================================================
# QUICK RENDER FUNCTIONS (for testing)
# ============================================================

def render_single_preview(finish="glossy", color="#FF0000"):
    """Quick function to render a single preview for testing"""
    setup_scene()
    setup_lighting()
    setup_camera()

    helmet_objects = find_helmet_objects()
    finish_data = FINISH_PRESETS[finish]

    material = create_material(f"Test_{finish}", color, finish_data)
    apply_material_to_objects(helmet_objects, material)

    output_file = OUTPUT_DIR / "test_preview.png"
    render_preview(output_file)

    print(f"✅ Test render complete: {output_file}")


# ============================================================
# EXECUTION
# ============================================================

if __name__ == "__main__":
    # Render all previews
    render_all_material_previews()

    # Uncomment to render single test preview:
    # render_single_preview(finish="chrome", color="#FFD700")

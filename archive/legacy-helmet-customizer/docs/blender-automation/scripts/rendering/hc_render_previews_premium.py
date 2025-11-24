"""
Premium Helmet Material Preview Renderer
Renders high-quality material previews with professional automotive and sports finishes
Includes pearl coat, metallic flake, carbon fiber, anodized metal, and more

Usage:
    Run this script inside Blender with your helmet file open
    or from command line:
    blender helmet.blend --background --python render_premium_material_previews.py
"""

import bpy
import os
from pathlib import Path
from mathutils import Vector, Color
import math

# ============================================================
# CONFIGURATION
# ============================================================

# Output directory (relative to blender directory)
OUTPUT_DIR = Path(__file__).parent.parent.parent / "output" / "previews"

# Premium finish presets inspired by automotive and sports equipment
FINISH_PRESETS = {
    # Basic finishes
    "glossy": {
        "name": "Glossy",
        "description": "Classic high-gloss plastic finish",
        "metalness": 0.0,
        "roughness": 0.15,
        "clearcoat": 0.8,
        "clearcoat_roughness": 0.05,
        "sheen": 0.0,
        "specular": 0.5,
    },
    "matte": {
        "name": "Matte",
        "description": "Non-reflective flat surface",
        "metalness": 0.0,
        "roughness": 0.95,
        "clearcoat": 0.0,
        "clearcoat_roughness": 0.3,
        "sheen": 0.15,
        "specular": 0.2,
    },

    # Premium automotive-inspired finishes
    "pearl_coat": {
        "name": "Pearl Coat",
        "description": "Car-paint style with soft iridescence",
        "metalness": 0.1,
        "roughness": 0.25,
        "clearcoat": 1.0,
        "clearcoat_roughness": 0.02,
        "sheen": 0.3,
        "specular": 0.6,
        "anisotropic": 0.2,  # Subtle directional highlights
    },
    "satin_automotive": {
        "name": "Satin Automotive",
        "description": "Premium wrap finish - no glare but rich",
        "metalness": 0.05,
        "roughness": 0.45,
        "clearcoat": 0.3,
        "clearcoat_roughness": 0.15,
        "sheen": 0.2,
        "specular": 0.4,
    },
    "metallic_flake": {
        "name": "Metallic Flake",
        "description": "Classic sparkle with reflective flakes",
        "metalness": 0.3,
        "roughness": 0.2,
        "clearcoat": 0.9,
        "clearcoat_roughness": 0.05,
        "sheen": 0.0,
        "specular": 0.7,
        "anisotropic": 0.3,
    },
    "wet_clearcoat": {
        "name": "Wet Clear Coat",
        "description": "Looks freshly waxed - full specular",
        "metalness": 0.0,
        "roughness": 0.08,
        "clearcoat": 1.0,
        "clearcoat_roughness": 0.01,
        "sheen": 0.0,
        "specular": 0.8,
    },

    # Metal finishes
    "chrome": {
        "name": "Chrome",
        "description": "Mirror-like polished metal",
        "metalness": 1.0,
        "roughness": 0.02,
        "clearcoat": 0.5,
        "clearcoat_roughness": 0.01,
        "sheen": 0.0,
        "specular": 1.0,
    },
    "anodized_metal": {
        "name": "Anodized Metal",
        "description": "Colored engineered metal - tough look",
        "metalness": 1.0,
        "roughness": 0.15,
        "clearcoat": 0.4,
        "clearcoat_roughness": 0.08,
        "sheen": 0.0,
        "specular": 0.9,
    },
    "brushed_titanium": {
        "name": "Brushed Titanium",
        "description": "Industrial elite engineering vibe",
        "metalness": 1.0,
        "roughness": 0.25,
        "clearcoat": 0.2,
        "clearcoat_roughness": 0.1,
        "sheen": 0.0,
        "specular": 0.85,
        "anisotropic": 0.9,  # Strong directional brushing
        "anisotropic_rotation": 0.0,
    },
    "weathered_metal": {
        "name": "Weathered Metal",
        "description": "Patina finish for themed alternates",
        "metalness": 0.85,
        "roughness": 0.6,
        "clearcoat": 0.0,
        "clearcoat_roughness": 0.3,
        "sheen": 0.1,
        "specular": 0.5,
    },

    # Modern/tactical finishes
    "carbon_fiber": {
        "name": "Carbon Fiber",
        "description": "High-tech woven pattern",
        "metalness": 0.5,
        "roughness": 0.3,
        "clearcoat": 0.8,
        "clearcoat_roughness": 0.05,
        "sheen": 0.0,
        "specular": 0.7,
        "has_texture": True,  # Will add procedural carbon pattern
    },
    "rubberized_softtouch": {
        "name": "Rubberized Soft-Touch",
        "description": "Tactical stealth look - less reflective",
        "metalness": 0.0,
        "roughness": 0.85,
        "clearcoat": 0.0,
        "clearcoat_roughness": 0.4,
        "sheen": 0.25,
        "specular": 0.15,
    },
    "ceramic_gloss": {
        "name": "Ceramic Gloss",
        "description": "Ultra-premium clean finish - Apple-ish",
        "metalness": 0.0,
        "roughness": 0.12,
        "clearcoat": 0.95,
        "clearcoat_roughness": 0.02,
        "sheen": 0.0,
        "specular": 0.65,
    },

    # Special effect finishes
    "frosted_polycarbonate": {
        "name": "Frosted Polycarbonate",
        "description": "Translucent futuristic look",
        "metalness": 0.0,
        "roughness": 0.4,
        "clearcoat": 0.5,
        "clearcoat_roughness": 0.2,
        "sheen": 0.1,
        "specular": 0.4,
        "transmission": 0.3,  # Slight translucency
    },
    "holographic_foil": {
        "name": "Holographic Foil",
        "description": "Color-shifting refractive finish",
        "metalness": 0.4,
        "roughness": 0.1,
        "clearcoat": 1.0,
        "clearcoat_roughness": 0.01,
        "sheen": 0.5,
        "specular": 0.9,
        "anisotropic": 0.7,
        "has_iridescence": True,
    },
}

# Color palette
PREVIEW_COLORS = [
    ("#FF0000", "red", "Red"),
    ("#0000FF", "blue", "Blue"),
    ("#FFD700", "gold", "Gold"),
    ("#00FF00", "green", "Green"),
    ("#FFFFFF", "white", "White"),
    ("#000000", "black", "Black"),
    ("#FF6B35", "orange", "Orange"),
    ("#8B00FF", "purple", "Purple"),
    ("#00CED1", "cyan", "Cyan"),
]

# Render settings
RENDER_WIDTH = 1024
RENDER_HEIGHT = 1024
RENDER_SAMPLES = 256  # Higher quality for premium finishes
USE_DENOISE = True

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))


def setup_scene():
    """Configure scene for premium quality rendering"""
    scene = bpy.context.scene

    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'GPU'

    scene.render.resolution_x = RENDER_WIDTH
    scene.render.resolution_y = RENDER_HEIGHT
    scene.cycles.samples = RENDER_SAMPLES

    if USE_DENOISE:
        scene.cycles.use_denoising = True
        scene.render.use_compositing = True

    scene.render.film_transparent = True
    scene.view_settings.view_transform = 'Standard'
    scene.view_settings.look = 'None'

    # Enable high-quality features
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.01

    print(f"✅ Premium scene configured: {RENDER_WIDTH}x{RENDER_HEIGHT}, {RENDER_SAMPLES} samples")


def setup_studio_lighting():
    """Professional automotive-style lighting setup"""
    # Clear existing lights
    bpy.ops.object.select_by_type(type='LIGHT')
    bpy.ops.object.delete()

    # Key light (main)
    bpy.ops.object.light_add(type='AREA', location=(4, -4, 5))
    key_light = bpy.context.object
    key_light.data.energy = 400
    key_light.data.size = 4
    key_light.rotation_euler = (math.radians(55), 0, math.radians(45))

    # Fill light
    bpy.ops.object.light_add(type='AREA', location=(-3, -3, 4))
    fill_light = bpy.context.object
    fill_light.data.energy = 200
    fill_light.data.size = 5
    fill_light.rotation_euler = (math.radians(55), 0, math.radians(-45))

    # Rim light (for edge definition)
    bpy.ops.object.light_add(type='AREA', location=(0, 4, 4))
    rim_light = bpy.context.object
    rim_light.data.energy = 250
    rim_light.data.size = 3
    rim_light.rotation_euler = (math.radians(25), 0, math.radians(180))

    # Bottom fill (subtle)
    bpy.ops.object.light_add(type='AREA', location=(0, 0, -2))
    bottom_light = bpy.context.object
    bottom_light.data.energy = 100
    bottom_light.data.size = 6
    bottom_light.rotation_euler = (math.radians(180), 0, 0)

    # HDRI-style environment
    world = bpy.context.scene.world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    nodes.clear()

    env_node = nodes.new(type='ShaderNodeBackground')
    env_node.inputs['Strength'].default_value = 0.4
    env_node.inputs['Color'].default_value = (0.95, 0.95, 1.0, 1.0)  # Slight cool tint

    output_node = nodes.new(type='ShaderNodeOutputWorld')
    world.node_tree.links.new(env_node.outputs['Background'], output_node.inputs['Surface'])

    print("✅ Studio lighting configured")


def setup_camera():
    """Position camera for optimal helmet showcase"""
    for obj in bpy.data.objects:
        if obj.type == 'CAMERA':
            bpy.data.objects.remove(obj, do_unlink=True)

    bpy.ops.object.camera_add(location=(0, -6, 1.8))
    camera = bpy.context.object
    camera.rotation_euler = (math.radians(82), 0, 0)

    bpy.context.scene.camera = camera
    camera.data.lens = 60
    camera.data.sensor_width = 36

    print("✅ Camera positioned")


def find_helmet_objects():
    """Find helmet mesh objects"""
    helmet_objects = []
    patterns = ['helmet', 'shell', 'facemask', 'chinstrap', 'mask', 'cage', 'guard']

    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            name_lower = obj.name.lower()
            if any(pattern in name_lower for pattern in patterns):
                helmet_objects.append(obj)

    if not helmet_objects:
        helmet_objects = [obj for obj in bpy.data.objects if obj.type == 'MESH']

    print(f"✅ Found {len(helmet_objects)} helmet object(s)")
    return helmet_objects


def create_carbon_fiber_texture():
    """Create procedural carbon fiber texture"""
    tex = bpy.data.textures.new("CarbonFiber", 'VORONOI')
    tex.noise_scale = 8.0
    return tex


def create_premium_material(name, base_color_hex, finish_preset):
    """Create advanced Principled BSDF material with all features"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    # Main shader
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)

    # Base color
    rgb = hex_to_rgb(base_color_hex)
    bsdf.inputs['Base Color'].default_value = (*rgb, 1.0)

    # Apply finish properties
    bsdf.inputs['Metallic'].default_value = finish_preset.get('metalness', 0.0)
    bsdf.inputs['Roughness'].default_value = finish_preset.get('roughness', 0.5)
    bsdf.inputs['Sheen Tint'].default_value = finish_preset.get('sheen', 0.0)
    bsdf.inputs['Clearcoat'].default_value = finish_preset.get('clearcoat', 0.0)
    bsdf.inputs['Clearcoat Roughness'].default_value = finish_preset.get('clearcoat_roughness', 0.03)
    bsdf.inputs['Specular IOR Level'].default_value = finish_preset.get('specular', 0.5)

    # Anisotropic (for brushed metals, pearl coat)
    if 'anisotropic' in finish_preset:
        bsdf.inputs['Anisotropic'].default_value = finish_preset['anisotropic']
        if 'anisotropic_rotation' in finish_preset:
            bsdf.inputs['Anisotropic Rotation'].default_value = finish_preset['anisotropic_rotation']

    # Transmission (for frosted polycarbonate)
    if 'transmission' in finish_preset:
        bsdf.inputs['Transmission Weight'].default_value = finish_preset['transmission']

    # Carbon fiber texture
    if finish_preset.get('has_texture'):
        # Add bump/normal map for carbon weave pattern
        tex_coord = nodes.new(type='ShaderNodeTexCoord')
        tex_coord.location = (-600, 0)

        mapping = nodes.new(type='ShaderNodeMapping')
        mapping.location = (-400, 0)
        mapping.inputs['Scale'].default_value = (20, 20, 20)

        voronoi = nodes.new(type='ShaderNodeTexVoronoi')
        voronoi.location = (-200, 0)
        voronoi.feature = 'DISTANCE_TO_EDGE'
        voronoi.voronoi_dimensions = '2D'

        bump = nodes.new(type='ShaderNodeBump')
        bump.location = (-50, -200)
        bump.inputs['Strength'].default_value = 0.3

        links.new(tex_coord.outputs['UV'], mapping.inputs['Vector'])
        links.new(mapping.outputs['Vector'], voronoi.inputs['Vector'])
        links.new(voronoi.outputs['Distance'], bump.inputs['Height'])
        links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])

    # Iridescence simulation (for holographic)
    if finish_preset.get('has_iridescence'):
        # Add layer weight for fresnel-based color shift
        layer_weight = nodes.new(type='ShaderNodeLayerWeight')
        layer_weight.location = (-400, -300)

        color_ramp = nodes.new(type='ShaderNodeValToRGB')
        color_ramp.location = (-200, -300)
        color_ramp.color_ramp.elements[0].color = (*rgb, 1.0)
        # Shift to complementary color
        shift_rgb = ((rgb[0] + 0.5) % 1.0, (rgb[1] + 0.3) % 1.0, (rgb[2] + 0.7) % 1.0)
        color_ramp.color_ramp.elements[1].color = (*shift_rgb, 1.0)

        links.new(layer_weight.outputs['Facing'], color_ramp.inputs['Fac'])
        links.new(color_ramp.outputs['Color'], bsdf.inputs['Base Color'])

    # Output
    output = nodes.new(type='ShaderNodeOutputMaterial')
    output.location = (300, 0)
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    return mat


def apply_material_to_objects(objects, material):
    """Apply material to objects"""
    for obj in objects:
        obj.data.materials.clear()
        obj.data.materials.append(material)
    print(f"✅ Applied {material.name}")


def render_preview(output_path):
    """Render to file"""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    scene.render.filepath = str(output_path)
    print(f"🎨 Rendering {output_path.name}...")
    bpy.ops.render.render(write_still=True)
    print(f"✅ Rendered: {output_path}")


# ============================================================
# MAIN
# ============================================================

def render_all_premium_previews():
    """Render all premium material previews"""
    print("=" * 70)
    print("PREMIUM HELMET MATERIAL PREVIEW RENDERER")
    print("=" * 70)

    setup_scene()
    setup_studio_lighting()
    setup_camera()

    helmet_objects = find_helmet_objects()
    if not helmet_objects:
        print("❌ No helmet objects found!")
        return

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    total_renders = len(FINISH_PRESETS) * len(PREVIEW_COLORS)
    current = 0

    for finish_key, finish_data in FINISH_PRESETS.items():
        print(f"\n{'='*70}")
        print(f"Rendering {finish_data['name']}...")
        print(f"{'='*70}")

        for color_hex, color_name, color_label in PREVIEW_COLORS:
            current += 1
            print(f"\n[{current}/{total_renders}] {finish_data['name']} - {color_label}")

            mat_name = f"Preview_{finish_key}_{color_name}"
            material = create_premium_material(mat_name, color_hex, finish_data)
            apply_material_to_objects(helmet_objects, material)

            output_file = OUTPUT_DIR / f"{finish_key}_{color_name}.png"
            render_preview(output_file)

            bpy.data.materials.remove(material)

    print("\n" + "=" * 70)
    print("✅ ALL PREMIUM PREVIEWS RENDERED!")
    print(f"📁 {OUTPUT_DIR}")
    print("=" * 70)

    generate_manifest()


def generate_manifest():
    """Generate JSON manifest"""
    import json

    manifest = {
        "finishes": {},
        "colors": [
            {"hex": hex_color, "name": name, "label": label}
            for hex_color, name, label in PREVIEW_COLORS
        ],
        "renderSettings": {
            "width": RENDER_WIDTH,
            "height": RENDER_HEIGHT,
            "samples": RENDER_SAMPLES,
        }
    }

    for finish_key, finish_data in FINISH_PRESETS.items():
        manifest["finishes"][finish_key] = {
            "name": finish_data["name"],
            "description": finish_data["description"],
            "previews": {
                color_name: f"/material-previews/{finish_key}_{color_name}.png"
                for _, color_name, _ in PREVIEW_COLORS
            }
        }

    manifest_path = OUTPUT_DIR / "manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"✅ Manifest: {manifest_path}")


if __name__ == "__main__":
    render_all_premium_previews()

"""
Quick Setup and Render Script
Imports Final_Helmet.obj and renders material previews

Run this in Blender:
1. Open Blender (fresh scene)
2. Scripting tab
3. Open this script
4. Click Run Script
"""

import bpy
import os
from pathlib import Path
from mathutils import Vector
import math

# ============================================================
# PATHS
# ============================================================

# Path to your OBJ file
OBJ_PATH = Path("/Users/kashyapmaheshwari/projects/helmet-customizer/Final_Helmet.obj")
OUTPUT_DIR = Path("/Users/kashyapmaheshwari/Blender-Workspace/projects/helmet-customizer/public/material-previews")

# ============================================================
# STEP 1: CLEAN SCENE AND IMPORT
# ============================================================

def clean_scene():
    """Delete everything in scene"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

    # Clean orphan data
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)

    print("✅ Scene cleaned")


def import_helmet():
    """Import the OBJ file"""
    if not OBJ_PATH.exists():
        print(f"❌ OBJ file not found: {OBJ_PATH}")
        return None

    # Import OBJ
    bpy.ops.wm.obj_import(filepath=str(OBJ_PATH))

    # Get imported object(s)
    imported_objects = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']

    print(f"✅ Imported {len(imported_objects)} object(s) from {OBJ_PATH.name}")
    for obj in imported_objects:
        print(f"   - {obj.name}")

    return imported_objects


# ============================================================
# STEP 2: SCENE SETUP
# ============================================================

def setup_lighting():
    """Create studio lighting"""
    # Key light
    bpy.ops.object.light_add(type='AREA', location=(4, -4, 5))
    key_light = bpy.context.object
    key_light.name = "Key_Light"
    key_light.data.energy = 400
    key_light.data.size = 4
    key_light.rotation_euler = (math.radians(55), 0, math.radians(45))

    # Fill light
    bpy.ops.object.light_add(type='AREA', location=(-3, -3, 4))
    fill_light = bpy.context.object
    fill_light.name = "Fill_Light"
    fill_light.data.energy = 200
    fill_light.data.size = 5
    fill_light.rotation_euler = (math.radians(55), 0, math.radians(-45))

    # Rim light
    bpy.ops.object.light_add(type='AREA', location=(0, 4, 4))
    rim_light = bpy.context.object
    rim_light.name = "Rim_Light"
    rim_light.data.energy = 250
    rim_light.data.size = 3
    rim_light.rotation_euler = (math.radians(25), 0, math.radians(180))

    # Environment
    world = bpy.context.scene.world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    nodes.clear()

    env_node = nodes.new(type='ShaderNodeBackground')
    env_node.inputs['Strength'].default_value = 0.4
    env_node.inputs['Color'].default_value = (0.95, 0.95, 1.0, 1.0)

    output_node = nodes.new(type='ShaderNodeOutputWorld')
    world.node_tree.links.new(env_node.outputs['Background'], output_node.inputs['Surface'])

    print("✅ Lighting setup complete")


def setup_camera(target_objects):
    """Position camera to frame the helmet"""
    # Create camera
    bpy.ops.object.camera_add(location=(0, -6, 1.8))
    camera = bpy.context.object
    camera.name = "Preview_Camera"
    camera.rotation_euler = (math.radians(82), 0, 0)

    bpy.context.scene.camera = camera
    camera.data.lens = 60
    camera.data.sensor_width = 36

    # Calculate center of all objects for framing
    if target_objects:
        all_verts = []
        for obj in target_objects:
            all_verts.extend([obj.matrix_world @ v.co for v in obj.data.vertices])

        if all_verts:
            center = sum((v for v in all_verts), Vector()) / len(all_verts)
            print(f"✅ Camera centered on: {center}")

    print("✅ Camera positioned")


def setup_render_settings():
    """Configure render settings"""
    scene = bpy.context.scene

    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'GPU'

    scene.render.resolution_x = 1024
    scene.render.resolution_y = 1024
    scene.cycles.samples = 128  # Adjust for quality vs speed

    scene.cycles.use_denoising = True
    scene.render.use_compositing = True
    scene.render.film_transparent = True

    scene.view_settings.view_transform = 'Standard'
    scene.view_settings.look = 'None'

    print("✅ Render settings configured")


# ============================================================
# STEP 3: MATERIALS
# ============================================================

def hex_to_rgb(hex_color):
    """Convert hex to RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))


def create_test_material(color_hex="#FFD700", finish="chrome"):
    """Create a test material"""
    mat = bpy.data.materials.new(name=f"Test_{finish}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()

    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')

    # Set color
    rgb = hex_to_rgb(color_hex)
    bsdf.inputs['Base Color'].default_value = (*rgb, 1.0)

    # Set finish (chrome example)
    if finish == "chrome":
        bsdf.inputs['Metallic'].default_value = 1.0
        bsdf.inputs['Roughness'].default_value = 0.02
        bsdf.inputs['Clearcoat'].default_value = 0.5
    elif finish == "glossy":
        bsdf.inputs['Metallic'].default_value = 0.0
        bsdf.inputs['Roughness'].default_value = 0.15
        bsdf.inputs['Clearcoat'].default_value = 0.8
    elif finish == "matte":
        bsdf.inputs['Metallic'].default_value = 0.0
        bsdf.inputs['Roughness'].default_value = 0.95

    output = nodes.new(type='ShaderNodeOutputMaterial')
    mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    return mat


def apply_material(objects, material):
    """Apply material to all objects"""
    for obj in objects:
        if obj.data.materials:
            obj.data.materials[0] = material
        else:
            obj.data.materials.append(material)

    print(f"✅ Applied material: {material.name}")


# ============================================================
# STEP 4: RENDER
# ============================================================

def render_test_preview(output_filename="test_preview.png"):
    """Render a test image"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    output_path = OUTPUT_DIR / output_filename
    scene = bpy.context.scene
    scene.render.filepath = str(output_path)

    print(f"🎨 Rendering test preview...")
    bpy.ops.render.render(write_still=True)
    print(f"✅ Rendered: {output_path}")
    print(f"   Open this file to check the result!")


# ============================================================
# MAIN EXECUTION
# ============================================================

def main():
    """Main setup and render flow"""
    print("\n" + "=" * 70)
    print("HELMET MATERIAL PREVIEW - QUICK SETUP")
    print("=" * 70 + "\n")

    # Step 1: Import
    print("STEP 1: Importing helmet...")
    clean_scene()
    helmet_objects = import_helmet()

    if not helmet_objects:
        print("❌ Failed to import helmet. Check OBJ path.")
        return

    # Step 2: Setup scene
    print("\nSTEP 2: Setting up scene...")
    setup_lighting()
    setup_camera(helmet_objects)
    setup_render_settings()

    # Step 3: Apply test material
    print("\nSTEP 3: Applying test material...")
    test_material = create_test_material(color_hex="#FFD700", finish="chrome")
    apply_material(helmet_objects, test_material)

    # Step 4: Render test
    print("\nSTEP 4: Rendering test preview...")
    render_test_preview("test_chrome_gold.png")

    print("\n" + "=" * 70)
    print("✅ SETUP COMPLETE!")
    print("=" * 70)
    print("\nNext steps:")
    print("1. Check the rendered image in:")
    print(f"   {OUTPUT_DIR}/test_chrome_gold.png")
    print("\n2. If it looks good, run the full preview script:")
    print("   render_premium_material_previews.py")
    print("\n3. Or modify this script to try different:")
    print("   - Colors: change color_hex")
    print("   - Finishes: change finish parameter")
    print("   - Quality: change samples in setup_render_settings()")
    print("=" * 70)


if __name__ == "__main__":
    main()

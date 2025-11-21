#!/usr/bin/env python3
import sys
sys.path.insert(0, '/Users/postgres/Blender.app/Contents/Resources/4.5/python/lib/python3.11/site-packages')

import bpy

# Clear existing scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Import GLB
glb_path = "/Users/kashyapmaheshwari/Blender-Workspace/projects/helmet-customizer-r3f/public/models/helmet_glossy.glb"
bpy.ops.import_scene.gltf(filepath=glb_path)

print("\n=== HELMET GLB OBJECT NAMES ===\n")
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        print(f"Object: {obj.name}")
        print(f"  Type: {obj.type}")
        if obj.parent:
            print(f"  Parent: {obj.parent.name}")
        print()

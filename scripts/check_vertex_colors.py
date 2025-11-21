#!/usr/bin/env python3
import sys
sys.path.insert(0, '/Users/postgres/Blender.app/Contents/Resources/4.5/python/lib/python3.11/site-packages')

import bpy

# Clear existing scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Import GLB
glb_path = "/Users/kashyapmaheshwari/Blender-Workspace/projects/helmet-customizer-r3f/public/models/helmet_glossy.glb"
bpy.ops.import_scene.gltf(filepath=glb_path)

print("\n=== VERTEX COLOR CHECK ===\n")
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        print(f"Object: {obj.name}")
        mesh = obj.data
        if mesh.vertex_colors or mesh.color_attributes:
            print(f"  ✓ HAS VERTEX COLORS")
            if mesh.color_attributes:
                for attr in mesh.color_attributes:
                    print(f"    - Attribute: {attr.name}, Domain: {attr.domain}, Type: {attr.data_type}")
        else:
            print(f"  ✗ No vertex colors")

        # Check material
        if obj.material_slots:
            mat = obj.material_slots[0].material
            if mat:
                print(f"  Material: {mat.name}")
                if mat.use_nodes:
                    for node in mat.node_tree.nodes:
                        if node.type == 'ATTRIBUTE' or 'Color' in node.type:
                            print(f"    - Node: {node.type} - {node.name}")
        print()

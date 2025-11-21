#!/usr/bin/env python3
"""
Export the 4 essential materials using Version A (official fixed model).
These materials work perfectly with GLB export using basic PBR values.
"""

import bpy
import os

# Final 4 materials for production
MATERIALS = {
    'glossy': {'metalness': 0.0, 'roughness': 0.1, 'desc': 'Shiny plastic finish'},
    'matte': {'metalness': 0.0, 'roughness': 0.9, 'desc': 'Flat non-reflective finish'},
    'chrome': {'metalness': 1.0, 'roughness': 0.05, 'desc': 'Mirror chrome finish'},
    'brushed_metal': {'metalness': 1.0, 'roughness': 0.3, 'desc': 'Brushed metal finish'},
}

def apply_material_to_all_objects(material_name, metalness, roughness, base_color=(0.8, 0.8, 0.8, 1.0)):
    """Apply single material to all helmet objects."""

    # Create or get material
    mat = bpy.data.materials.get(f"Helmet_{material_name}")
    if not mat:
        mat = bpy.data.materials.new(name=f"Helmet_{material_name}")
        mat.use_nodes = True

    # Clear existing nodes
    mat.node_tree.nodes.clear()

    # Create Principled BSDF
    bsdf = mat.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)

    # Set material properties
    bsdf.inputs['Base Color'].default_value = base_color
    bsdf.inputs['Metallic'].default_value = metalness
    bsdf.inputs['Roughness'].default_value = roughness

    # Create output node
    output = mat.node_tree.nodes.new('ShaderNodeOutputMaterial')
    output.location = (200, 0)

    # Link nodes
    mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    # Apply to all helmet objects
    for obj in bpy.data.objects:
        if obj.type == 'MESH' and 'Combined' in obj.name:
            # Clear existing materials
            obj.data.materials.clear()
            # Assign new material
            obj.data.materials.append(mat)

    print(f"  ✅ Applied {material_name} (M:{metalness}, R:{roughness})")

def export_glb(material_name, output_dir):
    """Export current scene as GLB."""

    filename = f"helmet_{material_name}.glb"
    filepath = os.path.join(output_dir, filename)

    # Select all helmet objects
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.data.objects:
        if obj.type == 'MESH' and 'Combined' in obj.name:
            obj.select_set(True)

    # Export
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        use_selection=True,
        export_format='GLB',
        export_materials='EXPORT'
    )

    return filename

def export_final_materials():
    """Export the 4 final production materials."""

    print("\n" + "="*80)
    print("EXPORTING 4 FINAL PRODUCTION MATERIALS")
    print("="*80 + "\n")

    # Paths
    official_model = "/Users/kashyapmaheshwari/Blender-Workspace/projects/helmet-customizer/3d-assets/collected-originals/helmet_5zones_FIXED_official.blend"
    output_dir = "/Users/kashyapmaheshwari/Blender-Workspace/projects/helmet-customizer-r3f/public/models"

    print(f"Source: helmet_5zones_FIXED_official.blend")
    print(f"Output: {output_dir}\n")

    # Open official model
    bpy.ops.wm.open_mainfile(filepath=official_model)
    print("✅ Loaded official fixed model\n")

    # Export each material
    for material_name, props in MATERIALS.items():
        print(f"{material_name.upper().replace('_', ' ')}:")

        # Apply material
        apply_material_to_all_objects(
            material_name,
            props['metalness'],
            props['roughness']
        )

        # Export
        filename = export_glb(material_name, output_dir)
        print(f"  ✅ Exported: {filename}\n")

    print("="*80)
    print(f"COMPLETE: {len(MATERIALS)} Production Materials Exported")
    print("="*80 + "\n")

    print("Materials exported:")
    for name, props in MATERIALS.items():
        print(f"  • {name.replace('_', ' ').title()}: {props['desc']}")

    print("\nReady for production use!")

if __name__ == "__main__":
    export_final_materials()

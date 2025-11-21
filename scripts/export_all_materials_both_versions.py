#!/usr/bin/env python3
"""
Export all 12 material variations for BOTH Version A and Version B.
This will help us see if there are any visual differences between the versions
when different materials are applied.
"""

import bpy
import os

# Material definitions (metalness, roughness)
MATERIALS = {
    'glossy': {'metalness': 0.0, 'roughness': 0.1},
    'matte': {'metalness': 0.0, 'roughness': 0.9},
    'satin': {'metalness': 0.0, 'roughness': 0.4},
    'car_paint': {'metalness': 0.0, 'roughness': 0.2},
    'pearl': {'metalness': 0.1, 'roughness': 0.3},
    'wet_look': {'metalness': 0.0, 'roughness': 0.02},
    'chrome': {'metalness': 1.0, 'roughness': 0.05},
    'brushed_metal': {'metalness': 1.0, 'roughness': 0.3},
    'anodized': {'metalness': 0.9, 'roughness': 0.2},
    'metallic_flake': {'metalness': 0.6, 'roughness': 0.4},
    'carbon_fiber': {'metalness': 0.2, 'roughness': 0.8},
    'rubberized': {'metalness': 0.0, 'roughness': 0.95},
}

def apply_material_to_all_objects(material_name, metalness, roughness):
    """Apply material properties to all helmet objects with different colors per zone."""

    # Color coding for each zone (for visibility)
    zone_colors = {
        'Shell_Combined': (0.2, 0.4, 0.8, 1.0),        # Blue
        'Facemask_Combined': (0.8, 0.2, 0.2, 1.0),     # Red
        'Hardware_Combined': (0.2, 0.8, 0.2, 1.0),     # Green
        'Chinstrap_Combined': (0.8, 0.6, 0.2, 1.0),    # Orange
        'Padding_Combined': (0.6, 0.2, 0.8, 1.0),      # Purple
    }

    # Apply to all helmet objects
    for obj in bpy.data.objects:
        if obj.type == 'MESH' and 'Combined' in obj.name:
            # Create unique material for this object
            mat_name = f"Helmet_{material_name}_{obj.name}"
            mat = bpy.data.materials.get(mat_name)
            if not mat:
                mat = bpy.data.materials.new(name=mat_name)
                mat.use_nodes = True

            # Clear existing nodes
            mat.node_tree.nodes.clear()

            # Create Principled BSDF
            bsdf = mat.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
            bsdf.location = (0, 0)

            # Set material properties with zone-specific color
            color = zone_colors.get(obj.name, (0.8, 0.8, 0.8, 1.0))
            bsdf.inputs['Base Color'].default_value = color
            bsdf.inputs['Metallic'].default_value = metalness
            bsdf.inputs['Roughness'].default_value = roughness

            # Create output node
            output = mat.node_tree.nodes.new('ShaderNodeOutputMaterial')
            output.location = (200, 0)

            # Link nodes
            mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

            # Clear existing materials and assign new one
            obj.data.materials.clear()
            obj.data.materials.append(mat)

    print(f"  ✅ Applied {material_name} material (M:{metalness}, R:{roughness}) with colored zones")

def export_glb(version_letter, material_name, output_dir):
    """Export current scene as GLB."""

    filename = f"helmet_{material_name}_VERSION_{version_letter}.glb"
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

def export_all_materials():
    """Export all materials for both versions."""

    print("\n" + "="*80)
    print("EXPORTING ALL MATERIALS FOR BOTH VERSIONS")
    print("="*80 + "\n")

    originals_dir = "/Users/kashyapmaheshwari/Blender-Workspace/projects/helmet-customizer/3d-assets/collected-originals"
    output_dir = "/Users/kashyapmaheshwari/Blender-Workspace/projects/helmet-customizer-r3f/public/models"

    versions = {
        'A': f"{originals_dir}/helmet_VERSION_A_TopBarInFacemask.blend",
        'B': f"{originals_dir}/helmet_VERSION_B_TopBarInHardware.blend"
    }

    total_exports = 0

    for version_letter, blend_path in versions.items():
        print(f"\n{'='*80}")
        print(f"VERSION {version_letter}: {os.path.basename(blend_path)}")
        print(f"{'='*80}\n")

        # Open the version
        bpy.ops.wm.open_mainfile(filepath=blend_path)

        # Export each material
        for material_name, props in MATERIALS.items():
            print(f"\n{material_name.upper()}:")

            # Apply material
            apply_material_to_all_objects(
                material_name,
                props['metalness'],
                props['roughness']
            )

            # Export
            filename = export_glb(version_letter, material_name, output_dir)
            print(f"  ✅ Exported: {filename}")

            total_exports += 1

    print("\n" + "="*80)
    print(f"COMPLETE: {total_exports} GLB FILES EXPORTED")
    print("="*80 + "\n")

    print(f"Total files: {total_exports} ({len(MATERIALS)} materials × 2 versions)")
    print(f"Output directory: {output_dir}")
    print("\nNext: Update R3F viewer to compare both versions!")

if __name__ == "__main__":
    export_all_materials()

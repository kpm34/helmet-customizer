#!/usr/bin/env python3
"""
Inspect Blender helmet model to diagnose duplicate geometry issues.
Specifically looking for duplicate top bar groupings.
"""

import bpy
import sys
from collections import defaultdict

def inspect_model():
    """Inspect all objects and report on potential duplicate geometry."""

    print("\n" + "="*80)
    print("HELMET MODEL INSPECTION REPORT")
    print("="*80 + "\n")

    # Get all mesh objects
    mesh_objects = [obj for obj in bpy.data.objects if obj.type == 'MESH']

    print(f"Total Mesh Objects: {len(mesh_objects)}\n")
    print("-"*80)

    # Track objects by name pattern (looking for duplicates)
    name_groups = defaultdict(list)

    for obj in mesh_objects:
        # Extract base name (without .001, .002 suffixes)
        base_name = obj.name.split('.')[0]
        name_groups[base_name].append(obj)

    # Report on each object
    print("\nALL OBJECTS:")
    print("-"*80)
    for obj in sorted(mesh_objects, key=lambda x: x.name):
        vert_count = len(obj.data.vertices)
        face_count = len(obj.data.polygons)

        # Check for vertex groups
        vgroups = [vg.name for vg in obj.vertex_groups]
        vgroup_str = f" | VGroups: {len(vgroups)}" if vgroups else ""

        # Check for materials
        mat_count = len(obj.material_slots)
        mat_names = [slot.material.name if slot.material else "None" for slot in obj.material_slots]
        mat_str = f" | Materials: {', '.join(mat_names[:3])}" if mat_names else ""

        print(f"  {obj.name:<40} | Verts: {vert_count:>6} | Faces: {face_count:>6}{vgroup_str}{mat_str}")

    # Report on duplicate name patterns
    print("\n" + "-"*80)
    print("POTENTIAL DUPLICATES (Same base name):")
    print("-"*80)

    duplicates_found = False
    for base_name, objects in sorted(name_groups.items()):
        if len(objects) > 1:
            duplicates_found = True
            print(f"\n'{base_name}' has {len(objects)} instances:")
            for obj in objects:
                vert_count = len(obj.data.vertices)
                face_count = len(obj.data.polygons)
                print(f"    {obj.name:<40} | Verts: {vert_count:>6} | Faces: {face_count:>6}")

                # Check if they share the same mesh data
                shared_data = sum(1 for other in objects if other != obj and other.data == obj.data)
                if shared_data > 0:
                    print(f"        ⚠️  SHARES MESH DATA with {shared_data} other object(s)")

    if not duplicates_found:
        print("  ✅ No objects with duplicate base names found")

    # Look for overlapping geometry (top bar issue)
    print("\n" + "-"*80)
    print("SEARCHING FOR TOP BAR / HARDWARE COMPONENTS:")
    print("-"*80)

    keywords = ['hardware', 'bar', 'top', 'facemask', 'Hardware', 'Bar', 'Top', 'Facemask']
    hardware_objects = []

    for obj in mesh_objects:
        obj_name_lower = obj.name.lower()
        if any(keyword.lower() in obj_name_lower for keyword in keywords):
            hardware_objects.append(obj)

    if hardware_objects:
        print(f"\nFound {len(hardware_objects)} potential hardware/top bar objects:\n")
        for obj in hardware_objects:
            vert_count = len(obj.data.vertices)
            face_count = len(obj.data.polygons)

            # Get bounding box
            bbox = obj.bound_box
            bbox_z_max = max(v[2] for v in bbox)

            # Get parent info
            parent_info = f" | Parent: {obj.parent.name}" if obj.parent else " | No parent"

            print(f"  {obj.name:<40}")
            print(f"    Verts: {vert_count:>6} | Faces: {face_count:>6} | Z-max: {bbox_z_max:>8.3f}{parent_info}")

            # Check for vertex groups (zone assignments)
            if obj.vertex_groups:
                vgroups = [vg.name for vg in obj.vertex_groups]
                print(f"    Vertex Groups: {', '.join(vgroups)}")
    else:
        print("  ⚠️  No hardware/top bar objects found by name")

    # Check for collections/groups
    print("\n" + "-"*80)
    print("COLLECTIONS:")
    print("-"*80)

    for collection in bpy.data.collections:
        obj_count = len(collection.objects)
        obj_names = [obj.name for obj in collection.objects[:5]]
        more = f" ... and {obj_count - 5} more" if obj_count > 5 else ""
        print(f"  {collection.name:<40} | Objects: {obj_count}")
        if obj_names:
            print(f"    Contains: {', '.join(obj_names)}{more}")

    # Check for vertex color layers
    print("\n" + "-"*80)
    print("VERTEX COLOR LAYERS (5-Zone System):")
    print("-"*80)

    for obj in mesh_objects:
        if obj.data.vertex_colors:
            print(f"\n  {obj.name}:")
            for vcol in obj.data.vertex_colors:
                print(f"    - {vcol.name}")

    print("\n" + "="*80)
    print("END OF INSPECTION REPORT")
    print("="*80 + "\n")

if __name__ == "__main__":
    inspect_model()

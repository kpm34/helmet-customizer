#!/usr/bin/env python3
"""
Quick check for obvious z-fighting by looking at faces in the same spatial region.
Much faster than comparing every face to every other face.
"""

import bpy
import bmesh
from collections import defaultdict

def quick_overlap_check():
    """Quick check for overlapping faces using spatial hashing."""

    print("\n" + "="*80)
    print("QUICK Z-FIGHTING CHECK")
    print("="*80 + "\n")

    # Get all mesh objects
    mesh_objects = [obj for obj in bpy.data.objects if obj.type == 'MESH']

    print(f"Checking {len(mesh_objects)} objects...\n")

    # Spatial hash: round coordinates to grid cells
    GRID_SIZE = 0.1  # 10cm grid cells
    spatial_hash = defaultdict(list)

    total_faces = 0

    for obj in mesh_objects:
        bm = bmesh.new()
        bm.from_mesh(obj.data)
        bm.faces.ensure_lookup_table()

        world_matrix = obj.matrix_world

        for face in bm.faces:
            # Get face center in world space
            center_local = face.calc_center_median()
            center_world = world_matrix @ center_local

            # Hash to grid cell
            grid_x = round(center_world.x / GRID_SIZE)
            grid_y = round(center_world.y / GRID_SIZE)
            grid_z = round(center_world.z / GRID_SIZE)
            grid_key = (grid_x, grid_y, grid_z)

            # Store face info
            spatial_hash[grid_key].append({
                'object': obj.name,
                'face_index': face.index,
                'center': center_world,
                'area': face.calc_area()
            })

            total_faces += 1

        bm.free()

    print(f"Total faces: {total_faces}")
    print(f"Grid cells occupied: {len(spatial_hash)}\n")
    print("-"*80)

    # Find cells with faces from multiple objects
    suspicious_cells = []

    for grid_key, faces in spatial_hash.items():
        if len(faces) < 2:
            continue

        # Check if faces from different objects
        objects_in_cell = set(f['object'] for f in faces)
        if len(objects_in_cell) > 1:
            suspicious_cells.append((grid_key, faces, objects_in_cell))

    print(f"\nFound {len(suspicious_cells)} grid cells with faces from multiple objects\n")
    print("-"*80)

    if suspicious_cells:
        # Group by object pairs
        object_pair_counts = defaultdict(int)

        for grid_key, faces, objects in suspicious_cells:
            # Count faces per object in this cell
            object_face_counts = defaultdict(int)
            for face in faces:
                object_face_counts[face['object']] += 1

            # Record the overlap
            for obj1 in objects:
                for obj2 in objects:
                    if obj1 < obj2:  # Avoid duplicates
                        pair_key = (obj1, obj2)
                        object_pair_counts[pair_key] += min(
                            object_face_counts[obj1],
                            object_face_counts[obj2]
                        )

        print("\nPOTENTIAL Z-FIGHTING BETWEEN OBJECTS:\n")
        for (obj1, obj2), count in sorted(object_pair_counts.items(), key=lambda x: -x[1]):
            print(f"  {obj1} ↔ {obj2}: ~{count} potentially overlapping faces")

        # Show some specific examples
        print("\n" + "-"*80)
        print("EXAMPLE LOCATIONS:\n")

        for idx, (grid_key, faces, objects) in enumerate(suspicious_cells[:10]):
            print(f"\nGrid Cell {grid_key}:")
            print(f"  Objects: {', '.join(sorted(objects))}")
            print(f"  Total faces: {len(faces)}")

            # Show a sample position
            sample_face = faces[0]
            pos = sample_face['center']
            print(f"  Position: ({pos.x:.3f}, {pos.y:.3f}, {pos.z:.3f})")

            # Show breakdown by object
            object_counts = defaultdict(int)
            for face in faces:
                object_counts[face['object']] += 1
            for obj_name, count in sorted(object_counts.items()):
                print(f"    {obj_name}: {count} faces")

        if len(suspicious_cells) > 10:
            print(f"\n  ... and {len(suspicious_cells) - 10} more suspicious locations")

    else:
        print("\n✅ No obvious overlapping geometry detected!")
        print("   All objects occupy separate spatial regions.")

    print("\n" + "="*80)
    print("END OF QUICK CHECK")
    print("="*80 + "\n")

if __name__ == "__main__":
    quick_overlap_check()

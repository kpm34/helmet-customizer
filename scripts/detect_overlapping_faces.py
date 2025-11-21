#!/usr/bin/env python3
"""
Detect overlapping/coincident faces that cause z-fighting.
The issue is NOT duplicate vertices, but rather the same geometry
existing in multiple objects (like top bar in both Hardware and Facemask).
"""

import bpy
import bmesh
from mathutils import Vector
from collections import defaultdict

def get_face_center(face):
    """Get the center point of a face."""
    return face.calc_center_median()

def get_face_normal(face):
    """Get the normal vector of a face."""
    return face.normal.copy()

def faces_are_coincident(face1_center, face1_normal, face2_center, face2_normal, tolerance=0.001):
    """
    Check if two faces are overlapping (same position and orientation).

    Args:
        face1_center: Center point of first face
        face1_normal: Normal vector of first face
        face2_center: Center point of second face
        face2_normal: Normal vector of second face
        tolerance: Distance tolerance for considering faces coincident

    Returns:
        bool: True if faces are overlapping
    """
    # Check if centers are close enough
    distance = (face1_center - face2_center).length
    if distance > tolerance:
        return False

    # Check if normals are aligned (parallel or anti-parallel)
    normal_dot = face1_normal.dot(face2_normal)
    # Normals are aligned if dot product is close to 1 or -1
    if abs(abs(normal_dot) - 1.0) > 0.1:  # Allow some tolerance
        return False

    return True

def detect_overlapping_faces():
    """Detect overlapping faces between different objects."""

    print("\n" + "="*80)
    print("Z-FIGHTING DETECTION: Overlapping Faces Analysis")
    print("="*80 + "\n")

    # Get all mesh objects
    mesh_objects = [obj for obj in bpy.data.objects if obj.type == 'MESH']

    print(f"Analyzing {len(mesh_objects)} objects for overlapping geometry...\n")

    # Store all faces with their world positions
    all_faces_data = []

    for obj in mesh_objects:
        # Create bmesh from object
        bm = bmesh.new()
        bm.from_mesh(obj.data)
        bm.faces.ensure_lookup_table()

        # Get world matrix for transforming to world space
        world_matrix = obj.matrix_world

        # Store each face's data
        for face in bm.faces:
            # Transform center and normal to world space
            center_world = world_matrix @ get_face_center(face)
            normal_world = (world_matrix.to_3x3() @ get_face_normal(face)).normalized()

            all_faces_data.append({
                'object': obj.name,
                'face_index': face.index,
                'center': center_world,
                'normal': normal_world,
                'area': face.calc_area()
            })

        bm.free()

    print(f"Total faces to analyze: {len(all_faces_data)}\n")
    print("-"*80)

    # Find overlapping faces
    overlaps = []
    tolerance = 0.001  # 1mm tolerance

    print("\nSearching for overlapping faces...")
    print("(This may take a moment...)\n")

    for i in range(len(all_faces_data)):
        for j in range(i + 1, len(all_faces_data)):
            face1 = all_faces_data[i]
            face2 = all_faces_data[j]

            # Skip if same object
            if face1['object'] == face2['object']:
                continue

            # Check if faces are coincident
            if faces_are_coincident(
                face1['center'], face1['normal'],
                face2['center'], face2['normal'],
                tolerance
            ):
                overlaps.append((face1, face2))

    # Report results
    print("-"*80)
    print(f"\nFOUND {len(overlaps)} OVERLAPPING FACE PAIRS\n")
    print("-"*80)

    if overlaps:
        # Group by object pairs
        object_pairs = defaultdict(list)
        for face1, face2 in overlaps:
            key = tuple(sorted([face1['object'], face2['object']]))
            object_pairs[key].append((face1, face2))

        # Report by object pair
        for (obj1_name, obj2_name), pairs in sorted(object_pairs.items()):
            print(f"\n{obj1_name} ↔ {obj2_name}: {len(pairs)} overlapping faces")

            # Show first few examples with positions
            for idx, (face1, face2) in enumerate(pairs[:5]):
                pos = face1['center']
                print(f"  Face #{face1['face_index']} ↔ Face #{face2['face_index']} "
                      f"at ({pos.x:.3f}, {pos.y:.3f}, {pos.z:.3f})")

            if len(pairs) > 5:
                print(f"  ... and {len(pairs) - 5} more")

        # Identify the problematic areas
        print("\n" + "-"*80)
        print("PROBLEM AREAS (by Z-height):")
        print("-"*80)

        # Group by approximate Z-height
        z_groups = defaultdict(list)
        for face1, face2 in overlaps:
            z_height = round(face1['center'].z, 1)  # Round to 0.1 unit
            z_groups[z_height].append((face1, face2))

        for z_height in sorted(z_groups.keys(), reverse=True):
            pairs = z_groups[z_height]
            print(f"\nZ ≈ {z_height:.1f}: {len(pairs)} overlapping faces")

            # Count which objects are involved
            objects_involved = set()
            for face1, face2 in pairs:
                objects_involved.add(face1['object'])
                objects_involved.add(face2['object'])
            print(f"  Objects involved: {', '.join(sorted(objects_involved))}")
    else:
        print("\n✅ No overlapping faces detected!")
        print("   The model is clean - no z-fighting issues found.")

    print("\n" + "="*80)
    print("END OF OVERLAP DETECTION")
    print("="*80 + "\n")

if __name__ == "__main__":
    detect_overlapping_faces()

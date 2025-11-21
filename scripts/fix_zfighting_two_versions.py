#!/usr/bin/env python3
"""
Fix z-fighting by creating TWO versions:
- Version A: Top bar stays in Facemask, removed from Hardware
- Version B: Top bar stays in Hardware, removed from Facemask

Safely creates backups and new files without modifying the original.
"""

import bpy
import bmesh
import os
from datetime import datetime
from pathlib import Path

def get_overlapping_faces(obj1_name, obj2_name, tolerance=0.001):
    """Find overlapping faces between two objects."""

    obj1 = bpy.data.objects[obj1_name]
    obj2 = bpy.data.objects[obj2_name]

    # Create bmeshes
    bm1 = bmesh.new()
    bm1.from_mesh(obj1.data)
    bm1.faces.ensure_lookup_table()

    bm2 = bmesh.new()
    bm2.from_mesh(obj2.data)
    bm2.faces.ensure_lookup_table()

    world_matrix1 = obj1.matrix_world
    world_matrix2 = obj2.matrix_world

    # Store face centers in world space
    faces1_data = []
    for face in bm1.faces:
        center_world = world_matrix1 @ face.calc_center_median()
        faces1_data.append({
            'face': face,
            'center': center_world,
            'index': face.index
        })

    faces2_data = []
    for face in bm2.faces:
        center_world = world_matrix2 @ face.calc_center_median()
        faces2_data.append({
            'face': face,
            'center': center_world,
            'index': face.index
        })

    # Find overlapping faces
    overlapping_in_obj1 = set()
    overlapping_in_obj2 = set()

    for f1_data in faces1_data:
        for f2_data in faces2_data:
            distance = (f1_data['center'] - f2_data['center']).length
            if distance < tolerance:
                overlapping_in_obj1.add(f1_data['index'])
                overlapping_in_obj2.add(f2_data['index'])

    return bm1, bm2, overlapping_in_obj1, overlapping_in_obj2

def remove_faces_from_object(obj_name, face_indices_to_remove):
    """Remove specific faces from an object."""

    if not face_indices_to_remove:
        print(f"  No faces to remove from {obj_name}")
        return 0

    obj = bpy.data.objects[obj_name]

    # Create bmesh
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.faces.ensure_lookup_table()

    # Mark faces for deletion
    faces_to_delete = [bm.faces[i] for i in face_indices_to_remove if i < len(bm.faces)]

    # Delete faces
    for face in faces_to_delete:
        bm.faces.remove(face)

    # Update mesh
    bm.to_mesh(obj.data)
    obj.data.update()
    bm.free()

    print(f"  ✅ Removed {len(faces_to_delete)} overlapping faces from {obj_name}")
    return len(faces_to_delete)

def fix_zfighting():
    """Main function to fix z-fighting."""

    print("\n" + "="*80)
    print("FIX Z-FIGHTING: Creating Two Versions")
    print("="*80 + "\n")

    # Get original filepath
    original_filepath = bpy.data.filepath
    original_dir = os.path.dirname(original_filepath)
    original_name = os.path.basename(original_filepath)

    print(f"Source file: {original_name}\n")

    # Create backup first
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"BACKUP_{timestamp}_{original_name}"
    backup_path = os.path.join(original_dir, backup_name)

    print(f"Creating backup: {backup_name}")
    bpy.ops.wm.save_as_mainfile(filepath=backup_path, copy=True)
    print(f"✅ Backup saved\n")

    # Detect overlapping faces
    print("-"*80)
    print("Analyzing overlapping faces...")
    print("-"*80 + "\n")

    # Facemask ↔ Hardware overlap
    print("1. Facemask ↔ Hardware (top bar area)...")
    bm1, bm2, facemask_overlap, hardware_overlap = get_overlapping_faces(
        'Facemask_Combined', 'Hardware_Combined'
    )
    bm1.free()
    bm2.free()

    print(f"   Found {len(facemask_overlap)} overlapping faces in Facemask")
    print(f"   Found {len(hardware_overlap)} overlapping faces in Hardware\n")

    # Facemask ↔ Padding overlap
    print("2. Facemask ↔ Padding (connection area)...")
    bm3, bm4, facemask_padding_overlap, padding_overlap = get_overlapping_faces(
        'Facemask_Combined', 'Padding_Combined'
    )
    bm3.free()
    bm4.free()

    print(f"   Found {len(facemask_padding_overlap)} overlapping faces in Facemask")
    print(f"   Found {len(padding_overlap)} overlapping faces in Padding\n")

    # ========================================================================
    # VERSION A: Keep geometry in Facemask, remove from Hardware/Padding
    # ========================================================================
    print("\n" + "="*80)
    print("VERSION A: Top bar in FACEMASK (remove from Hardware)")
    print("="*80 + "\n")

    # Remove from Hardware
    removed_hardware = remove_faces_from_object('Hardware_Combined', hardware_overlap)

    # Remove Padding overlaps from Padding (keep in Facemask)
    removed_padding_a = remove_faces_from_object('Padding_Combined', padding_overlap)

    version_a_name = f"helmet_VERSION_A_TopBarInFacemask.blend"
    version_a_path = os.path.join(original_dir, version_a_name)
    bpy.ops.wm.save_as_mainfile(filepath=version_a_path, copy=False)
    print(f"\n✅ Version A saved: {version_a_name}")
    print(f"   Removed {removed_hardware} faces from Hardware")
    print(f"   Removed {removed_padding_a} faces from Padding\n")

    # ========================================================================
    # Reload original to create Version B
    # ========================================================================
    print("-"*80)
    print("Reloading original file for Version B...")
    print("-"*80 + "\n")

    bpy.ops.wm.open_mainfile(filepath=backup_path)

    # ========================================================================
    # VERSION B: Keep geometry in Hardware, remove from Facemask
    # ========================================================================
    print("\n" + "="*80)
    print("VERSION B: Top bar in HARDWARE (remove from Facemask)")
    print("="*80 + "\n")

    # Re-detect overlaps (in case)
    bm1, bm2, facemask_overlap, hardware_overlap = get_overlapping_faces(
        'Facemask_Combined', 'Hardware_Combined'
    )
    bm1.free()
    bm2.free()

    bm3, bm4, facemask_padding_overlap, padding_overlap = get_overlapping_faces(
        'Facemask_Combined', 'Padding_Combined'
    )
    bm3.free()
    bm4.free()

    # Combine all Facemask overlaps
    all_facemask_overlaps = facemask_overlap.union(facemask_padding_overlap)

    # Remove from Facemask
    removed_facemask = remove_faces_from_object('Facemask_Combined', all_facemask_overlaps)

    version_b_name = f"helmet_VERSION_B_TopBarInHardware.blend"
    version_b_path = os.path.join(original_dir, version_b_name)
    bpy.ops.wm.save_as_mainfile(filepath=version_b_path, copy=False)
    print(f"\n✅ Version B saved: {version_b_name}")
    print(f"   Removed {removed_facemask} faces from Facemask\n")

    # ========================================================================
    # Summary
    # ========================================================================
    print("\n" + "="*80)
    print("COMPLETE: Two Versions Created Successfully!")
    print("="*80 + "\n")

    print("Files created:")
    print(f"  1. Backup:     {backup_name}")
    print(f"  2. Version A:  {version_a_name}")
    print(f"  3. Version B:  {version_b_name}\n")

    print("Next steps:")
    print("  1. Export Version A as GLB")
    print("  2. Export Version B as GLB")
    print("  3. Test both in R3F viewer")
    print("  4. Choose the version that looks better\n")

    print("="*80 + "\n")

    # Restore original file
    print("Restoring original file...")
    bpy.ops.wm.open_mainfile(filepath=original_filepath)
    print("✅ Original file restored\n")

if __name__ == "__main__":
    fix_zfighting()

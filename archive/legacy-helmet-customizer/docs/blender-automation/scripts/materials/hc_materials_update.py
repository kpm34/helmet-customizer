"""
Helmet Material Property Updater for Blender
=============================================

Updates material properties for the 5-zone helmet vertex color system:
- FACEMASK (RED: 1,0,0)
- SHELL (BLACK: 0,0,0)
- CHINSTRAP (GREEN: 0,1,0)
- INTERIOR PADDING (BLUE: 0,0,1)
- HARDWARE (YELLOW: 1,1,0)

Usage:
    # Via Blender MCP
    execute_blender_code(code=open('update_helmet_materials.py').read())

    # Or direct Blender execution
    blender --background helmet.blend --python update_helmet_materials.py
"""

import bpy
import json
from typing import Dict, List, Tuple, Optional

# ============================================================
# ZONE DEFINITIONS
# ============================================================

ZONES = {
    'FACEMASK': (1.0, 0.0, 0.0),      # Red
    'SHELL': (0.0, 0.0, 0.0),          # Black
    'CHINSTRAP': (0.0, 1.0, 0.0),      # Green
    'INTERIOR_PADDING': (0.0, 0.0, 1.0), # Blue
    'HARDWARE': (1.0, 1.0, 0.0),       # Yellow
}

# Material finish presets
FINISH_PRESETS = {
    'glossy': {'metallic': 0.0, 'roughness': 0.1},
    'matte': {'metallic': 0.0, 'roughness': 0.8},
    'chrome': {'metallic': 1.0, 'roughness': 0.05},
    'brushed': {'metallic': 0.9, 'roughness': 0.35},
    'satin': {'metallic': 0.1, 'roughness': 0.5},
}

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def hex_to_rgb(hex_color: str) -> Tuple[float, float, float]:
    """Convert hex color to RGB float tuple (0.0-1.0)"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))


def find_helmet_material() -> Optional[bpy.types.Material]:
    """Find the helmet material node (should be named 'HelmetMaterial' or similar)"""
    # Try common names
    common_names = ['HelmetMaterial', 'Helmet_Material', 'helmet_material', 'Material']

    for name in common_names:
        mat = bpy.data.materials.get(name)
        if mat and mat.use_nodes:
            return mat

    # Fallback: return first material with nodes
    for mat in bpy.data.materials:
        if mat.use_nodes:
            return mat

    return None


def get_or_create_zone_shader_group(material: bpy.types.Material, zone: str) -> Dict:
    """
    Get or create shader nodes for a specific zone
    Returns dict with node references: {bsdf, color, metallic, roughness, etc.}
    """
    nodes = material.node_tree.nodes
    links = material.node_tree.links

    # Node naming convention: Zone_BSDF, Zone_ColorAttribute, etc.
    bsdf_name = f"{zone}_BSDF"
    color_attr_name = f"{zone}_ColorAttribute"
    mix_name = f"{zone}_Mix"

    # Get or create Principled BSDF for this zone
    bsdf = nodes.get(bsdf_name)
    if not bsdf:
        bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
        bsdf.name = bsdf_name
        bsdf.location = (0, 0)  # Position will be adjusted

    # Get or create Color Attribute node for vertex colors
    color_attr = nodes.get(color_attr_name)
    if not color_attr:
        color_attr = nodes.new(type='ShaderNodeVertexColor')
        color_attr.name = color_attr_name
        color_attr.layer_name = "Col"  # Default vertex color layer
        color_attr.location = (-400, 0)

    # Link color attribute to BSDF base color
    if not bsdf.inputs['Base Color'].is_linked:
        links.new(color_attr.outputs['Color'], bsdf.inputs['Base Color'])

    return {
        'bsdf': bsdf,
        'color_attr': color_attr,
        'material': material,
    }


def setup_zone_based_material(material: bpy.types.Material):
    """
    Set up a vertex-color-based material system for all 5 zones
    Each zone has its own shader controlled by vertex colors
    """
    nodes = material.node_tree.nodes
    links = material.node_tree.links

    # Clear existing nodes (optional - be careful!)
    # nodes.clear()

    # Get or create Material Output
    output = None
    for node in nodes:
        if node.type == 'OUTPUT_MATERIAL':
            output = node
            break

    if not output:
        output = nodes.new(type='ShaderNodeOutputMaterial')
        output.location = (800, 0)

    # Create shader groups for each zone
    zone_shaders = {}
    y_offset = 0

    for zone_name, vertex_color in ZONES.items():
        shader_group = get_or_create_zone_shader_group(material, zone_name)
        zone_shaders[zone_name] = shader_group

        # Position nodes vertically
        shader_group['bsdf'].location = (400, y_offset)
        shader_group['color_attr'].location = (0, y_offset)
        y_offset -= 300

    print(f"✅ Material system set up with {len(zone_shaders)} zones")
    return zone_shaders


# ============================================================
# MATERIAL UPDATE FUNCTIONS
# ============================================================

def update_zone_color(material: bpy.types.Material, zone: str, hex_color: str):
    """Update base color for a zone"""
    nodes = material.node_tree.nodes
    bsdf = nodes.get(f"{zone}_BSDF")

    if not bsdf:
        print(f"⚠️ BSDF for {zone} not found, creating...")
        shader_group = get_or_create_zone_shader_group(material, zone)
        bsdf = shader_group['bsdf']

    rgb = hex_to_rgb(hex_color)
    bsdf.inputs['Base Color'].default_value = (*rgb, 1.0)

    print(f"✅ Updated {zone} color to {hex_color}")


def update_zone_metallic(material: bpy.types.Material, zone: str, metallic: float):
    """Update metallic value for a zone"""
    nodes = material.node_tree.nodes
    bsdf = nodes.get(f"{zone}_BSDF")

    if bsdf:
        bsdf.inputs['Metallic'].default_value = metallic
        print(f"✅ Updated {zone} metallic to {metallic}")
    else:
        print(f"⚠️ BSDF for {zone} not found")


def update_zone_roughness(material: bpy.types.Material, zone: str, roughness: float):
    """Update roughness value for a zone"""
    nodes = material.node_tree.nodes
    bsdf = nodes.get(f"{zone}_BSDF")

    if bsdf:
        bsdf.inputs['Roughness'].default_value = roughness
        print(f"✅ Updated {zone} roughness to {roughness}")
    else:
        print(f"⚠️ BSDF for {zone} not found")


def update_zone_clearcoat(material: bpy.types.Material, zone: str, clearcoat: float, clearcoat_roughness: float = 0.1):
    """Update clearcoat values for a zone"""
    nodes = material.node_tree.nodes
    bsdf = nodes.get(f"{zone}_BSDF")

    if bsdf:
        bsdf.inputs['Coat Weight'].default_value = clearcoat
        bsdf.inputs['Coat Roughness'].default_value = clearcoat_roughness
        print(f"✅ Updated {zone} clearcoat to {clearcoat}, roughness {clearcoat_roughness}")
    else:
        print(f"⚠️ BSDF for {zone} not found")


def update_zone_emissive(material: bpy.types.Material, zone: str, hex_color: str, intensity: float = 1.0):
    """Update emissive color and intensity for a zone"""
    nodes = material.node_tree.nodes
    bsdf = nodes.get(f"{zone}_BSDF")

    if bsdf:
        rgb = hex_to_rgb(hex_color)
        bsdf.inputs['Emission Color'].default_value = (*rgb, 1.0)
        bsdf.inputs['Emission Strength'].default_value = intensity
        print(f"✅ Updated {zone} emission to {hex_color} @ {intensity}")
    else:
        print(f"⚠️ BSDF for {zone} not found")


def apply_finish_preset(material: bpy.types.Material, zone: str, finish: str):
    """Apply a material finish preset to a zone"""
    if finish not in FINISH_PRESETS:
        print(f"⚠️ Unknown finish preset: {finish}")
        return

    preset = FINISH_PRESETS[finish]
    update_zone_metallic(material, zone, preset['metallic'])
    update_zone_roughness(material, zone, preset['roughness'])

    print(f"✅ Applied {finish} finish to {zone}")


# ============================================================
# WEBHOOK INTEGRATION
# ============================================================

def apply_webhook_updates(updates: List[Dict]):
    """
    Apply material updates from webhook payload

    Args:
        updates: List of zone updates, e.g.:
        [
            {
                "zone": "SHELL",
                "properties": {
                    "color": "#1E3A8A",
                    "finish": "glossy",
                    "metallic": 0.8,
                    "roughness": 0.2
                }
            }
        ]
    """
    material = find_helmet_material()

    if not material:
        print("❌ No helmet material found!")
        return

    print(f"🎨 Applying {len(updates)} material update(s) to '{material.name}'")

    # Ensure material system is set up
    setup_zone_based_material(material)

    for update in updates:
        zone = update.get('zone')
        properties = update.get('properties', {})

        if not zone or zone not in ZONES:
            print(f"⚠️ Invalid zone: {zone}")
            continue

        print(f"\n🔧 Updating {zone}:")

        # Apply color
        if 'color' in properties:
            update_zone_color(material, zone, properties['color'])

        # Apply finish preset
        if 'finish' in properties:
            apply_finish_preset(material, zone, properties['finish'])

        # Apply individual properties (override preset values)
        if 'metallic' in properties:
            update_zone_metallic(material, zone, properties['metallic'])

        if 'roughness' in properties:
            update_zone_roughness(material, zone, properties['roughness'])

        if 'clearcoat' in properties or 'clearcoatRoughness' in properties:
            clearcoat = properties.get('clearcoat', 0.0)
            clearcoat_roughness = properties.get('clearcoatRoughness', 0.1)
            update_zone_clearcoat(material, zone, clearcoat, clearcoat_roughness)

        if 'emissive' in properties:
            emissive_color = properties['emissive']
            emissive_intensity = properties.get('emissiveIntensity', 1.0)
            update_zone_emissive(material, zone, emissive_color, emissive_intensity)

    print("\n✅ All material updates applied successfully!")


# ============================================================
# EXAMPLE USAGE
# ============================================================

if __name__ == "__main__":
    # Example: Update all zones with default colors and finishes
    example_updates = [
        {
            "zone": "SHELL",
            "properties": {
                "color": "#1E3A8A",  # Navy blue
                "finish": "glossy",
                "clearcoat": 0.9,
                "clearcoatRoughness": 0.1
            }
        },
        {
            "zone": "FACEMASK",
            "properties": {
                "color": "#C0C0C0",  # Chrome silver
                "finish": "chrome",
            }
        },
        {
            "zone": "CHINSTRAP",
            "properties": {
                "color": "#1F2937",  # Dark gray
                "finish": "matte",
            }
        },
        {
            "zone": "INTERIOR_PADDING",
            "properties": {
                "color": "#F3F4F6",  # Light gray
                "finish": "matte",
            }
        },
        {
            "zone": "HARDWARE",
            "properties": {
                "color": "#FCD34D",  # Gold
                "finish": "brushed",
            }
        },
    ]

    apply_webhook_updates(example_updates)

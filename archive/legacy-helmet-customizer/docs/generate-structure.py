#!/usr/bin/env python3
"""
Documentation Structure Generator
Automatically scans docs/ folder and generates navigation structure
"""

import os
import json
from pathlib import Path

def scan_docs_structure(docs_dir):
    """Scan docs directory and generate navigation structure"""
    structure = {}

    # Get all subdirectories
    for item in sorted(os.listdir(docs_dir)):
        item_path = os.path.join(docs_dir, item)

        # Skip files and special directories
        if not os.path.isdir(item_path) or item.startswith('.') or item == 'assets':
            continue

        # Convert folder name to category title
        category = item.replace('-', ' ').replace('_', ' ').title()

        # Special case renames
        category_map = {
            'Api Reference': 'API Reference',
            'Tests': 'Testing',
            'Analysis': 'Analysis & Research',
            'Guides': 'Implementation Guides'
        }
        category = category_map.get(category, category)

        # Find all markdown files in this category
        docs = []
        for file in sorted(os.listdir(item_path)):
            if file.endswith('.md'):
                # Generate display name from filename
                name = file.replace('.md', '').replace('_', ' ').replace('-', ' ')

                # Determine badge
                badge = None
                if item == 'analysis':
                    badge = 'archive'

                docs.append({
                    'name': name,
                    'file': f'{item}/{file}',
                    'badge': badge
                })

        if docs:
            structure[category] = docs

    # Add README at the top under "Getting Started"
    readme_path = os.path.join(os.path.dirname(docs_dir), 'README.md')
    if os.path.exists(readme_path):
        if 'Getting Started' not in structure:
            structure = {'Getting Started': [], **structure}
        else:
            structure['Getting Started'].insert(0, {
                'name': 'README',
                'file': '../README.md',
                'badge': None
            })

    return structure

def main():
    # Get docs directory
    script_dir = Path(__file__).parent
    docs_dir = script_dir

    print("🔍 Scanning documentation structure...")
    structure = scan_docs_structure(docs_dir)

    # Write to structure.json
    output_file = docs_dir / 'structure.json'
    with open(output_file, 'w') as f:
        json.dump(structure, f, indent=2)

    # Print summary
    total_docs = sum(len(docs) for docs in structure.values())
    print(f"✅ Generated structure.json")
    print(f"📚 Found {len(structure)} categories")
    print(f"📄 Found {total_docs} documents")
    print()
    print("Categories:")
    for category, docs in structure.items():
        print(f"  • {category} ({len(docs)} docs)")

if __name__ == '__main__':
    main()

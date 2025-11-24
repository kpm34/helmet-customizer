# Documentation Quick Reference

## Starting the Doc Viewer

```bash
cd docs
./start-docs.sh
```

Then open: http://localhost:8080

## Adding New Documentation

### 1. Create your markdown file
```bash
# Example: Adding a new guide
cd docs/guides
nano MY_NEW_GUIDE.md
```

### 2. The viewer auto-updates!
Just click the **"Refresh"** button in the doc viewer, or restart the server:
```bash
./start-docs.sh
```

The structure is automatically scanned and updated!

## Folder Structure

- **`guides/`** - Implementation and setup guides
- **`architecture/`** - System design documents
- **`api-reference/`** - API documentation
- **`tests/`** - Test procedures and results
- **`analysis/`** - Historical analysis (archived)
- **`assets/`** - Screenshots, diagrams, images

## Manual Structure Regeneration

If you need to manually update the navigation:
```bash
python3 generate-structure.py
```

This scans all folders and generates `structure.json`.

## File Naming Conventions

- Use **UPPERCASE_WITH_UNDERSCORES.md** for docs
- Use descriptive names: `MATERIAL_SYSTEM_GUIDE.md`
- Files are auto-converted to readable names in navigation

Examples:
- `SETUP_GUIDE.md` → "Setup Guide"
- `API_REFERENCE.md` → "Api Reference"
- `MY_NEW_FEATURE.md` → "My New Feature"

## Tips

- **Search**: Use the search box to filter docs
- **Categories**: Click category titles to collapse/expand
- **Archive badge**: Analysis docs are marked as "archive"
- **Refresh**: Click "Refresh" button after adding docs
- **No manual editing**: Don't edit `index.html` or `structure.json` manually!
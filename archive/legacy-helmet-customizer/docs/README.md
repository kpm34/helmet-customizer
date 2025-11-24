# Helmet Customizer Documentation

This folder contains all project-specific documentation for the Helmet Customizer application.

## How to Use

### Browse Documentation

**Option 1: Using the helper script (recommended)**
```bash
cd docs
./start-docs.sh
```
Then open: http://localhost:8080

**Option 2: Manual server**
```bash
cd docs
python3 -m http.server 8080
```
Then open: http://localhost:8080

**Note:** Opening `index.html` directly won't work due to browser security restrictions. You need to serve it via HTTP.

This provides a clean interface to navigate all documentation with:
- Categorized navigation
- Markdown rendering
- Search functionality
- Quick access to all docs

### Folder Structure

```
docs/
├── index.html                    # Local documentation viewer
├── guides/                       # Setup, deployment, implementation guides
├── architecture/                 # System design and architecture docs
├── api-reference/                # API documentation (Spline, Blender)
├── analysis/                     # Historical research and analysis (archived)
├── tests/                        # Testing procedures and results
└── assets/                       # Screenshots, diagrams, images
```

## Documentation Categories

### 📘 Getting Started
- **README** - Main project overview
- **Setup Guide** - Development environment setup
- **Deployment Guide** - Production deployment instructions

### 🏗️ Architecture
- **Finish System** - Material finish architecture
- **Material Preview System** - Preview generation system
- **Materials & Colors Reference** - Color palettes and material definitions

### 📚 API Reference
- **Spline Runtime API** - Spline integration documentation
- **Spline Scene Hierarchy** - Scene structure reference
- **Blender MCP Guide** - Blender automation integration

### 🧪 Testing
- **Quick Test Integration** - Quick testing procedures
- **Production Tests** - Production testing checklist

### 🔍 Analysis & Research (Archived)
Historical analysis documents from development:
- Material Editing Analysis
- Material Verdict
- Spline Scene Analysis

These are kept for reference but represent decisions already made.

### 📖 Implementation Guides
- **Finish Integration Example** - Code examples for finish system
- **Finish Implementation Strategy** - Implementation approach
- **Spline Finish Setup** - Spline configuration guide

## Naming Conventions

### Document Files
- Use SCREAMING_SNAKE_CASE for document names: `SETUP_GUIDE.md`
- Use descriptive names that indicate content: `FINISH_ARCHITECTURE.md`
- Version numbers when needed: `DEPLOYMENT_v2.md` → `DEPLOYMENT.md` (keep latest)

### Test Results
Store test results in `docs/tests/results/` with format:
- `YYYY-MM-DD_test-name_result.md`
- Example: `2024-11-20_material-swap_SUCCESS.md`

### Screenshots & Assets
Store in `docs/assets/` with format:
- `category/descriptive-name.png`
- Example: `architecture/finish-system-diagram.png`

## Maintenance

### Adding New Documentation (Auto-Updates!)

**The viewer now auto-discovers documentation!**

1. **Create markdown file** in appropriate category folder:
   ```bash
   cd docs/guides
   nano MY_NEW_GUIDE.md
   ```

2. **Click "Refresh"** in the viewer (or restart server):
   ```bash
   ./start-docs.sh
   ```

3. **Done!** Your new doc appears automatically in navigation.

**How it works:**
- `generate-structure.py` scans docs folders
- Creates `structure.json` with current structure
- Viewer loads structure dynamically
- No manual editing of `index.html` needed!

### Archiving Old Documentation
Move outdated docs to `analysis/` folder and mark with 'archive' badge in viewer.

### Test Results
Store test results in `docs/tests/results/` with timestamp and outcome.

## Integration with Global Docs

**Project-Level (this folder):**
- Helmet Customizer specific documentation
- Implementation guides
- Test results
- API references for this project

**Workspace-Level** (`/Users/kashyapmaheshwari/Blender-Workspace/`):
- Global Blender automation utilities
- Shared 3D libraries
- Cross-project tools

Keep project docs here, not in parent workspace!
# Helmet Pattern Overlays

This directory contains pattern overlay textures for the helmet customizer.

## Current Patterns

### Generated Patterns (Ready ✅)
- **stripe_single.png** - Single vertical stripe down the middle (15% width)
- **stripe_double.png** - Double vertical stripes with gap in middle
- **camo.png** - Camouflage pattern overlay

### Professional Overlays (TODO 🚧)
Add these professional SVG/PNG pattern files:
- **tiger.png** - Tiger stripe pattern
- **leopard.png** - Leopard spot pattern
- **ram.png** - Ram horns pattern
- **wolverine.png** - Wolverine claws/stripes pattern

## Specifications

- **Resolution**: 2048x2048 pixels recommended
- **Format**: PNG with alpha transparency
- **Color**: White (#FFFFFF) pattern on transparent background
- **Tinting**: Patterns will be tinted with helmet base colors at runtime

## Thumbnails

256x256 pixel thumbnails are automatically generated in `/thumbnails/` for UI display.

## Usage in App

Patterns are loaded in the React Three Fiber app and applied to the helmet shell mesh using Three.js texture mapping.

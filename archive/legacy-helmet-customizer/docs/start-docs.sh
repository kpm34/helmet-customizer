#!/bin/bash
# Documentation Server Launcher
# Auto-generates structure and starts local HTTP server

PORT=8080
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "📚 Helmet Customizer Documentation"
echo "===================================="
echo ""

# Generate structure from current docs
echo "🔄 Scanning documentation structure..."
cd "$DIR" && python3 generate-structure.py
echo ""

# Start server
echo "🚀 Starting documentation server..."
echo "📖 Docs available at: http://localhost:$PORT"
echo ""
echo "💡 Tip: Press Ctrl+C to stop the server"
echo "💡 Tip: Click 'Refresh' button to reload after adding new docs"
echo ""

python3 -m http.server $PORT

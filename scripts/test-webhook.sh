#!/bin/bash

# Test Webhook Integration for Helmet Customizer
# Usage: ./scripts/test-webhook.sh

echo "🧪 Testing Helmet Material Webhook API"
echo "======================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API endpoint
API_URL="http://localhost:3000/api/webhook/material"

echo "📍 API Endpoint: $API_URL"
echo ""

# Test 1: GET current state
echo "${YELLOW}Test 1: GET current material state${NC}"
echo "-----------------------------------"
curl -s -X GET "$API_URL" | jq '.'
echo ""
echo ""

# Test 2: Simple color update
echo "${YELLOW}Test 2: Update SHELL color to red${NC}"
echo "-------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "zone": "SHELL",
        "properties": {
          "color": "#FF0000"
        }
      }
    ]
  }' | jq '.'
echo ""
echo ""

# Test 3: Apply finish preset
echo "${YELLOW}Test 3: Apply chrome finish to FACEMASK${NC}"
echo "-------------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "zone": "FACEMASK",
        "properties": {
          "finish": "chrome"
        }
      }
    ]
  }' | jq '.'
echo ""
echo ""

# Test 4: Batch update
echo "${YELLOW}Test 4: Batch update all zones${NC}"
echo "-------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "zone": "SHELL",
        "properties": {
          "color": "#1E3A8A",
          "finish": "glossy",
          "clearcoat": 0.9,
          "clearcoatRoughness": 0.1
        }
      },
      {
        "zone": "FACEMASK",
        "properties": {
          "color": "#C0C0C0",
          "finish": "chrome"
        }
      },
      {
        "zone": "CHINSTRAP",
        "properties": {
          "color": "#1F2937",
          "finish": "matte"
        }
      },
      {
        "zone": "INTERIOR_PADDING",
        "properties": {
          "color": "#F3F4F6",
          "finish": "matte"
        }
      },
      {
        "zone": "HARDWARE",
        "properties": {
          "color": "#FCD34D",
          "finish": "brushed"
        }
      }
    ],
    "source": "test-script"
  }' | jq '.'
echo ""
echo ""

# Test 5: Advanced material properties
echo "${YELLOW}Test 5: Advanced material with emissive glow${NC}"
echo "----------------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "zone": "SHELL",
        "properties": {
          "color": "#0066FF",
          "metallic": 0.95,
          "roughness": 0.15,
          "clearcoat": 1.0,
          "clearcoatRoughness": 0.05,
          "emissive": "#0066FF",
          "emissiveIntensity": 0.3
        }
      }
    ]
  }' | jq '.'
echo ""
echo ""

# Test 6: Validation error (invalid zone)
echo "${YELLOW}Test 6: Validation error (invalid zone)${NC}"
echo "-------------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "zone": "INVALID_ZONE",
        "properties": {
          "color": "#FF0000"
        }
      }
    ]
  }' | jq '.'
echo ""
echo ""

# Test 7: Validation error (invalid color)
echo "${YELLOW}Test 7: Validation error (invalid color)${NC}"
echo "--------------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "zone": "SHELL",
        "properties": {
          "color": "red"
        }
      }
    ]
  }' | jq '.'
echo ""
echo ""

# Test 8: Validation error (out of range)
echo "${YELLOW}Test 8: Validation error (metalness out of range)${NC}"
echo "---------------------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "zone": "SHELL",
        "properties": {
          "metallic": 2.5
        }
      }
    ]
  }' | jq '.'
echo ""
echo ""

echo "${GREEN}✅ All webhook tests completed!${NC}"
echo ""
echo "📝 Notes:"
echo "  - Make sure Next.js dev server is running: npm run dev"
echo "  - Requires 'jq' for JSON formatting (brew install jq)"
echo "  - Check browser console for Spline updates"
echo ""

#!/bin/bash
# Auto-deploy script with cache-busting version bump

set -e

echo "🚀 Deploying Helmet Customizer..."

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Increment patch version
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR="${VERSION_PARTS[0]}"
MINOR="${VERSION_PARTS[1]}"
PATCH="${VERSION_PARTS[2]}"
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"

echo "New version: $NEW_VERSION"

# Update package.json
npm version $NEW_VERSION --no-git-tag-version

# Update .env.local
echo "# Cache-busting version for Spline scene" > .env.local
echo "# Update this whenever you deploy a new Spline scene to force browser to reload" >> .env.local
echo "NEXT_PUBLIC_APP_VERSION=$NEW_VERSION" >> .env.local

# Commit version bump
git add package.json .env.local
git commit -m "chore: bump version to $NEW_VERSION for cache-busting"
git push

# Deploy to Vercel with environment variable
echo "Deploying to Vercel..."
vercel --prod --env NEXT_PUBLIC_APP_VERSION=$NEW_VERSION

echo "✅ Deployment complete!"
echo "Version: $NEW_VERSION"

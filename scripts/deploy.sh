#!/bin/bash

# Deployment script that injects Git commit hash into both frontend and backend

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Get Git commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)
echo "📦 Build version: $COMMIT_HASH"

# Build frontend with version
echo "🔨 Building frontend..."
npm run build

# Create/update .env file for backend with version
echo "⚙️  Setting backend version..."
echo "APP_BUILD_VERSION=$COMMIT_HASH" > server-example/.env
echo "PORT=3000" >> server-example/.env

echo "✅ Deployment preparation complete!"
echo "Frontend version: $COMMIT_HASH"
echo "Backend version: $COMMIT_HASH"
echo ""
echo "Next steps:"
echo "1. Deploy the 'dist' folder to your frontend hosting"
echo "2. Deploy the backend with the updated .env file"
echo "3. Ensure APP_BUILD_VERSION=$COMMIT_HASH is set in production"

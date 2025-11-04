#!/bin/bash

# PDF Redline Viewer - Quick Setup Script
# This script helps you quickly set up the development environment

echo "🚀 PDF Redline Viewer Setup"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "⚙️  Setup Instructions:"
echo "====================="
echo ""
echo "1. Get your Adobe Client ID:"
echo "   - Go to https://developer.adobe.com/console"
echo "   - Create a new project"
echo "   - Add 'PDF Embed API'"
echo "   - Copy your Client ID"
echo ""
echo "2. Add Client ID to .env.local:"
echo "   - Edit .env.local file"
echo "   - Set: NEXT_PUBLIC_ADOBE_CLIENT_ID=your_client_id_here"
echo ""
echo "3. Start development server:"
echo "   npm run dev"
echo ""
echo "4. Open browser:"
echo "   http://localhost:3000"
echo ""

# Check if .env.local exists and has CLIENT_ID
if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_ADOBE_CLIENT_ID=YOUR_CLIENT_ID_HERE" .env.local; then
        echo "⚠️  .env.local found but CLIENT_ID not set!"
        echo "Please update: NEXT_PUBLIC_ADOBE_CLIENT_ID=your_actual_id"
    elif grep -q "NEXT_PUBLIC_ADOBE_CLIENT_ID=" .env.local; then
        echo "✅ .env.local configured"
    fi
else
    echo "⚠️  .env.local not found. Creating template..."
    cat > .env.local << 'EOF'
# Adobe PDF Embed API Client ID
# Get your Client ID from: https://developer.adobe.com/console
NEXT_PUBLIC_ADOBE_CLIENT_ID=YOUR_CLIENT_ID_HERE
EOF
    echo "   Created .env.local - please add your Client ID"
fi

echo ""
echo "📚 Documentation:"
echo "   - README_SETUP.md - Features and architecture"
echo "   - DEPLOYMENT_GUIDE.md - Deployment and troubleshooting"
echo ""
echo "✨ Setup complete! Ready to run: npm run dev"

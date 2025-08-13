#!/bin/bash

# Task Manager Deployment Setup Script
# This script helps prepare your application for deployment

echo "🚀 Task Manager Deployment Setup"
echo "================================"

# Check if git repository exists
if [ ! -d ".git" ]; then
    echo "❌ Error: This directory is not a git repository"
    echo "Please run: git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

# Check if all required files exist
echo "📋 Checking required files..."

required_files=(
    "server/package.json"
    "client/package.json"
    "render.yaml"
    "client/vercel.json"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        exit 1
    fi
done

echo ""
echo "✅ All required files are present!"
echo ""

# Check if dependencies are installed
echo "📦 Checking dependencies..."

if [ ! -d "server/node_modules" ]; then
    echo "⚠️  Server dependencies not installed. Run: cd server && npm install"
fi

if [ ! -d "client/node_modules" ]; then
    echo "⚠️  Client dependencies not installed. Run: cd client && npm install"
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. Backend Deployment (Render):"
echo "   - Push your code to GitHub"
echo "   - Go to render.com and create a new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set environment variables (see DEPLOYMENT.md)"
echo "   - Deploy and note your backend URL"
echo ""
echo "2. Frontend Deployment (Vercel):"
echo "   - Go to vercel.com and create a new project"
echo "   - Import your GitHub repository"
echo "   - Set Root Directory to 'client'"
echo "   - Set REACT_APP_API_URL to your backend URL"
echo "   - Deploy and note your frontend URL"
echo ""
echo "3. Update Backend CORS:"
echo "   - Update CLIENT_URL in Render with your Vercel frontend URL"
echo "   - Redeploy backend service"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🔗 Useful Links:"
echo "   - Render: https://render.com"
echo "   - Vercel: https://vercel.com"
echo "   - MongoDB Atlas: https://www.mongodb.com/atlas"
echo "" 
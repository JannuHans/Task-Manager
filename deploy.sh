#!/bin/bash

# Task Manager Deployment Script for Render
# This script helps prepare your application for deployment

echo "🚀 Preparing Task Manager for Render deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the root directory of the project"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build the client
echo "🔨 Building client..."
cd client && npm run build && cd ..

# Check if build was successful
if [ ! -d "client/build" ]; then
    echo "❌ Error: Client build failed"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check for required files
echo "🔍 Checking deployment files..."

required_files=("render.yaml" "server/package.json" "client/package.json" "server/server.js")

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: Required file $file is missing"
        exit 1
    fi
done

echo "✅ All required files are present!"

# Display deployment instructions
echo ""
echo "🎯 Deployment Instructions:"
echo "=========================="
echo ""
echo "1. Push your code to a Git repository (GitHub, GitLab, etc.)"
echo ""
echo "2. Go to https://render.com and create an account"
echo ""
echo "3. Connect your repository to Render"
echo ""
echo "4. Render will automatically detect the render.yaml file and create two services:"
echo "   - task-manager-api (Backend API)"
echo "   - task-manager-client (Frontend)"
echo ""
echo "5. Configure the following environment variables in Render dashboard:"
echo ""
echo "   For the API service:"
echo "   - MONGODB_URI: Your MongoDB connection string"
echo "   - JWT_SECRET: A strong secret key for JWT tokens"
echo "   - AWS_ACCESS_KEY_ID: Your AWS access key (if using S3)"
echo "   - AWS_SECRET_ACCESS_KEY: Your AWS secret key (if using S3)"
echo "   - AWS_REGION: Your AWS region (e.g., us-east-1)"
echo "   - AWS_BUCKET_NAME: Your S3 bucket name (if using S3)"
echo ""
echo "6. The client service will automatically get the REACT_APP_API_URL variable"
echo ""
echo "7. Deploy and test your application!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🔗 Useful links:"
echo "   - Render Documentation: https://render.com/docs"
echo "   - MongoDB Atlas: https://www.mongodb.com/atlas"
echo "   - AWS S3: https://aws.amazon.com/s3/"
echo ""

echo "🎉 Deployment preparation completed!" 
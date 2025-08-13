# Task Manager Deployment Guide

This guide will help you deploy your Task Manager application with the backend on Render and frontend on Vercel.

## Prerequisites

- GitHub account with your code repository
- Render account (free tier available)
- Vercel account (free tier available)
- MongoDB Atlas account (for database)
- AWS account (if using S3 for file uploads)

## Part 1: Backend Deployment on Render

### Step 1: Prepare Your Repository
1. Ensure your code is pushed to GitHub
2. Make sure your `render.yaml` file is in the root directory
3. Verify your server dependencies are properly listed in `server/package.json`

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Configure the following environment variables in Render dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong secret key for JWT tokens
   - `CLIENT_URL`: Your Vercel frontend URL (will be set after frontend deployment)
   - `AWS_ACCESS_KEY_ID`: Your AWS access key (if using S3)
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key (if using S3)
   - `AWS_REGION`: Your AWS region (if using S3)
   - `AWS_BUCKET_NAME`: Your S3 bucket name (if using S3)

### Step 3: Deploy
1. Click "Create Web Service"
2. Render will build and deploy your backend
3. Note down your backend URL (e.g., `https://task-manager-api.onrender.com`)

## Part 2: Frontend Deployment on Vercel

### Step 1: Prepare Your Repository
1. Ensure your `vercel.json` file is in the `client` directory
2. Verify your frontend dependencies are properly listed in `client/package.json`

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### Step 3: Set Environment Variables
1. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Add the following environment variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://task-manager-api.onrender.com/api` (your Render backend URL)
   - **Environment**: Production, Preview, Development

### Step 4: Deploy
1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Note down your frontend URL (e.g., `https://your-project.vercel.app`)

## Part 3: Update Backend Configuration

### Step 1: Update CORS Settings
After getting your Vercel frontend URL, update the `CLIENT_URL` environment variable in Render:
1. Go to your Render service dashboard
2. Navigate to "Environment" tab
3. Update `CLIENT_URL` with your Vercel frontend URL
4. Redeploy the service

### Step 2: Verify Backend CORS
Ensure your backend allows requests from your Vercel domain. Check your `server/server.js` file for CORS configuration.

## Part 4: Testing and Verification

### Step 1: Test Backend
1. Visit your Render backend URL + `/api/health` (if you have a health endpoint)
2. Test API endpoints using Postman or similar tool
3. Verify database connections

### Step 2: Test Frontend
1. Visit your Vercel frontend URL
2. Test user registration/login
3. Test task creation and management
4. Verify API calls are working

### Step 3: Test Integration
1. Ensure frontend can communicate with backend
2. Test file uploads (if applicable)
3. Verify authentication flow

## Troubleshooting

### Common Issues

#### Backend Issues
- **Build Failures**: Check `server/package.json` for missing dependencies
- **Environment Variables**: Ensure all required env vars are set in Render
- **Database Connection**: Verify MongoDB URI and network access

#### Frontend Issues
- **Build Failures**: Check `client/package.json` and build logs
- **API Connection**: Verify `REACT_APP_API_URL` is set correctly
- **CORS Errors**: Ensure backend allows requests from Vercel domain

#### General Issues
- **Environment Variables**: Remember to redeploy after changing env vars
- **Domain Issues**: Check if your custom domains are properly configured

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-frontend.vercel.app
AWS_ACCESS_KEY_ID=your_aws_key (if using S3)
AWS_SECRET_ACCESS_KEY=your_aws_secret (if using S3)
AWS_REGION=your_aws_region (if using S3)
AWS_BUCKET_NAME=your_s3_bucket (if using S3)
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

## Final Notes

- Both Render and Vercel offer free tiers suitable for development and small applications
- Monitor your usage to stay within free tier limits
- Set up automatic deployments by connecting your GitHub repository
- Consider setting up custom domains for production use
- Regularly update dependencies and monitor security

## Support

- Render Documentation: [docs.render.com](https://docs.render.com)
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com) 
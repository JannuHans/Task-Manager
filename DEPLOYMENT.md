# Task Manager Deployment Guide - Render

This guide will help you deploy the Task Manager application on Render.

## Prerequisites

1. **MongoDB Database**: You'll need a MongoDB database. You can use:
   - [MongoDB Atlas](https://www.mongodb.com/atlas) (Recommended)
   - [Render's MongoDB service](https://render.com/docs/databases)

2. **AWS S3 Bucket** (Optional): For file uploads, you'll need an S3 bucket with appropriate permissions.

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, etc.).

### 2. Deploy on Render

#### Option A: Using render.yaml (Recommended)

1. Connect your repository to Render
2. Render will automatically detect the `render.yaml` file
3. Configure the following environment variables in Render dashboard:

**For the API Service (`task-manager-api`):**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong secret key for JWT tokens
- `AWS_ACCESS_KEY_ID`: Your AWS access key (if using S3)
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key (if using S3)
- `AWS_REGION`: Your AWS region (e.g., us-east-1)
- `AWS_BUCKET_NAME`: Your S3 bucket name (if using S3)

**For the Client Service (`task-manager-client`):**
- `REACT_APP_API_URL`: Will be automatically set to your API URL

#### Option B: Manual Deployment

1. **Deploy Backend API:**
   - Create a new Web Service on Render
   - Connect your repository
   - Set the following:
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Environment**: Node
   - Add the environment variables listed above

2. **Deploy Frontend:**
   - Create a new Static Site on Render
   - Connect your repository
   - Set the following:
     - **Build Command**: `cd client && npm install && npm run build`
     - **Publish Directory**: `client/build`
   - Add `REACT_APP_API_URL` environment variable pointing to your API URL

### 3. Environment Variables Setup

Create a `.env` file in the server directory with the following variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=https://your-client-url.onrender.com
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
```

### 4. Database Setup

1. Create a MongoDB database
2. The application will automatically create the necessary collections on first run
3. Make sure your MongoDB connection string is properly formatted

### 5. Testing Your Deployment

1. **API Health Check**: Visit `https://your-api-url.onrender.com/health`
2. **Frontend**: Visit your client URL to test the application
3. **Test Features**: Try creating an account and managing tasks

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are properly listed in package.json
   - Ensure Node.js version compatibility (>=16.0.0)

2. **Database Connection Issues**:
   - Verify your MongoDB connection string
   - Check if your MongoDB instance allows connections from Render's IP ranges

3. **CORS Issues**:
   - Ensure `CLIENT_URL` environment variable is set correctly
   - Check that the client URL matches your actual frontend URL

4. **File Upload Issues**:
   - Verify AWS S3 credentials and bucket permissions
   - Check that the S3 bucket exists and is accessible

### Logs and Debugging

- Check Render logs in the dashboard for both services
- Monitor the `/health` endpoint for API status
- Use browser developer tools to check for frontend errors

## Security Considerations

1. **Environment Variables**: Never commit sensitive information to your repository
2. **JWT Secret**: Use a strong, random string for JWT_SECRET
3. **Database**: Use connection strings with authentication
4. **CORS**: Ensure CORS is properly configured for production

## Performance Optimization

1. **Database Indexing**: Consider adding indexes to frequently queried fields
2. **Caching**: Implement Redis caching for better performance
3. **CDN**: Use a CDN for static assets
4. **Compression**: Enable gzip compression on your server

## Monitoring

1. Set up monitoring for your API endpoints
2. Monitor database performance
3. Set up alerts for downtime
4. Track application metrics

## Support

If you encounter issues:
1. Check Render's documentation
2. Review application logs
3. Test locally to isolate issues
4. Contact Render support if needed 
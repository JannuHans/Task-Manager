# Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] Code is pushed to GitHub
- [ ] All dependencies are installed (`npm install` in both client and server)
- [ ] Application runs locally without errors
- [ ] Environment variables are documented
- [ ] Database connection is working
- [ ] File uploads work (if applicable)

## 🚀 Backend Deployment (Render)

- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Set environment variables:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `CLIENT_URL` (will be updated after frontend deployment)
  - [ ] AWS credentials (if using S3)
- [ ] Deploy service
- [ ] Note backend URL
- [ ] Test backend endpoints

## 🌐 Frontend Deployment (Vercel)

- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set project configuration:
  - [ ] Framework: Create React App
  - [ ] Root Directory: `client`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `build`
- [ ] Set environment variable:
  - [ ] `REACT_APP_API_URL` = your backend URL + `/api`
- [ ] Deploy project
- [ ] Note frontend URL
- [ ] Test frontend functionality

## 🔗 Post-Deployment Configuration

- [ ] Update `CLIENT_URL` in Render with Vercel frontend URL
- [ ] Redeploy backend service
- [ ] Test full application integration
- [ ] Verify authentication flow
- [ ] Test file uploads (if applicable)
- [ ] Check CORS configuration

## 🧪 Testing Checklist

- [ ] Backend API endpoints respond correctly
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Task creation works
- [ ] Task management works
- [ ] File uploads work (if applicable)
- [ ] No CORS errors in browser console

## 📝 Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLIENT_URL=https://your-frontend.vercel.app
AWS_ACCESS_KEY_ID=your-key (if using S3)
AWS_SECRET_ACCESS_KEY=your-secret (if using S3)
AWS_REGION=us-east-1 (if using S3)
AWS_BUCKET_NAME=your-bucket (if using S3)
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

## 🔧 Troubleshooting

- [ ] Check Render logs for backend issues
- [ ] Check Vercel build logs for frontend issues
- [ ] Verify environment variables are set correctly
- [ ] Test database connectivity
- [ ] Check CORS configuration
- [ ] Verify API endpoints are accessible

## 📚 Documentation

- [ ] Update README.md with deployment URLs
- [ ] Document environment variable requirements
- [ ] Add deployment instructions for team members
- [ ] Document troubleshooting steps 
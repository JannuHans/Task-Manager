@echo off
chcp 65001 >nul
echo 🚀 Task Manager Deployment Setup
echo ================================
echo.

REM Check if git repository exists
if not exist ".git" (
    echo ❌ Error: This directory is not a git repository
    echo Please run: git init ^&^& git add . ^&^& git commit -m "Initial commit"
    pause
    exit /b 1
)

REM Check if all required files exist
echo 📋 Checking required files...
echo.

set "required_files=server\package.json client\package.json render.yaml client\vercel.json"
set "all_files_exist=true"

for %%f in (%required_files%) do (
    if exist "%%f" (
        echo ✅ %%f
    ) else (
        echo ❌ Missing: %%f
        set "all_files_exist=false"
    )
)

if "%all_files_exist%"=="false" (
    echo.
    echo ❌ Some required files are missing!
    pause
    exit /b 1
)

echo.
echo ✅ All required files are present!
echo.

REM Check if dependencies are installed
echo 📦 Checking dependencies...
echo.

if not exist "server\node_modules" (
    echo ⚠️  Server dependencies not installed. Run: cd server ^&^& npm install
)

if not exist "client\node_modules" (
    echo ⚠️  Client dependencies not installed. Run: cd client ^&^& npm install
)

echo.
echo 🎯 Next Steps:
echo ==============
echo.
echo 1. Backend Deployment (Render):
echo    - Push your code to GitHub
echo    - Go to render.com and create a new Web Service
echo    - Connect your GitHub repository
echo    - Set environment variables (see DEPLOYMENT.md)
echo    - Deploy and note your backend URL
echo.
echo 2. Frontend Deployment (Vercel):
echo    - Go to vercel.com and create a new project
echo    - Import your GitHub repository
echo    - Set Root Directory to 'client'
echo    - Set REACT_APP_API_URL to your backend URL
echo    - Deploy and note your frontend URL
echo.
echo 3. Update Backend CORS:
echo    - Update CLIENT_URL in Render with your Vercel frontend URL
echo    - Redeploy backend service
echo.
echo 📚 For detailed instructions, see DEPLOYMENT.md
echo.
echo 🔗 Useful Links:
echo    - Render: https://render.com
echo    - Vercel: https://vercel.com
echo    - MongoDB Atlas: https://www.mongodb.com/atlas
echo.
pause 
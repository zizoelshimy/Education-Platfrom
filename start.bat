@echo off
cls
echo 🚀 Starting Education Platform...
echo ═══════════════════════════════════════
echo.

:: Check if .env exists
if not exist ".env" (
    echo ❌ .env file not found!
    echo 💡 Please copy .env.example to .env and configure it.
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

:: Start the application
echo 🎯 Starting the application...
echo.
npm run start:dev

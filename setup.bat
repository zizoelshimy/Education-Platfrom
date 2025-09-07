@echo off
echo  Setting up Education Platform...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo  Node.js version: 
node --version

:: Install dependencies
echo  Installing dependencies...
npm install

:: Copy environment file
if not exist ".env" (
    echo  Creating environment file...
    copy .env.example .env
    echo  Please edit .env file with your configuration
) else (
    echo   .env file already exists
)

:: Create uploads directory
if not exist "uploads" mkdir uploads

echo  Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your configuration
echo 2. Start MongoDB: docker run -d -p 27017:27017 --name mongodb mongo:latest
echo 3. Run the application: npm run start:dev
echo 4. Visit API docs: http://localhost:3000/docs
echo.
echo Happy coding! 
pause

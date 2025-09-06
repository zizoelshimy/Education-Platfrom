@echo off
echo 📋 Education Platform Log Viewer
echo =================================
echo.

:: Check if logs directory exists
if not exist "logs" (
    echo ❌ No logs directory found.
    echo 💡 Start the application first to generate logs.
    pause
    exit /b 1
)

echo 📁 Available log files:
dir logs

echo.
echo 🔍 Recent Health Check Results:
echo -------------------------------

if exist "logs\health-check.log" (
    powershell "Get-Content 'logs\health-check.log' | Select-Object -Last 50"
) else (
    echo ❌ No health check logs found yet.
)

echo.
echo 🚨 Recent Errors (if any):
echo ---------------------------

if exist "logs\error.log" (
    powershell "Get-Content 'logs\error.log' | Select-Object -Last 20"
) else (
    echo ✅ No errors logged yet.
)

echo.
pause

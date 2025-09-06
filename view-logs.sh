#!/bin/bash

echo "📋 Education Platform Log Viewer"
echo "================================="
echo ""

# Check if logs directory exists
if [ ! -d "logs" ]; then
    echo "❌ No logs directory found."
    echo "💡 Start the application first to generate logs."
    exit 1
fi

echo "📁 Available log files:"
ls -la logs/

echo ""
echo "🔍 Recent Health Check Results:"
echo "-------------------------------"

if [ -f "logs/health-check.log" ]; then
    tail -50 logs/health-check.log
else
    echo "❌ No health check logs found yet."
fi

echo ""
echo "🚨 Recent Errors (if any):"
echo "---------------------------"

if [ -f "logs/error.log" ]; then
    tail -20 logs/error.log
else
    echo "✅ No errors logged yet."
fi

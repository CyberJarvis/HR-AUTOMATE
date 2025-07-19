#!/bin/bash
echo "==========================================="
echo "   HR Management System - Startup Script   "
echo "==========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is available"

# Check if MySQL is running (optional check)
echo "🔧 Starting HR Management System..."

# Kill any existing processes on port 3001
echo "🔍 Checking for existing processes on port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

echo "🚀 Starting server on port 3001..."
echo ""
echo "🌐 Access the application at: http://localhost:3001"
echo ""
echo "📋 Demo Credentials:"
echo "   Employee: john.doe@company.com / password123"
echo "   HR:       alice.johnson@company.com / password123"
echo ""
echo "ℹ️  Press Ctrl+C to stop the server"
echo ""

# Start the server
PORT=3001 npm start

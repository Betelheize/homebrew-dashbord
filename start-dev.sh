#!/bin/bash

echo "🚀 Starting Homebrew Dashboard..."

# Start server in background
echo "📡 Starting server on port 3001..."
./node_modules/.bin/nodemon server/index.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Start client in background
echo "🖥️  Starting client on port 3000..."
cd client && ./node_modules/.bin/react-scripts start &
CLIENT_PID=$!

# Wait for both processes
echo "✅ Both services started!"
echo "📊 Dashboard available at http://localhost:3000"
echo "🔌 API available at http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait 
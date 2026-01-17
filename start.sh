#!/bin/bash

# Tako Research Canvas - Local Development Startup Script

echo "🚀 Starting Tako Research Canvas..."
echo ""

# Check if .env files exist
if [ ! -f "agents/.env" ]; then
    echo "⚠️  Warning: agents/.env not found"
    echo "   Copying from .env.example..."
    cp agents/.env.example agents/.env
    echo "   Please edit agents/.env with your API keys"
    echo ""
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Warning: frontend/.env not found"
    echo "   Copying from .env.example..."
    cp frontend/.env.example frontend/.env
    echo ""
fi

# Check if node_modules exist
if [ ! -d "agents/node_modules" ]; then
    echo "📦 Installing agent dependencies..."
    cd agents && npm install --legacy-peer-deps && cd ..
    echo ""
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    echo ""
fi

# Kill any existing processes on ports 8000 and 5173
echo "🧹 Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null
sleep 1

# Start both servers
echo "🎬 Starting servers..."
echo ""
echo "   Agent Server:  http://localhost:8000"
echo "   Frontend:      http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start agent server in background
cd agents
npm run dev > ../agent.log 2>&1 &
AGENT_PID=$!
cd ..

# Wait for agent server to start
sleep 3

# Start frontend server in background
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait a bit for frontend to start
sleep 2

# Display status
echo "✅ Servers started!"
echo ""
echo "   Agent Server PID:   $AGENT_PID"
echo "   Frontend PID:       $FRONTEND_PID"
echo ""
echo "   Agent logs:    tail -f agent.log"
echo "   Frontend logs: tail -f frontend.log"
echo ""
echo "🌐 Open your browser to: http://localhost:5173"
echo ""

# Keep script running and handle Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $AGENT_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

# Wait for both processes
wait $AGENT_PID $FRONTEND_PID

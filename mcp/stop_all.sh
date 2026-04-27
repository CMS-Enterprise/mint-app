#!/bin/bash

# Stop all MCP server instances (both Docker and host-based)
# Run this from the mint-app/mcp directory

set -e

echo "🛑 Stopping all MCP Server instances..."
echo ""

# Stop Docker containers
echo "Stopping Docker containers..."
docker compose down 2>/dev/null || echo "No Docker containers running"

# Kill any host-based MCP server on port 5554
echo "Killing any processes on port 5554..."
lsof -ti:5554 | xargs kill -9 2>/dev/null || echo "No processes found on port 5554"

echo ""
echo "✅ All MCP Server instances stopped"
echo ""
echo "You can now start the server with:"
echo "  - ./start.sh              (run on host, for development)"
echo "  - ./start_openwebui.sh    (run in Docker, for Open WebUI)"

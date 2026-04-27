#!/bin/bash

# Start MINT MCP Server in Docker (without Open WebUI)
# Run this from the mint-app/mcp directory
# Use this if you want the server in Docker but don't need Open WebUI

set -e

echo "🚀 Starting MINT MCP Server in Docker..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Using defaults from .env.example"
fi

# Stop any existing instances
echo "Stopping any existing MCP server instances..."
lsof -ti:5554 | xargs kill -9 2>/dev/null || true
docker compose down 2>/dev/null || true

# Start only the MCP server (not Open WebUI)
docker compose up -d mcp-server

# Wait for service to start
echo ""
echo "Waiting for service to start..."
sleep 3

# Check service status
echo ""
echo "======================================"
echo "MCP Server Status:"
echo "======================================"
docker compose ps mcp-server

echo ""
echo "======================================"
echo "Server Info:"
echo "======================================"
echo "📡 SSE Endpoint: http://localhost:5554/sse"
echo "🔍 Test with inspector: ./inspector.sh"
echo "📋 View logs: docker compose logs -f mcp-server"
echo "🛑 Stop server: docker compose down"
echo "======================================"

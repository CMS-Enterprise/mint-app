#!/bin/bash

# Start Open WebUI with MINT MCP Server
# Run this from the mint-app/mcp directory

set -e

echo "🚀 Starting MINT MCP Server and Open WebUI..."

# Check if .env file exists for MCP server config
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Using defaults from .env.example"
fi

# Start the services
docker compose up -d

# Wait a moment for services to start
echo ""
echo "Waiting for services to start..."
sleep 3

# Check service status
echo ""
echo "======================================"
echo "Services Status:"
echo "======================================"
docker compose ps

echo ""
echo "======================================"
echo "✅ Services are running!"
echo ""
echo "Open WebUI:  http://localhost:3000"
echo "MCP Server:  http://mcp-server:5554 (internal)"
echo "             http://localhost:5554 (external)"
echo ""
echo "Authentication: DISABLED (local testing)"
echo ""
echo "📝 FIRST TIME SETUP:"
echo "   In Open WebUI, go to Settings → Admin Panel"
echo "   → Connections → Add MCP Server:"
echo "     Name: MINT MCP Server"
echo "     URL:  http://mcp-server:5554"
echo ""
echo "See OPENWEBUI.md for detailed setup instructions"
echo ""
echo "To view logs:"
echo "  docker compose logs -f"
echo ""
echo "To stop services:"
echo "  docker compose down"
echo "======================================"

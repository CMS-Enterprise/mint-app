#!/bin/bash

# Stop Open WebUI and MINT MCP Server
# Run this from the mint-app/mcp directory

echo "🛑 Stopping services..."
docker compose down

echo ""
echo "✅ Services stopped"
echo ""
echo "To remove volumes and clean up completely:"
echo "  docker compose down -v"

#!/bin/bash

# Start the MINT MCP Server
# Run this from the mint-app/mcp directory

set -e

echo "🚀 Starting MINT MCP Server..."

if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Using defaults from .env.example"
fi

uv run python -m mcpserver.server

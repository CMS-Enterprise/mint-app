#!/bin/bash

# Quick start script for MINT MCP Server POC
# Run this from the mint-app/mcp directory

set -e

echo "🚀 MINT MCP Server - Quick Start"
echo "================================="
echo ""

# Check if we're in the right directory
if [ ! -f "pyproject.toml" ]; then
    echo "❌ Error: Please run this script from the mcp/ directory"
    exit 1
fi

# Check if UV is installed
if ! command -v uv &> /dev/null; then
    echo "📦 UV not found. Installing UV..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.cargo/bin:$PATH"
fi

echo "📦 Installing dependencies..."
uv sync

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env from .env.example..."
    cp .env.example .env
    echo "✏️  Please edit .env with your configuration"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  cd mcp"
echo "  uv run python -m mcpserver.server"
echo ""
echo "Or use:"
echo "  cd mcp"
echo "  ./start.sh"
echo ""

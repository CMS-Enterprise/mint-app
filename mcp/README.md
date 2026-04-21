# MINT MCP Server (POC)

Model Context Protocol (MCP) server for MINT - enables AI assistants to interact with MINT data and operations.

## Overview

This is a proof-of-concept MCP server that provides tools for AI assistants to query and interact with MINT model plans, timelines, and collaborators.

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   AI Assistant  │◄────────┤   MCP Server     │◄────────┤   mint-app      │
│   (ChatGPT/     │  MCP    │   (Python/       │  GraphQL│   (Go)          │
│    Claude)      │Protocol │    FastMCP)      │   HTTP  │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

## Setup

### Prerequisites

- Python 3.12+
- UV package manager

### Installation

```bash
cd mcp
uv sync
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Running Locally

```bash
cd mcp
uv run python -m mcpserver.server
```

The server will start on `http://localhost:5554/mcp`

## Available Tools

### Model Plan Tools
- `get_model_plan_details` - Fetch model plan information by ID
- `get_model_plan_timeline` - Get timeline information for a model plan
- `get_anticipated_phase` - Calculate suggested phase based on status and timeline
- `list_model_collaborators` - Get collaborators and their roles for a model plan

### Search Tools
- `search_model_plans` - Search and filter model plans

## Development

### Running Tests

```bash
uv run pytest
```

### Linting

```bash
uv run ruff check .
```

### Type Checking

```bash
uv run pyright
```

### MCP Inspector

```bash
inspector.sh
```

## Docker

Build and run with Docker:

```bash
docker build -f mcp/Dockerfile -t mint-mcp-server .
docker run -p 5554:5554 --env-file mcp/.env mint-mcp-server
```

## Moving to Separate Repo

When ready to move this to a separate repository:

```bash
# From mint-app root
git subtree split --prefix=mcp -b mcp-server-branch
cd ../
git clone <new-repo-url> mint-mcp-server
cd mint-mcp-server
git pull ../mint-app mcp-server-branch
```

## Notes

This is a POC implementation kept in the mint-app repo for rapid iteration. Once validated, it can be moved to a dedicated repository.

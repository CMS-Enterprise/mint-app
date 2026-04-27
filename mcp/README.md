# MINT MCP Server (POC)

Model Context Protocol (MCP) server for MINT - enables AI assistants to interact with MINT data and operations.

> **Quick Reference:** See [QUICKSTART.md](QUICKSTART.md) for a command cheat sheet

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

## Project Structure

```
mcpserver/
├── __init__.py           # Package initialization
├── server.py             # Main MCP server with tools and resources
├── config.py             # Environment configuration
├── mint_client.py        # GraphQL client for MINT API
└── queries/              # GraphQL queries (validated against schema)
    ├── __init__.py       # Query exports
    ├── model_plans.py    # Model plan queries
    └── analytics.py      # Analytics queries
tests/
├── test_server.py        # Server tests
└── test_mint_client.py   # Client tests
```

See [GRAPHQL_VALIDATION.md](GRAPHQL_VALIDATION.md) for details on query organization and schema validation.

## Quick Start

```bash
cd mcp
make install    # Install dependencies and setup .env
make start      # Run on host for development
# OR
make docker     # Run in Docker
# OR
make webui      # Run with Open WebUI
```

See `make help` for all available commands.

## Setup

### Prerequisites

- Python 3.12+
- UV package manager (installed automatically by `make install`)
- Docker (optional, for containerized deployment)

### Installation

```bash
cd mcp
make install
```

This will:
- Install UV if not present
- Install Python dependencies
- Create `.env` from `.env.example`

### Configuration

Edit `.env` to configure your settings:

```bash
# Created automatically by 'make install'
# Edit to customize settings
vim .env
```

#### Authentication

The MCP server supports two authentication modes, mirroring the frontend's authentication pattern:

**Local Development (Default)**

For local development, the server uses the same local auth format as the MINT frontend:

```bash
LOCAL_AUTH_ENABLED=True
LOCAL_AUTH_EUA_ID=PSTM  # Your EUA ID
LOCAL_AUTH_JOB_CODES=MINT_ASSESSMENT_NONPROD,MINT_USER_NONPROD
```

This sends an Authorization header like:
```
Authorization: Local {"EUAID":"PSTM","jobCodes":["MINT_ASSESSMENT_NONPROD","MINT_USER_NONPROD"],"favorLocalAuth":true}
```

The backend (`pkg/local/authentication_middleware.go`) parses this and creates a dev user context.

**Production/Deployed Environments**

For deployed environments, disable local auth and provide JWT Bearer tokens:

```bash
LOCAL_AUTH_ENABLED=False
AUTH_SERVER_URL=https://test.idp.idm.cms.gov
JWT_ISSUER=https://test.idp.idm.cms.gov
JWT_AUDIENCE=urn:gov:cms:mint:dev
```

Bearer tokens can be passed to individual tool calls when needed.

### Running the Server

**Development (on host):**
```bash
make start      # or 'make dev'
```

**Docker (MCP server only):**
```bash
make docker     # or 'make start-docker'
```

**Docker with Open WebUI:**
```bash
make webui      # or 'make start-openwebui'
```

The server will start on `http://localhost:5554/mcp`

### Useful Commands

```bash
make help              # Show all available commands
make inspector         # Open MCP Inspector for testing
make logs              # View server logs
make status            # Check server status
make stop              # Stop running containers
make stop-all          # Stop everything (Docker + host)
make restart           # Restart the server
make clean             # Clean up containers
```

## Available Tools

### Model Plan Tools
- `get_model_plan_details` - Fetch model plan information by ID
- `get_model_plan_timeline` - Get timeline information for a model plan
- `get_anticipated_phase` - Calculate suggested phase based on status and timeline
- `list_model_collaborators` - Get collaborators and their roles for a model plan

### Search Tools
- `search_model_plans` - Search and filter model plans
Test your server with the MCP Inspector:

```bash
make inspector
```

This opens a web UI for testing MCP tools and resources.

## Docker

The Makefile handles Docker commands, but you can also run manually:

```bash
# Build
docker build -f mcp/Dockerfile -t mint-mcp-server .

# Run
docker run -p 5554:5554 --env-file mcp/.env mint-mcp-server

# Or use docker compose (recommended)
make docker        # Start just MCP server
make webui         # Start MCP server + Open WebUI
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

# MINT MCP Server - Quick Reference

## 🚀 Getting Started

```bash
cd mcp
make install    # First time setup
make start      # Run on host (development)
```

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make start` | Run on host (for development) |
| `make docker` | Run in Docker (MCP server only) |
| `make webui` | Run in Docker with Open WebUI |
| `make stop` | Stop Docker containers |
| `make stop-all` | Stop everything (Docker + host) |
| `make restart` | Restart MCP server |
| `make inspector` | Open MCP Inspector for testing |
| `make logs` | View server logs |
| `make status` | Check server status |
| `make clean` | Clean up containers |

## 🎯 Quick Actions

**Start for development:**
```bash
make dev
```

**Start with Open WebUI:**
```bash
make webui
# Then visit http://localhost:3000
```

**Test the connection:**
```bash
make check
```

**View logs in real-time:**
```bash
make logs
```

**Complete reset:**
```bash
make clean-volumes
```

## 🔍 Configuration

Your configuration in `.env`:

```bash
# Open WebUI URL
MINT_GRAPHQL_URL=http://localhost:8085/api/graph/query

# For Open WebUI, use:
MINT_GRAPHQL_URL=http://host.docker.internal:8085/api/graph/query
```

## 🐛 Troubleshooting

**Port already in use:**
```bash
make stop-all    # Kills everything on port 5554
```

**Can't connect from Open WebUI:**
- Go to: Admin Panel → Settings → Integrations → Manage Tool Servers
- Type: `MCP Streamable HTTP`
- From inside Docker use: `http://mcp-server:5554/mcp`
- From outside Docker use: `http://localhost:5554/mcp`

**View what's running:**
```bash
make status
lsof -i:5554    # Check what's on port 5554
```

## 📚 More Info

- Full documentation: [README.md](README.md)
- Open WebUI setup: [OPENWEBUI.md](OPENWEBUI.md)
- GraphQL queries: [GRAPHQL_VALIDATION.md](GRAPHQL_VALIDATION.md)
- Integration options: [MCP_INTEGRATION_OPTIONS.md](MCP_INTEGRATION_OPTIONS.md)

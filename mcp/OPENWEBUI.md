# Open WebUI with MINT MCP Server - Quick Start

This setup runs Open WebUI configured to work with the MINT MCP Server as a tool.

## What's Included

- **MINT MCP Server**: Provides AI assistants access to MINT data and operations
- **Open WebUI**: Web interface for interacting with AI models (with MCP tools)

## Quick Start

1. **Start everything:**
   ```bash
   make webui
   # or: make start-openwebui
   ```

2. **Access Open WebUI:**
   - Open your browser to http://localhost:3000
   - No login required (authentication disabled for local testing)

3. **Configure the MCP Server (First Time Only):**
   
   Since you're running without authentication, you'll need to manually configure the MCP server in Open WebUI's settings:
   
   a. In Open WebUI, click the **Settings** icon (gear icon, usually top-right)
   
   b. Go to **Admin Panel** → **Settings** → **Integrations**
   
   c. Click **Manage Tool Servers**
   
   d. Add the MINT MCP Server with these details:
      - **Name**: `MINT MCP Server`
      - **Type**: `MCP Streamable HTTP`
      - **URL**: `http://mcp-server:5554/mcp`
      - **Description**: `Access MINT model plans, timelines, and collaborators`
   
   e. Save the configuration and test the connection

4. **Use MCP Tools:**
   - After configuration, ask questions about MINT model plans, timelines, etc.
   - The AI will automatically use the MCP server when relevant
   - Example: "Show me details about model plan XYZ"

## Configuration

The docker-compose setup includes:

- **Open WebUI** on port 3000
- **MCP Server** on port 5554
- **No authentication** (for local testing)
- **Automatic MCP server integration**

## Customization

Edit [docker-compose.yml](docker-compose.yml) to customize:

- `MINT_GRAPHQL_URL`: Change if your MINT backend runs on a different URL
- `LOCAL_AUTH_EUA_ID`: Change to your EUA ID
- `LOCAL_AUTH_JOB_CODES`: Adjust permissions as needed

## Managing Services

```bash
make logs-openwebui    # View logs for all services
make logs              # View MCP server logs only
make status            # Check service status
make restart-all       # Restart everything
make stop              # Stop all services
make clean-volumes     # Stop and remove volumes (clean start)
```

## Troubleshooting

**MCP Server not connecting to MINT backend:**
- Check that your MINT backend is running
- Verify `MINT_GRAPHQL_URL` in docker-compose.yml
- Check logs: `docker compose logs mcp-server`

**Open WebUI can't reach MCP Server:**
- Check service health: `docker compose ps`
- View logs: `docker compose logs open-webui`
- Verify network connectivity: `docker compose exec open-webui ping mcp-server`

**Permission issues with volumes:**
```bash
docker compose down -v
docker volume rm open-webui
docker compose up -d
```

## Architecture

```[docker-compose.yml](docker-compose.yml)
- Check logs: `make logs`

**Open WebUI can't reach MCP Server:**
- Check service health: `make status`
- View logs: `make logs-openwebui`
- Verify network connectivity: `docker compose exec open-webui ping mcp-server`

**Permission issues with volumes:**
```bash
make clean-volumes
make webui
## Next Steps

- Configure AI models in Open WebUI settings
- Test MCP tools by asking about MINT model plans
- Adjust authentication settings for production use

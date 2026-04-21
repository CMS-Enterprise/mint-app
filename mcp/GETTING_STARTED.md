# Getting Started with MINT MCP Server (POC)

This guide will help you get the MINT MCP Server up and running for development and testing.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that enables AI assistants (like ChatGPT, Claude) to securely interact with your applications. Think of it as a way for AI to call functions in your app.

This POC demonstrates how MINT can expose tools for AI assistants to:
- Query model plan details
- Fetch timelines
- List collaborators
- Search model plans

## Quick Start

### Prerequisites

1. **Python 3.12+** - Check with `python3 --version`
2. **UV Package Manager** - Will be installed automatically by quickstart script
3. **MINT Backend Running** - The MCP server needs to talk to the MINT GraphQL API

### Installation

From the `mint-app/mcp` directory:

```bash
./quickstart.sh
```

This will:
- Install UV if needed
- Install Python dependencies
- Create a `.env` file from `.env.example`

### Configuration

Edit `mcp/.env` with your settings:

```bash
# Point to your local MINT instance
MINT_GRAPHQL_URL=http://localhost:8080/api/graph/query

# Or point to a deployed environment
# MINT_GRAPHQL_URL=https://mint-dev.cms.gov/api/graph/query

# Authentication (for production use)
AUTH_SERVER_URL=https://test.idp.idm.cms.gov
JWT_ISSUER=https://test.idp.idm.cms.gov
JWT_AUDIENCE=urn:gov:cms:mint:dev
```

### Running the Server

```bash
cd mcp
./start.sh
```

Or manually:

```bash
cd mcp
uv run python -m mcpserver.server
```

The server will start on `http://localhost:5554/mcp`

## Testing the Server

### Manual Testing with curl

Test that the server is running:

```bash
curl http://localhost:5554/mcp/health
```

### Testing with an MCP Client

To test with an AI assistant, you'll need to configure it to use your MCP server. This varies by client:

#### Claude Desktop (Example)

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mint": {
      "url": "http://localhost:5554/mcp",
      "name": "MINT Model Plans"
    }
  }
}
```

Then restart Claude Desktop and you should see MINT tools available.

## Available Tools

The POC includes these tools:

### 1. `get_model_plan_details`
Retrieve detailed information about a specific model plan.

**Parameters:**
- `model_plan_id` (string): UUID of the model plan

**Example use in AI:**
> "Show me the details of model plan 123e4567-e89b-12d3-a456-426614174000"

### 2. `get_model_plan_timeline`
Get timeline information (key dates) for a model plan.

**Parameters:**
- `model_plan_id` (string): UUID of the model plan

**Example use in AI:**
> "When does model plan XYZ start its performance period?"

### 3. `list_model_collaborators`
List all collaborators on a model plan with their roles.

**Parameters:**
- `model_plan_id` (string): UUID of the model plan

**Example use in AI:**
> "Who are the model leads for this plan?"

### 4. `search_model_plans`
Search for model plans with optional filtering.

**Parameters:**
- `status_filter` (optional string): Filter by status (ACTIVE, PAUSED, etc.)
- `limit` (optional int): Max results (default 10, max 50)

**Example use in AI:**
> "Show me all active model plans"
> "List the 5 most recent model plans"

## Development

### Running Tests

```bash
cd mcp
uv run pytest
```

With coverage:

```bash
uv run pytest --cov=mcpserver --cov-report=html
```

### Linting

```bash
uv run ruff check .
```

Auto-fix:

```bash
uv run ruff check --fix .
```

### Type Checking

```bash
uv run pyright
```

### Adding New Tools

To add a new MCP tool:

1. Open `mcpserver/server.py`
2. Create a new async function decorated with `@mcp.tool()`:

```python
@mcp.tool()
async def your_new_tool(
    param: str = Field(description="Clear description"),
) -> Dict[str, Any]:
    """
    Detailed description of what this tool does.
    
    This appears in AI assistant's tool documentation.
    """
    try:
        client = get_mint_client()
        
        query = """
        query YourQuery($param: String!) {
            # Your GraphQL query
        }
        """
        
        result = await client.query(query, variables={"param": param})
        return result
        
    except Exception as e:
        logger.error(f"Error: {e}")
        return {"error": str(e)}
```

3. Write tests in `tests/test_server.py`
4. Update this documentation

### GraphQL Queries

The MCP server communicates with MINT via GraphQL. To test your queries:

1. Start MINT backend
2. Open GraphQL Playground: http://localhost:8080/api/graph/playground
3. Test your query there first
4. Copy the working query into your tool

## Docker

Build and run with Docker:

```bash
# From mint-app root
docker build -f mcp/Dockerfile -t mint-mcp-server .

# Run
docker run -p 5554:5554 --env-file mcp/.env mint-mcp-server
```

## Troubleshooting

### Server won't start

**Error: `uv: command not found`**
```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.cargo/bin:$PATH"
```

**Error: `Connection refused` when calling MINT API**
- Ensure MINT backend is running: `http://localhost:8080`
- Check `MINT_GRAPHQL_URL` in `.env`

### GraphQL Errors

**Error: `Failed to fetch model plan`**
- Check the GraphQL query in the tool
- Test the query in GraphQL Playground first
- Verify the model plan ID exists

### Authentication Issues

**Note:** For this POC, authentication is **disabled** to simplify testing. In production:
1. Uncomment the JWT verification code in `server.py`
2. Configure `AUTH_SERVER_URL` properly
3. Pass valid JWT tokens from the AI client

## Next Steps

Once the POC is validated:

1. **Enable Authentication** - Uncomment JWT verification
2. **Add More Tools** - Based on user needs (notifications, analytics, etc.)
3. **Add Observability** - Integrate Langfuse for monitoring
4. **Production Deployment** - Deploy to AWS/Cloud
5. **Consider Moving to Separate Repo** - If this grows beyond POC

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   AI Assistant  │◄────────┤   MCP Server     │◄────────┤   MINT App      │
│   (Claude,      │  MCP    │   (Python/       │  GraphQL│   (Go)          │
│    ChatGPT)     │Protocol │    FastMCP)      │   HTTP  │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
         ▲                           │                            │
         │                           │                            │
         └───────── Tools ───────────┘                            ▼
         (get_model_plan_details,                        ┌─────────────────┐
          search_model_plans,                            │   PostgreSQL    │
          list_collaborators)                            │   (Database)    │
                                                         └─────────────────┘
```

## Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [FastMCP Framework](https://github.com/jlowin/fastmcp)
- [MINT GraphQL API](http://localhost:8080/api/graph/playground)
- [MCP Server Guidelines](../docs/MCP-Server-Development-Guidelines.md) (if created)

## Support

For questions or issues with the MCP POC, contact the MINT team or open an issue in the repository.

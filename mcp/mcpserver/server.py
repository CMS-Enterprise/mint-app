"""MINT MCP Server - Main server implementation."""

import logging
import os
import sys
from typing import Any, Dict, List, Optional

from fastmcp import FastMCP
from pydantic import Field

from mcpserver import __version__
from mcpserver.config import (
    APP_HOST,
    APP_PORT,
    LANGFUSE_ENABLED,
    LOG_LEVEL,
)
from mcpserver.mint_client import get_mint_client
from mcpserver import queries  # Import validated queries

# Configure logging
DETAILED_FORMAT = "%(asctime)s | %(levelname)-8s | %(process)d | %(name)s:%(funcName)s:%(lineno)d - %(message)s"

logging.basicConfig(
    level=LOG_LEVEL,
    format=DETAILED_FORMAT,
    stream=sys.stdout,
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)

# Initialize FastMCP
# Note: For POC, we're starting without auth to test locally
# In production, you'd enable JWT authentication here
mcp = FastMCP(
    name="MINT MCP Server",
    # TODO: Enable JWT auth for production
    # auth=JWTVerifier(
    #     jwks_uri=f"{AUTH_SERVER_URL}/.well-known/jwks.json",
    #     issuer=JWT_ISSUER,
    #     audience=JWT_AUDIENCE,
    #     algorithm=JWT_ALGORITHM,
    # ),
)

logger.info(f"Initializing MINT MCP Server v{__version__}")
logger.info(f"Langfuse observability: {'enabled' if LANGFUSE_ENABLED else 'disabled'}")


# ============================================================================
# Model Plan Tools
# ============================================================================


@mcp.resource("mint://info")
def get_server_info() -> str:
    """Information about the MINT MCP Server."""
    return "Model Context Protocol server for MINT - enables AI assistants to interact with MINT data"


@mcp.tool()
async def get_model_plan_details(
    model_plan_id: str = Field(description="UUID of the model plan to retrieve"),
) -> Dict[str, Any]:
    """
    Retrieve detailed information about a MINT model plan.

    This tool fetches comprehensive details about a model plan including its name, status,
    abbreviation, and other metadata. Use this when you need to get basic information about
    a specific model plan.

    Args:
        model_plan_id: The UUID of the model plan

    Returns:
        Dictionary containing model plan details including:
        - id: The model plan UUID
        - modelName: The name of the model
        - status: Current status (e.g., PLAN_DRAFT, ACTIVE, PAUSED)
        - abbreviation: Model abbreviation
        - createdDts: Creation timestamp
        - modifiedDts: Last modified timestamp
    """
    try:
        client = get_mint_client()

        # Use validated query from queries module
        result = await client.query(
            queries.GET_MODEL_PLAN_DETAILS,  # type: ignore[arg-type]
            variables={"id": model_plan_id}
        )

        if "error" in result:
            return {"error": f"Failed to fetch model plan: {result['error']}"}

        return result.get("modelPlan", {"error": "Model plan not found"})

    except Exception as e:
        logger.error(f"Error fetching model plan {model_plan_id}: {e}")
        return {"error": f"An unexpected error occurred: {str(e)}"}


@mcp.tool()
async def get_model_plan_timeline(
    model_plan_id: str = Field(description="UUID of the model plan"),
) -> Dict[str, Any]:
    """
    Retrieve timeline information for a MINT model plan.

    This tool fetches key timeline dates for a model plan, including when it was announced,
    when applications opened/closed, and when it's expected to go live.

    Args:
        model_plan_id: The UUID of the model plan

    Returns:
        Dictionary containing timeline information with dates for various milestones
    """
    try:
        client = get_mint_client()

        # Use validated query from queries module
        result = await client.query(
            queries.GET_MODEL_PLAN_TIMELINE,  # type: ignore[arg-type]
            variables={"id": model_plan_id}
        )

        if "error" in result:
            return {"error": f"Failed to fetch timeline: {result['error']}"}

        return result.get("modelPlan", {}).get("basics", {"error": "Timeline not found"})

    except Exception as e:
        logger.error(f"Error fetching timeline for model plan {model_plan_id}: {e}")
        return {"error": f"An unexpected error occurred: {str(e)}"}


@mcp.tool()
async def list_model_collaborators(
    model_plan_id: str = Field(description="UUID of the model plan"),
) -> List[Dict[str, Any]]:
    """
    List all collaborators for a MINT model plan.

    This tool retrieves information about all people collaborating on a model plan,
    including their roles (e.g., Model Lead, Team Member) and contact information.

    Args:
        model_plan_id: The UUID of the model plan

    Returns:
        List of collaborators with their user information and roles
    """
    try:
        client = get_mint_client()

        # Use validated query from queries module
        result = await client.query(
            queries.GET_MODEL_COLLABORATORS,  # type: ignore[arg-type]
            variables={"id": model_plan_id}
        )

        if "error" in result:
            return [{"error": f"Failed to fetch collaborators: {result['error']}"}]

        collaborators = result.get("modelPlan", {}).get("collaborators", [])
        return collaborators if collaborators else [{"error": "No collaborators found"}]

    except Exception as e:
        logger.error(f"Error fetching collaborators for model plan {model_plan_id}: {e}")
        return [{"error": f"An unexpected error occurred: {str(e)}"}]


@mcp.tool()
async def search_model_plans(
    status_filter: Optional[str] = Field(
        default=None,
        description="Filter by status (e.g., PLAN_DRAFT, ACTIVE, PAUSED, ENDED, CANCELED)",
    ),
    limit: int = Field(default=10, description="Maximum number of results to return (default: 10, max: 50)"),
) -> List[Dict[str, Any]]:
    """
    Search and list MINT model plans with optional filtering.

    This tool allows you to search for model plans, optionally filtering by status,
    and returns a list of matching plans with basic information.

    Args:
        status_filter: Optional status to filter by (e.g., "ACTIVE", "PAUSED")
        limit: Maximum number of results to return (1-50)

    Returns:
        List of model plans matching the criteria
    """
    try:
        client = get_mint_client()

        # Clamp limit between 1 and 50
        limit = max(1, min(limit, 50))

        # Use validated query from queries module
        result = await client.query(
            queries.LIST_MODEL_PLANS,  # type: ignore[arg-type]
            variables={"filter": "INCLUDE_ALL"}
        )

        if "error" in result:
            return [{"error": f"Failed to search model plans: {result['error']}"}]

        plans = result.get("modelPlanCollection", [])

        # Apply status filter if provided
        if status_filter and isinstance(status_filter, str):
            plans = [p for p in plans if p.get("status") == status_filter.upper()]

        # Apply limit
        plans = plans[:limit]

        return plans if plans else [{"message": "No model plans found matching criteria"}]

    except Exception as e:
        logger.error(f"Error searching model plans: {e}")
        return [{"error": f"An unexpected error occurred: {str(e)}"}]


# ============================================================================
# MCP Resources
# ============================================================================


@mcp.resource("mint://model-plans")
async def list_model_plans_resource() -> str:
    """
    List all MINT model plans as a browseable resource.
    
    Returns a formatted list of all active model plans in the system.
    """
    try:
        client = get_mint_client()
        
        # Use validated query from queries module
        result = await client.query(
            queries.LIST_MODEL_PLANS,  # type: ignore[arg-type]
            variables={"filter": "INCLUDE_ALL"}
        )
        
        if "error" in result:
            return f"Error: {result['error']}"
        
        plans = result.get("modelPlanCollection", [])
        
        if not plans:
            return "No model plans found."
        
        # Format as readable text
        output = f"# MINT Model Plans ({len(plans)} total)\n\n"
        
        for plan in plans:
            output += f"## {plan.get('modelName', 'Unnamed')}\n"
            output += f"- **ID**: {plan.get('id')}\n"
            output += f"- **Abbreviation**: {plan.get('abbreviation', 'N/A')}\n"
            output += f"- **Status**: {plan.get('status', 'Unknown')}\n"
            output += f"- **Created**: {plan.get('createdDts', 'N/A')}\n"
            output += f"- **Resource URI**: mint://model-plans/{plan.get('id')}\n\n"
        
        return output
        
    except Exception as e:
        logger.error(f"Error listing model plans resource: {e}")
        return f"Error: {str(e)}"


@mcp.resource("mint://model-plans/{model_plan_id}")
async def get_model_plan_resource(model_plan_id: str) -> str:
    """
    Get detailed information about a specific model plan as a resource.
    
    Args:
        model_plan_id: UUID of the model plan
    
    Returns:
        Formatted model plan details
    """
    try:
        client = get_mint_client()
        
        # Use validated query from queries module
        result = await client.query(
            queries.GET_MODEL_PLAN_RESOURCE,  # type: ignore[arg-type]
            variables={"id": model_plan_id}
        )
        
        if "error" in result:
            return f"Error: {result['error']}"
        
        plan = result.get("modelPlan", {})
        
        if not plan:
            return f"Model plan {model_plan_id} not found."
        
        basics = plan.get("basics", {})
        collaborators = plan.get("collaborators", [])
        
        # Format as readable text
        output = f"# {plan.get('modelName', 'Unnamed Model Plan')}\n\n"
        output += f"**ID**: {plan.get('id')}\n"
        output += f"**Abbreviation**: {plan.get('abbreviation', 'N/A')}\n"
        output += f"**Status**: {plan.get('status', 'Unknown')}\n\n"
        
        output += "## Goal\n"
        output += f"{basics.get('goal', 'No goal specified')}\n\n"
        
        output += "## Timeline\n"
        output += f"- **Performance Period**: {basics.get('performancePeriodStarts', 'N/A')} to {basics.get('performancePeriodEnds', 'N/A')}\n"
        output += f"- **Applications**: {basics.get('applicationsStart', 'N/A')} to {basics.get('applicationsEnd', 'N/A')}\n"
        output += f"- **Announced**: {basics.get('announced', 'N/A')}\n"
        output += f"- **Wrap Up Ends**: {basics.get('wrapUpEnds', 'N/A')}\n\n"
        
        if collaborators:
            output += "## Collaborators\n"
            for collab in collaborators:
                user = collab.get("userAccount", {})
                roles = ", ".join(collab.get("teamRoles", []))
                output += f"- **{user.get('commonName', 'Unknown')}** ({user.get('email', 'N/A')}) - {roles}\n"
        
        return output
        
    except Exception as e:
        logger.error(f"Error getting model plan resource {model_plan_id}: {e}")
        return f"Error: {str(e)}"


# ============================================================================
# Server Setup
# ============================================================================


def main() -> None:
    """Run the MCP server."""
    # Check if we should use STDIO or SSE transport
    use_stdio = os.getenv("MCP_TRANSPORT", "sse").lower() == "stdio"
    
    if use_stdio:
        logger.info("Starting MINT MCP Server with STDIO transport")
        mcp.run(transport="stdio")
    else:
        logger.info(f"Starting MINT MCP Server on {APP_HOST}:{APP_PORT}")
        logger.info(f"Connect with: http://localhost:{APP_PORT}/sse")
        mcp.run(
            transport="sse",
            host=APP_HOST,
            port=APP_PORT,
        )


if __name__ == "__main__":
    main()

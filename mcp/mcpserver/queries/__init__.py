"""GraphQL query definitions for MINT API.

This package contains all GraphQL queries used by the MCP server,
organized by domain for maintainability.
"""

from mcpserver.queries.model_plans import (
    GET_MODEL_PLAN_DETAILS,
    GET_MODEL_PLAN_TIMELINE,
    GET_MODEL_COLLABORATORS,
    LIST_MODEL_PLANS,
)
from mcpserver.queries.analytics import (
    GET_ANALYTICS_SUMMARY,
)
from mcpserver.queries.resources import (
    GET_MODEL_PLAN_RESOURCE,
)

__all__ = [
    # Model Plan queries
    "GET_MODEL_PLAN_DETAILS",
    "GET_MODEL_PLAN_TIMELINE",
    "GET_MODEL_COLLABORATORS",
    "LIST_MODEL_PLANS",
    # Analytics queries
    "GET_ANALYTICS_SUMMARY",
    # Resource queries
    "GET_MODEL_PLAN_RESOURCE",
]

"""
Example: Adding a New Query Domain

This file demonstrates how to add a new query category to the MCP server.
DO NOT COMMIT THIS FILE - it's just an example.

Steps:
1. Create a new file in mcpserver/queries/ for your domain
2. Define your queries using gql()
3. Export them in __init__.py
4. Use them in server.py
"""

# Step 1: Create mcpserver/queries/operational_needs.py
# ============================================================================

from gql import gql

GET_OPERATIONAL_NEED = gql("""
    query GetOperationalNeed($id: UUID!) {
        operationalNeed(id: $id) {
            id
            modelPlanID
            name
            key
            nameOther
            needed
            modifiedDts
            solutions {
                id
                name
                key
                nameOther
                needed
            }
        }
    }
""")

LIST_OPERATIONAL_NEEDS = gql("""
    query ListOperationalNeeds($modelPlanID: UUID!) {
        operationalNeeds(modelPlanID: $modelPlanID) {
            id
            name
            key
            needed
        }
    }
""")


# Step 2: Update mcpserver/queries/__init__.py
# ============================================================================

"""
from mcpserver.queries.operational_needs import (
    GET_OPERATIONAL_NEED,
    LIST_OPERATIONAL_NEEDS,
)

__all__ = [
    # ... existing exports
    # Operational Needs queries
    "GET_OPERATIONAL_NEED",
    "LIST_OPERATIONAL_NEEDS",
]
"""


# Step 3: Use in mcpserver/server.py
# ============================================================================

"""
from mcpserver import queries

@mcp.tool()
async def get_operational_need(
    need_id: str = Field(description="UUID of the operational need"),
) -> Dict[str, Any]:
    '''Get details about an operational need.'''
    try:
        client = get_mint_client()
        result = await client.query(
            queries.GET_OPERATIONAL_NEED,
            variables={"id": need_id}
        )
        return result.get("operationalNeed", {})
    except Exception as e:
        logger.error(f"Error fetching operational need {need_id}: {e}")
        return {"error": str(e)}
"""


# Benefits of this organization:
# ============================================================================
# 
# ✅ Clean separation of concerns - each domain in its own file
# ✅ Easy to find queries - look in queries/model_plans.py for model plan queries
# ✅ Scalable - add new domains without cluttering existing files
# ✅ Matches frontend pattern - src/gql/operations/Analytics/GetAnalytics.ts
# ✅ Schema validated - GraphQL extension validates queries against schema
# ✅ Type safe - gql() wrapper provides better IDE support

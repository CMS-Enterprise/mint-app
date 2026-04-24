# GraphQL Schema Validation for MCP Server

This MCP server uses the same GraphQL schema validation approach as the main MINT frontend, ensuring queries are valid before deployment.

## Benefits

1. **Schema Validation**: Queries are validated against the actual GraphQL schema at development time
2. **Type Safety**: The `gql` library provides better type checking and autocompletion
3. **Centralized Queries**: All GraphQL queries are defined in `mcpserver/queries.py` (similar to `src/gql/operations/`)
4. **Editor Support**: IDEs with GraphQL extensions will provide validation and autocompletion

## How It Works

### 1. Schema Configuration

`graphql.config.json` points to the parent schema:
```json
{
  "schema": ["../pkg/graph/schema/**/*.graphql"],
  "documents": ["mcpserver/**/*.py"]
}
```

### 2. Define Queries

Add queries to the appropriate file in `mcpserver/queries/`:

- `model_plans.py` - Model plan queries
- `analytics.py` - Analytics queries
- Add new files for new domains

```python
# In mcpserver/queries/model_plans.py
from gql import gql

GET_MODEL_PLAN_DETAILS = gql("""
    query GetModelPlanDetails($id: UUID!) {
        modelPlan(id: $id) {
            id
            modelName
            status
        }
    }
""")
```

Export new queries in `mcpserver/queries/__init__.py`:

```python
from mcpserver.queries.model_plans import (
    GET_MODEL_PLAN_DETAILS,
    # ... other queries
)

__all__ = [
    "GET_MODEL_PLAN_DETAILS",
    # ... other exports
]
```

### 3. Use in Tools
Choose/Create File**: 
   - Existing domain? Add to appropriate file in `mcpserver/queries/`
   - New domain? Create new file (e.g., `mcpserver/queries/operational_needs.py`)
3. **Define Query**: Add using `gql()` wrapper
4. **Export**: Add to `mcpserver/queries/__init__.py` exports
5. **Use in Tool**: Import `queries` and reference by name
6. **Validate**: The GraphQL extension will validate queries against the schema

## Query Organization

```
mcpserver/queries/
├── __init__.py          # Central exports
├── model_plans.py       # Model plan operations
├── analytics.py         # Analytics queries
├── operational_needs.py # (example: add as needed)
└── ...
```

## Example: Adding Analytics Query

```python
# 1. In mcpserver/queries/analytics.py
GET_ANALYTICS_BY_STATUS = gql("""
    query GetAnalyticsByStatus {
        analytics {
            modelsByStatus {
                status
                numberOfModels
            }
        }
    }
""")

# 2. Export in mcpserver/queries/__init__.py
from mcpserver.queries.analytics import (
    GET_ANALYTICS_SUMMARY,
    GET_ANALYTICS_BY_STATUS,  # Add new export
)

__all__ = [
    "GET_ANALYTICS_SUMMARY",
    "GET_ANALYTICS_BY_STATUS",  # Add to __all__
]

# 3. Use i**Define Query**: Add to `mcpserver/queries.py` using `gql()` wrapper
3. **Use in Tool**: Import `queries` and reference by name
4. **Validate**: The GraphQL extension will validate queries against the schema

## Example: Adding Analytics Query

```python
# In mcpserver/queries.py
GET_ANALYTICS_SUMMARY = gql("""
    query GetAnalyticsSummary {
        analytics {
            modelsByStatus {
                status
                numberOfModels
            }
        }
    }
""")

# In mcpserver/server.py
@mcp.tool()
async def get_analytics() -> Dict[str, Any]:
    client = get_mint_client()
    result = await client.query(queries.GET_ANALYTICS_SUMMARY)
    return result.get("analytics", {})
```

## Schema Updates

When the MINT GraphQL schema changes:
1. No action needed - queries reference `../pkg/graph/schema/` directly
2. Your IDE will immediately show validation errors for invalid queries
3. Update queries in `queries.py` to match new schema

## Editor Setup

### VS Code

1. Install: **GraphQL: Language Feature Support**
2. Queries in `queries.py` will be validated automatically
3. Get autocompletion by typing inside `gql("""` strings

### PyCharm

1. Install: **GraphQL** plugin
2. Configure schema path in settings
3. Enjoy validation and autocompletion

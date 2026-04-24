"""Client for communicating with MINT GraphQL API."""

import httpx
import json
from typing import Any, Dict, Optional
import logging
from graphql import print_ast

from mcpserver.config import (
    MINT_GRAPHQL_URL,
    LOCAL_AUTH_ENABLED,
    LOCAL_AUTH_EUA_ID,
    LOCAL_AUTH_JOB_CODES,
)

logger = logging.getLogger(__name__)


class MintGraphQLClient:
    """Client for making GraphQL requests to MINT API."""

    def __init__(self, graphql_url: str = MINT_GRAPHQL_URL):
        """Initialize the MINT GraphQL client."""
        self.graphql_url = graphql_url
        self.httpx_client = httpx.AsyncClient(timeout=30.0)

    def _get_auth_header(self, auth_token: Optional[str] = None) -> Optional[str]:
        """
        Generate the appropriate Authorization header.
        
        Mimics the frontend's getAuthHeader() logic:
        1. Prefer local auth if enabled
        2. Fall back to Bearer token if provided
        
        Returns:
            Authorization header value or None
        """
        # Prefer local auth for development (mirrors frontend pattern)
        if LOCAL_AUTH_ENABLED:
            job_codes = [code.strip() for code in LOCAL_AUTH_JOB_CODES.split(",")]
            local_auth_config = {
                "EUAID": LOCAL_AUTH_EUA_ID,
                "jobCodes": job_codes,
                "favorLocalAuth": True,
            }
            return f"Local {json.dumps(local_auth_config)}"
        
        # Fall back to Bearer token if provided
        if auth_token:
            return f"Bearer {auth_token}"
        
        return None

    async def query(
        self,
        query: Any,  # Can be str or gql.GraphQLRequest
        variables: Optional[Dict[str, Any]] = None,
        auth_token: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Execute a GraphQL query against MINT API.

        Args:
            query: The GraphQL query string or gql GraphQLRequest object
            variables: Optional variables for the query
            auth_token: Optional JWT token for authentication (only used if LOCAL_AUTH_ENABLED=False)

        Returns:
            The GraphQL response data

        Raises:
            httpx.HTTPError: If the request fails
        """
        try:
            # Convert GraphQLRequest to string if needed
            # GraphQLRequest has a .document attribute containing the DocumentNode
            if hasattr(query, 'document'):
                # It's a GraphQLRequest object from gql()
                query_str = print_ast(query.document)
            else:
                query_str = str(query)
            
            headers = {"Content-Type": "application/json"}
            
            # Get auth header (local auth or Bearer token)
            auth_header = self._get_auth_header(auth_token)
            if auth_header:
                headers["Authorization"] = auth_header

            payload: Dict[str, Any] = {"query": query_str}
            if variables:
                payload["variables"] = variables

            response = await self.httpx_client.post(
                self.graphql_url,
                json=payload,
                headers=headers,
            )
            response.raise_for_status()
            result = response.json()

            if "errors" in result:
                logger.error(f"GraphQL errors: {result['errors']}")
                return {"error": result["errors"]}

            return result.get("data", {})

        except httpx.HTTPError as e:
            logger.error(f"HTTP error during GraphQL query: {e}")
            return {"error": f"HTTP error: {str(e)}"}
        except Exception as e:
            logger.error(f"Unexpected error during GraphQL query: {e}")
            return {"error": f"Unexpected error: {str(e)}"}

    async def close(self) -> None:
        """Close the HTTP client."""
        await self.httpx_client.aclose()


# Singleton instance
_mint_client: Optional[MintGraphQLClient] = None


def get_mint_client() -> MintGraphQLClient:
    """Get or create the singleton MINT GraphQL client."""
    global _mint_client
    if _mint_client is None:
        _mint_client = MintGraphQLClient()
    return _mint_client

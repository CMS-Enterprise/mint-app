"""Client for communicating with MINT GraphQL API."""

import httpx
from typing import Any, Dict, Optional
import logging

from mcpserver.config import MINT_GRAPHQL_URL

logger = logging.getLogger(__name__)


class MintGraphQLClient:
    """Client for making GraphQL requests to MINT API."""

    def __init__(self, graphql_url: str = MINT_GRAPHQL_URL):
        """Initialize the MINT GraphQL client."""
        self.graphql_url = graphql_url
        self.client = httpx.AsyncClient(timeout=30.0)

    async def query(
        self,
        query: str,
        variables: Optional[Dict[str, Any]] = None,
        auth_token: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Execute a GraphQL query against MINT API.

        Args:
            query: The GraphQL query string
            variables: Optional variables for the query
            auth_token: Optional JWT token for authentication

        Returns:
            The GraphQL response data

        Raises:
            httpx.HTTPError: If the request fails
        """
        headers = {"Content-Type": "application/json"}
        
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"

        payload: Dict[str, Any] = {"query": query}
        if variables:
            payload["variables"] = variables

        try:
            response = await self.client.post(
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
        await self.client.aclose()


# Singleton instance
_mint_client: Optional[MintGraphQLClient] = None


def get_mint_client() -> MintGraphQLClient:
    """Get or create the singleton MINT GraphQL client."""
    global _mint_client
    if _mint_client is None:
        _mint_client = MintGraphQLClient()
    return _mint_client

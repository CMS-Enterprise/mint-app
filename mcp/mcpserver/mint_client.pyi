"""Client for communicating with MINT GraphQL API."""

from typing import Any, Dict, Optional

class MintGraphQLClient:
    """Client for making GraphQL requests to MINT API."""
    
    graphql_url: str
    
    def __init__(self, graphql_url: str = ...) -> None: ...
    
    async def query(
        self,
        query: str,
        variables: Optional[Dict[str, Any]] = None,
        auth_token: Optional[str] = None,
    ) -> Dict[str, Any]: ...
    
    async def close(self) -> None: ...

def get_mint_client() -> MintGraphQLClient: ...

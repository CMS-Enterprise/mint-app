# Authentication Configuration

The MCP server supports two authentication modes, mirroring the MINT frontend's authentication pattern.

## Local Development (Default)

For local development, the server uses the same local auth format as the MINT frontend.

### Configuration

```bash
LOCAL_AUTH_ENABLED=True
LOCAL_AUTH_EUA_ID=PSTM  # Your EUA ID
LOCAL_AUTH_JOB_CODES=MINT_ASSESSMENT_NONPROD,MINT_USER_NONPROD
```

### How It Works

When `LOCAL_AUTH_ENABLED=True`, the MintGraphQLClient automatically generates an Authorization header in the format:

```
Authorization: Local {"EUAID":"PSTM","jobCodes":["MINT_ASSESSMENT_NONPROD","MINT_USER_NONPROD"],"favorLocalAuth":true}
```

This matches the frontend's `getAuthHeader()` function in `src/app/Clients/backend.tsx`.

### Backend Handling

The MINT backend's local authentication middleware (`pkg/local/authentication_middleware.go`) parses this header and creates a dev user context with the specified EUA ID and job codes.

### Job Codes

Common non-production job codes:
- `MINT_USER_NONPROD` - Basic MINT user access
- `MINT_ASSESSMENT_NONPROD` - Assessment team access
- `MINT_MAC_NONPROD` - MAC team access
- `MINT_ADMINS_NONPROD` - Admin access

Multiple job codes can be specified as a comma-separated list.

## Production/Deployed Environments

For deployed environments, disable local auth and use JWT Bearer tokens from Okta.

### Configuration

```bash
LOCAL_AUTH_ENABLED=False
AUTH_SERVER_URL=https://test.idp.idm.cms.gov
JWT_ISSUER=https://test.idp.idm.cms.gov
JWT_AUDIENCE=urn:gov:cms:mint:dev
JWT_ALGORITHM=RS256
```

### How It Works

When `LOCAL_AUTH_ENABLED=False`, the server expects JWT Bearer tokens to be passed via the `auth_token` parameter:

```python
result = await client.query(
    query,
    variables={"id": "..."},
    auth_token="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
)
```

The Authorization header will be formatted as:

```
Authorization: Bearer <token>
```

## Testing

### Local Testing

With the default `.env` configuration, the server will automatically use local auth:

```bash
cd mcp
uv run python -m mcpserver.server
```

All GraphQL requests will include the local auth header automatically.

### Testing with Different Users

To test with different EUA IDs or job codes:

```bash
# Test as a different user
LOCAL_AUTH_EUA_ID=ABC1
LOCAL_AUTH_JOB_CODES=MINT_ADMINS_NONPROD

# Or create multiple .env files
cp .env .env.admin
# Edit .env.admin with admin credentials
# Then run with: set -a && source .env.admin && set +a && uv run python -m mcpserver.server
```

### Testing Production Auth

To test JWT authentication locally:

1. Disable local auth:
   ```bash
   LOCAL_AUTH_ENABLED=False
   ```

2. Get a JWT token from a deployed environment (see [GraphQL Playground docs](../../docs/graphql_playground.md))

3. The MCP tools don't currently pass auth tokens, but you can modify `server.py` to pass tokens to queries:
   ```python
   result = await client.query(
       queries.GET_MODEL_PLAN_DETAILS,
       variables={"id": model_plan_id},
       auth_token=os.getenv("JWT_TOKEN")  # Add to .env for testing
   )
   ```

## Implementation Details

### Frontend Pattern

The implementation mimics the frontend's authentication logic from `src/app/Clients/backend.tsx`:

```typescript
export function getAuthHeader(targetUrl: string) {
  // prefer dev auth if it exists
  if (
    window.localStorage[localAuthStorageKey] &&
    JSON.parse(window.localStorage[localAuthStorageKey]).favorLocalAuth
  ) {
    return `Local ${window.localStorage[localAuthStorageKey]}`;
  }

  // Fall back to Okta Bearer token
  if (window.localStorage['okta-token-storage']) {
    const json = JSON.parse(window.localStorage['okta-token-storage']);
    if (json.accessToken) {
      return `Bearer ${json.accessToken.accessToken}`;
    }
  }

  return null;
}
```

### MCP Server Implementation

The MCP server's `MintGraphQLClient._get_auth_header()` method (`mcpserver/mint_client.py`) follows the same pattern:

1. Check if `LOCAL_AUTH_ENABLED` is true
2. If yes, return local auth header with EUA ID and job codes
3. If no, return Bearer token if provided
4. If neither, return None (requests will fail with 401)

## Security Considerations

### Local Development

- Local auth should **only** be used in development environments
- The backend must have `LOCAL_AUTH_ENABLED=true` to accept local auth headers
- Local auth bypasses all Okta authentication checks

### Production

- Always disable local auth in production
- Use JWT tokens from Okta for authentication
- Tokens should be rotated regularly
- Never commit JWT tokens to version control
- Use environment variables or secure secret management for tokens

## Troubleshooting

### 401 Unauthorized

**Symptom:** GraphQL queries return 401 errors

**Possible causes:**
1. Backend not running with `LOCAL_AUTH_ENABLED=true`
2. Invalid EUA ID or job codes
3. MCP server configured for JWT but no token provided

**Solution:**
- Verify backend is running in local mode
- Check MCP server `.env` has `LOCAL_AUTH_ENABLED=True`
- Verify EUA ID and job codes are valid

### 422 Unprocessable Entity

**Symptom:** GraphQL queries return 422 errors

**Possible causes:**
1. Invalid GraphQL query syntax
2. Query validation errors
3. Missing required variables

**Solution:**
- Verify query syntax with GraphQL playground
- Check that all required variables are provided
- Enable GraphQL validation (see [GRAPHQL_VALIDATION.md](../GRAPHQL_VALIDATION.md))

### Missing Auth Header

**Symptom:** Backend logs show "No local auth header present"

**Possible causes:**
1. `LOCAL_AUTH_ENABLED` is false but no JWT token provided
2. Auth header not being sent correctly

**Solution:**
- Check MCP server `.env` configuration
- Verify `_get_auth_header()` is being called
- Add debug logging to see what header is being sent

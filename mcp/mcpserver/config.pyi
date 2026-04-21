"""Configuration management for MINT MCP Server."""

def str2bool(v: str) -> bool: ...

# Application Configuration
APP_VERSION: str
APP_HOST: str
APP_PORT: int
APP_RELOAD: bool
APP_WORKERS: int

# Logging Configuration
LOG_LEVEL: str

# Authentication Configuration
AUTH_SERVER_URL: str
JWT_ISSUER: str
JWT_AUDIENCE: str
JWT_ALGORITHM: str

# MINT Integration
MINT_GRAPHQL_URL: str

# Langfuse Configuration
LANGFUSE_PUBLIC_KEY: str
LANGFUSE_PRIVATE_KEY: str
LANGFUSE_HOST: str
LANGFUSE_ENABLED: bool

"""Configuration management for MINT MCP Server."""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


def str2bool(v: str) -> bool:
    """Convert string to boolean."""
    return v.lower() in ("yes", "true", "t", "1")


# Application Configuration
APP_VERSION = os.getenv("APP_VERSION", "0.1.0")
APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
APP_PORT = int(os.getenv("APP_PORT", "5554"))
APP_RELOAD = str2bool(os.getenv("APP_RELOAD", "False"))
APP_WORKERS = int(os.getenv("APP_WORKERS", "1"))

# Logging Configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
if LOG_LEVEL not in ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]:
    LOG_LEVEL = "INFO"

# Authentication Configuration
AUTH_SERVER_URL = os.getenv("AUTH_SERVER_URL", "https://test.idp.idm.cms.gov")
JWT_ISSUER = os.getenv("JWT_ISSUER", "https://test.idp.idm.cms.gov")
JWT_AUDIENCE = os.getenv("JWT_AUDIENCE", "urn:gov:cms:mint:dev")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "RS256")

# MINT Integration
MINT_GRAPHQL_URL = os.getenv("MINT_GRAPHQL_URL", "http://localhost:8080/api/graph/query")

# Langfuse Configuration (optional)
LANGFUSE_PUBLIC_KEY = os.getenv("LANGFUSE_PUBLIC_KEY", "")
LANGFUSE_PRIVATE_KEY = os.getenv("LANGFUSE_PRIVATE_KEY", "")
LANGFUSE_HOST = os.getenv("LANGFUSE_HOST", "https://chat.cms.gov:3000")

# Determine if Langfuse is enabled
LANGFUSE_ENABLED = bool(LANGFUSE_PUBLIC_KEY and LANGFUSE_PRIVATE_KEY)

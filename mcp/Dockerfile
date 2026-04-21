FROM python:3.12-alpine

# Install system dependencies
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy MCP server files
COPY mcp/ /app/

# Install UV and Python dependencies
RUN pip install --no-cache-dir --upgrade pip uv && \
    uv sync --frozen

# Expose MCP server port
EXPOSE 5554

# Run the MCP server
CMD ["uv", "run", "python", "-m", "mcpserver.server"]

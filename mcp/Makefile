.PHONY: help install setup start stop start-docker start-openwebui stop-all inspector logs logs-docker logs-openwebui status clean clean-volumes test

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

##@ General

help: ## Display this help message
	@echo "$(BLUE)MINT MCP Server - Available Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""

##@ Setup & Installation

install: ## Install UV and project dependencies
	@echo "$(BLUE)📦 Installing UV and dependencies...$(NC)"
	@if ! command -v uv &> /dev/null; then \
		echo "$(YELLOW)Installing UV...$(NC)"; \
		curl -LsSf https://astral.sh/uv/install.sh | sh; \
	fi
	@uv sync
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)Creating .env from .env.example...$(NC)"; \
		cp .env.example .env; \
		echo "$(GREEN)✅ .env file created. Update it with your settings.$(NC)"; \
	fi
	@echo "$(GREEN)✅ Installation complete$(NC)"

setup: install ## Alias for install

##@ Running the Server

start: stop-all ## Start MCP server on host (for development)
	@echo "$(BLUE)🚀 Starting MINT MCP Server on host...$(NC)"
	@if [ ! -f ".env" ]; then \
		echo "$(YELLOW)⚠️  Warning: .env file not found. Using defaults$(NC)"; \
	fi
	@uv run python -m mcpserver.server

start-docker: stop-all ## Start MCP server in Docker (without Open WebUI)
	@echo "$(BLUE)🚀 Starting MINT MCP Server in Docker...$(NC)"
	@docker compose up -d mcp-server
	@sleep 3
	@$(MAKE) status-docker
	@echo ""
	@echo "$(GREEN)======================================"
	@echo "📡 MCP Endpoint: http://localhost:5554/mcp"
	@echo "🔍 Test with: make inspector"
	@echo "📋 View logs: make logs-docker"
	@echo "🛑 Stop: make stop"
	@echo "======================================$(NC)"

start-openwebui: stop-all ## Start MCP server + Open WebUI in Docker
	@echo "$(BLUE)🚀 Starting MINT MCP Server and Open WebUI...$(NC)"
	@docker compose up -d
	@sleep 3
	@$(MAKE) status
	@echo ""
	@echo "$(GREEN)======================================"
	@echo "📡 MCP Server: http://localhost:5554/mcp"
	@echo "🌐 Open WebUI: http://localhost:3000"
	@echo "📋 View logs: make logs-openwebui"
	@echo "🛑 Stop: make stop"
	@echo "======================================$(NC)"

##@ Stopping the Server

stop: ## Stop Docker containers
	@echo "$(BLUE)🛑 Stopping Docker containers...$(NC)"
	@docker compose down 2>/dev/null || echo "No containers running"
	@echo "$(GREEN)✅ Docker containers stopped$(NC)"

stop-all: ## Stop ALL instances (Docker + host processes on port 5554)
	@echo "$(BLUE)🛑 Stopping all MCP Server instances...$(NC)"
	@docker compose down 2>/dev/null || true
	@lsof -ti:5554 | xargs kill -9 2>/dev/null || true
	@echo "$(GREEN)✅ All instances stopped$(NC)"

##@ Development & Debugging

inspector: ## Open MCP Inspector for testing the server
	@echo "$(BLUE)🔍 Starting MCP Inspector...$(NC)"
	@echo "$(YELLOW)Make sure the MCP server is running first!$(NC)"
	@npx @modelcontextprotocol/inspector http://localhost:5554/mcp

logs: logs-docker ## Show MCP server logs (Docker)

logs-docker: ## Show MCP server logs (Docker only)
	@docker compose logs -f mcp-server

logs-openwebui: ## Show all service logs (MCP + Open WebUI)
	@docker compose logs -f

status: ## Show status of all Docker services
	@echo "$(BLUE)Service Status:$(NC)"
	@docker compose ps

status-docker: ## Show status of MCP server container
	@echo "$(BLUE)MCP Server Status:$(NC)"
	@docker compose ps mcp-server

test-connection: ## Test connection to MCP server
	@echo "$(BLUE)Testing MCP server connection...$(NC)"
	@curl -s http://localhost:5554/mcp -m 2 && echo "$(GREEN)✅ Server is responding$(NC)" || echo "$(RED)❌ Server is not responding$(NC)"

##@ Cleanup

clean: stop ## Stop containers and clean up
	@echo "$(BLUE)🧹 Cleaning up...$(NC)"
	@docker compose down
	@echo "$(GREEN)✅ Cleanup complete$(NC)"

clean-volumes: stop ## Stop containers and remove volumes (full reset)
	@echo "$(BLUE)🧹 Cleaning up with volumes...$(NC)"
	@docker compose down -v
	@echo "$(GREEN)✅ Full cleanup complete$(NC)"

clean-all: clean-volumes ## Remove everything including Python cache
	@echo "$(BLUE)🧹 Deep clean...$(NC)"
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo "$(GREEN)✅ Deep clean complete$(NC)"

##@ Quick Actions

dev: start ## Alias for 'start' (run on host for development)

docker: start-docker ## Alias for 'start-docker'

webui: start-openwebui ## Alias for 'start-openwebui'

restart: stop start-docker ## Restart MCP server in Docker

restart-all: stop start-openwebui ## Restart all services

check: test-connection ## Alias for 'test-connection'

"""Tests for MCP server tools."""

import pytest
from unittest.mock import AsyncMock, patch

from mcpserver.server import (
    get_model_plan_details,
    get_model_plan_timeline,
    list_model_collaborators,
    search_model_plans,
)


@pytest.mark.asyncio
async def test_get_model_plan_details_success():
    """Test successful retrieval of model plan details."""
    mock_response = {
        "modelPlan": {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "modelName": "Test Model",
            "abbreviation": "TM",
            "status": "ACTIVE",
        }
    }

    with patch("mcpserver.server.get_mint_client") as mock_client:
        mock_instance = AsyncMock()
        mock_instance.query = AsyncMock(return_value=mock_response)
        mock_client.return_value = mock_instance

        result = await get_model_plan_details("123e4567-e89b-12d3-a456-426614174000")

        assert result["id"] == "123e4567-e89b-12d3-a456-426614174000"
        assert result["modelName"] == "Test Model"
        assert result["status"] == "ACTIVE"


@pytest.mark.asyncio
async def test_get_model_plan_details_error():
    """Test error handling in get_model_plan_details."""
    mock_response = {"error": "Model plan not found"}

    with patch("mcpserver.server.get_mint_client") as mock_client:
        mock_instance = AsyncMock()
        mock_instance.query = AsyncMock(return_value=mock_response)
        mock_client.return_value = mock_instance

        result = await get_model_plan_details("invalid-id")

        assert "error" in result


@pytest.mark.asyncio
async def test_search_model_plans_with_filter():
    """Test searching model plans with status filter."""
    mock_response = {
        "modelPlanCollection": [
            {"id": "1", "modelName": "Model 1", "status": "ACTIVE"},
            {"id": "2", "modelName": "Model 2", "status": "PAUSED"},
            {"id": "3", "modelName": "Model 3", "status": "ACTIVE"},
        ]
    }

    with patch("mcpserver.server.get_mint_client") as mock_client:
        mock_instance = AsyncMock()
        mock_instance.query = AsyncMock(return_value=mock_response)
        mock_client.return_value = mock_instance

        result = await search_model_plans(status_filter="ACTIVE", limit=10)

        assert len(result) == 2
        assert all(plan["status"] == "ACTIVE" for plan in result)


@pytest.mark.asyncio
async def test_search_model_plans_limit():
    """Test that search respects the limit parameter."""
    mock_response = {
        "modelPlanCollection": [
            {"id": str(i), "modelName": f"Model {i}", "status": "ACTIVE"}
            for i in range(20)
        ]
    }

    with patch("mcpserver.server.get_mint_client") as mock_client:
        mock_instance = AsyncMock()
        mock_instance.query = AsyncMock(return_value=mock_response)
        mock_client.return_value = mock_instance

        result = await search_model_plans(limit=5)

        assert len(result) == 5

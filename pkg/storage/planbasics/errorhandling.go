package planbasics

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

const (
	modelTypeName = "Plan Basics"
)

func HandlePlanBasicsCreationError(logger *zap.Logger, plan *models.PlanBasics, err error) (*models.PlanBasics, error) {
	logger.Error(
		fmt.Sprint("Failed to create model [#{modelTypeName}] with error: #{err}", modelTypeName, err),
		zap.String("user", models.ValueOrEmpty(plan.ModifiedBy)),
	)

	return nil, err
}

func HandlePlanBasicsUpdateError(logger *zap.Logger, plan *models.PlanBasics, err error, isQueryError bool) (*models.PlanBasics, error) {
	logger.Error(
		fmt.Sprint("Failed to update #{modelTypeName} due to error: #{err}", modelTypeName, err),
		zap.String("id", plan.ID.String()),
		zap.String("user", models.ValueOrEmpty(plan.ModifiedBy)),
	)

	if !isQueryError {
		return nil, err
	} else {
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     plan,
			Operation: apperrors.QueryUpdate,
		}
	}
}

func HandleModelFetchError(logger *zap.Logger, id uuid.UUID, err error) (*models.PlanBasics, error) {
	if errors.Is(err, sql.ErrNoRows) {
		return HandleModelFetchNoRowsError(logger, id, err)
	}

	return HandleModelFetchGenericError(logger, id, err)
}

func HandleModelFetchNoRowsError(logger *zap.Logger, id uuid.UUID, err error) (*models.PlanBasics, error) {
	logger.Info(
		"No model plan found",
		zap.Error(err),
		zap.String("id", id.String()),
	)
	// return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.ModelPlan{}}
	//TODO decision is to not present an error if no model row found for this
	return nil, nil
}

func HandleModelFetchGenericError(logger *zap.Logger, id uuid.UUID, err error) (*models.PlanBasics, error) {
	logger.Error(
		"Failed to fetch model plan",
		zap.Error(err),
		zap.String("id", id.String()),
	)

	return nil, &apperrors.QueryError{
		Err:       err,
		Model:     id,
		Operation: apperrors.QueryFetch,
	}
}

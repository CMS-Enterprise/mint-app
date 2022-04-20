package genericmodel

import (
	"database/sql"
	"errors"
	"fmt"
	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func HandleModelCreationError(logger *zap.Logger, err error, model models.BaseModel) error {
	logger.Error(
		fmt.Sprintf("Failed to create model [%v] with error: %v", model.GetModelTypeName(), err),
		zap.String("user", models.ValueOrEmpty(model.GetModifiedBy())),
	)

	return err
}

func logModelUpdateError(logger *zap.Logger, model models.BaseModel) {
	logger.Error(
		fmt.Sprintf("Failed to update #{modelTypeName} due to error: #{err}"),
		zap.String("id", model.GetPlanID().String()),
		zap.String("user", models.ValueOrEmpty(model.GetModifiedBy())),
	)
}

func HandleModelUpdateError(logger *zap.Logger, err error, model models.BaseModel) error {
	logModelUpdateError(logger, model)
	return err
}

func HandleModelQueryError(logger *zap.Logger, err error, model models.BaseModel) error {
	logModelUpdateError(logger, model)
	return createQueryError(err, model)
}

func createQueryError(err error, model models.BaseModel) error {
	return &apperrors.QueryError{
		Err:       err,
		Model:     model,
		Operation: apperrors.QueryUpdate,
	}
}

func HandleModelFetchByIDError(logger *zap.Logger, err error, id uuid.UUID) error {
	if errors.Is(err, sql.ErrNoRows) {
		return HandleModelFetchByIDNoRowsError(logger, err, id)
	}

	return HandleModelFetchGenericError(logger, err, id)
}

func HandleModelFetchByIDNoRowsError(logger *zap.Logger, err error, id uuid.UUID) error {
	logger.Info(
		"No model plan found",
		zap.Error(err),
		zap.String("id", id.String()),
	)

	return nil
}

func HandleModelFetchGenericError(logger *zap.Logger, err error, id uuid.UUID) error {
	logger.Error(
		"Failed to fetch model plan",
		zap.Error(err),
		zap.String("id", id.String()),
	)

	return &apperrors.QueryError{
		Err:       err,
		Model:     id,
		Operation: apperrors.QueryFetch,
	}
}

func HandleModelDeleteByIDError(logger *zap.Logger, err error, id uuid.UUID) error {
	logger.Error(
		"Failed to delete model by ID",
		zap.Error(err),
		zap.String("id", id.String()),
	)

	return &apperrors.QueryError{
		Err:       err,
		Model:     id,
		Operation: apperrors.QueryDelete,
	}
}

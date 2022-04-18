package genericmodel

import (
	"database/sql"
	"errors"
	"fmt"
	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"
	"go.uber.org/zap"
)

func HandleModelCreationError(logger *zap.Logger, err error, model models.BaseModel) (models.BaseModel, error) {
	logger.Error(
		fmt.Sprintf("Failed to create model [#{model.GetModelTypeName()}] with error: #{err}"),
		zap.String("user", model.GetModifiedBy().ValueOrZero()),
	)

	return nil, err
}

func logModelUpdateError(logger *zap.Logger, model models.BaseModel) {
	logger.Error(
		fmt.Sprintf("Failed to update #{modelTypeName} due to error: #{err}"),
		zap.String("id", model.GetPlanID().String()),
		zap.String("user", model.GetModifiedBy().ValueOrZero()),
	)
}

func HandleModelUpdateError(logger *zap.Logger, err error, model models.BaseModel) (models.BaseModel, error) {
	logModelUpdateError(logger, model)
	return nil, err
}

func HandleModelQueryError(logger *zap.Logger, err error, model models.BaseModel) (models.BaseModel, error) {
	logModelUpdateError(logger, model)
	return createQueryError(err, model)
}

func createQueryError(err error, model models.BaseModel) (models.BaseModel, error) {
	return nil, &apperrors.QueryError{
		Err:       err,
		Model:     model,
		Operation: apperrors.QueryUpdate,
	}
}

func HandleModelFetchError(logger *zap.Logger, err error, model models.BaseModel) (models.BaseModel, error) {
	if errors.Is(err, sql.ErrNoRows) {
		return HandleModelFetchNoRowsError(logger, err, model)
	}

	return HandleModelFetchGenericError(logger, err, model)
}

func HandleModelFetchNoRowsError(logger *zap.Logger, err error, model models.BaseModel) (models.BaseModel, error) {
	logger.Info(
		"No model plan found",
		zap.Error(err),
		zap.String("id", model.GetPlanID().String()),
	)
	return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: model}
}

func HandleModelFetchGenericError(logger *zap.Logger, err error, model models.BaseModel) (models.BaseModel, error) {
	logger.Error(
		"Failed to fetch model plan",
		zap.Error(err),
		zap.String("id", model.GetPlanID().String()),
	)

	return nil, &apperrors.QueryError{
		Err:       err,
		Model:     model,
		Operation: apperrors.QueryFetch,
	}
}

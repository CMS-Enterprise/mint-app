package genericmodel

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/apperrors"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// HandleModelCreationError handles errors from creating a model
func HandleModelCreationError(logger *zap.Logger, err error, model models.IBaseStruct) error {
	logger.Error(
		fmt.Sprintf("Failed to create model [%T] with error: %T", model, err),
		zap.String("user", model.GetCreatedBy()),
	)

	return err
}

func logModelUpdateError(logger *zap.Logger, err error, model models.IBaseStruct) {
	logger.Error(
		fmt.Sprintf("Failed to update %T due to error: %T", model, err),
		zap.Error(err),
		zap.String("id", model.GetID().String()),
		zap.String("user", models.ValueOrEmpty(model.GetModifiedBy())),
	)
}

// HandleModelUpdateError handles errors from updating a model
func HandleModelUpdateError(logger *zap.Logger, err error, model models.IBaseStruct) error {
	logModelUpdateError(logger, err, model)
	return err
}

// HandleModelQueryError handles errors from querying a model
func HandleModelQueryError(logger *zap.Logger, err error, model models.IBaseStruct) error {
	logModelUpdateError(logger, err, model)
	return createQueryError(err, model)
}

func createQueryError(err error, model models.IBaseStruct) error {
	return &apperrors.QueryError{
		Err:       err,
		Model:     model,
		Operation: apperrors.QueryUpdate,
	}
}

// HandleModelFetchByIDNoRowsError handles an errors when there's no results from a query by ID
func HandleModelFetchByIDNoRowsError(logger *zap.Logger, err error, id uuid.UUID) error {
	logger.Info(
		fmt.Sprintf("No model found with ID[%v]", id.String()),
		zap.Error(err),
		zap.String("id", id.String()),
	)

	return nil
}

// HandleModelFetchGenericError handles a generic errors from a model being fetched by ID
func HandleModelFetchGenericError(logger *zap.Logger, err error, id uuid.UUID) error {
	logger.Error(
		"Failed to fetch model",
		zap.Error(err),
		zap.String("id", id.String()),
	)

	return &apperrors.QueryError{
		Err:       err,
		Model:     id,
		Operation: apperrors.QueryFetch,
	}
}

// HandleModelDeleteByIDError handles errors from a model being deleted by ID
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

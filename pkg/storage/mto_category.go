package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOCategoryGetByModelPlanIDLoader returns the plan basics for a slice of model plan ids
func MTOCategoryGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.MTOCategory, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCategory](np, sqlqueries.MTOCategory.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOCategoryGetByParentIDLoader returns the plan basics for a slice of model plan ids
func MTOCategoryGetByParentIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, parentIDs []uuid.UUID) ([]*models.MTOCategory, error) {

	args := map[string]interface{}{
		"parent_ids": pq.Array(parentIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCategory](np, sqlqueries.MTOCategory.GetByParentIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOCategoryCreate creates a new MTOCategory in the database
func MTOCategoryCreate(np sqlutils.NamedPreparer, _ *zap.Logger, MTOCategory *models.MTOCategory) (*models.MTOCategory, error) {
	if MTOCategory.ID == uuid.Nil {
		MTOCategory.ID = uuid.New()
	}

	returned, procErr := sqlutils.GetProcedure[models.MTOCategory](np, sqlqueries.MTOCategory.Create, MTOCategory)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new MTOCategory object: %w", procErr)
	}
	return returned, nil
}

// MTOCategoryUpdate updates a new MTOCategory in the database
func MTOCategoryUpdate(np sqlutils.NamedPreparer, _ *zap.Logger, MTOCategory *models.MTOCategory) (*models.MTOCategory, error) {
	returned, procErr := sqlutils.GetProcedure[models.MTOCategory](np, sqlqueries.MTOCategory.Update, MTOCategory)
	if procErr != nil {
		return nil, fmt.Errorf("issue updating MTOCategory object: %w", procErr)
	}
	return returned, nil
}

// MTOCategoryGetByID returns an existing MTOCategory from the database
func MTOCategoryGetByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.MTOCategory, error) {

	arg := map[string]interface{}{"id": id}

	returned, procErr := sqlutils.GetProcedure[models.MTOCategory](np, sqlqueries.MTOCategory.GetByID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue retrieving MTOCategory: %w", procErr)
	}

	return returned, nil
}

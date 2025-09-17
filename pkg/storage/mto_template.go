package storage

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOTemplateGetByIDLoader returns templates by ID
func MTOTemplateGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOTemplate, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplate](np, sqlqueries.MTOTemplate.GetByIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}

// MTOTemplateGetByModelPlanIDLoader returns all templates associated with a model plan ID
func MTOTemplateGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.MTOTemplate, error) {
	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplate](np, sqlqueries.MTOTemplate.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOTemplateGetByKeyLoader returns templates by template key
func MTOTemplateGetByKeyLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []models.MTOTemplateKey) ([]*models.MTOTemplate, error) {
	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplate](np, sqlqueries.MTOTemplate.GetByKeyLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOTemplateGetAllLoader returns all templates
func MTOTemplateGetAllLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.MTOTemplate, error) {
	returned, err := sqlutils.SelectProcedure[models.MTOTemplate](np, sqlqueries.MTOTemplate.GetAll, nil)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

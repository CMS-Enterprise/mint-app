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

// MTOInfoGetByIDOrModelPlanIDLoader returns all mto info records for a slice of model plan ids
func MTOInfoGetByIDOrModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.MTOInfo, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOInfo](np, sqlqueries.MTOInfo.GetByIDOrModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOInfoCreate creates a new MTOInfo in the database
func MTOInfoCreate(np sqlutils.NamedPreparer, _ *zap.Logger, MTOInfo *models.MTOInfo) (*models.MTOInfo, error) {
	if MTOInfo.ID == uuid.Nil {
		MTOInfo.ID = uuid.New()
	}

	returned, procErr := sqlutils.GetProcedure[models.MTOInfo](np, sqlqueries.MTOInfo.Create, MTOInfo)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new MTOInfo object: %w", procErr)
	}
	return returned, nil
}

// MTOInfoUpdate updates a new MTOInfo in the database
func MTOInfoUpdate(np sqlutils.NamedPreparer, _ *zap.Logger, MTOInfo *models.MTOInfo) (*models.MTOInfo, error) {
	returned, procErr := sqlutils.GetProcedure[models.MTOInfo](np, sqlqueries.MTOInfo.Update, MTOInfo)
	if procErr != nil {
		return nil, fmt.Errorf("issue updating MTOInfo object: %w", procErr)
	}
	return returned, nil
}

package storage

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOCommonMilestoneGetByModelPlanIDLoader returns all common milestones, with the context of the model plan id to determine if it was added or not
// if model plan id is null, contextual data will show up as false (is_added, is_suggested)
func MTOCommonMilestoneGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.MTOCommonMilestone, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonMilestone](np, sqlqueries.MTOCommonMilestone.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOCommonMilestoneGetByKeyLoader returns all common milestones for a slice of milestone keys
func MTOCommonMilestoneGetByKeyLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []models.MTOCommonMilestoneKey) ([]*models.MTOCommonMilestone, error) {

	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonMilestone](np, sqlqueries.MTOCommonMilestone.GetByKeyLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

package storage

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOCommonMilestoneGetByModelPlanIDLoader returns all top level categories for a slice of model plan ids
func MTOCommonMilestoneGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []*uuid.UUID) ([]*models.MTOCommonMilestone, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonMilestone](np, sqlqueries.MTOCommonMilestone.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

package storage

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOCommonSolutionGetByModelPlanIDLoader returns all common solutions, with the context of the model plan id to determine if it was added or not
// if model plan id is null, contextual data will show up as false (is_added, is_suggested)
func MTOCommonSolutionGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.MTOCommonSolution, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolution](np, sqlqueries.MTOCommonSolution.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOCommonSolutionGetByKeyLoader returns all Common Solutions associated by a list of keys
func MTOCommonSolutionGetByKeyLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []models.MTOCommonSolutionKey) ([]*models.MTOCommonSolution, error) {

	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolution](np, sqlqueries.MTOCommonSolution.GetByKeyLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOCommonSolutionGetByCommonMilestoneKeyLoader returns all common solutions associated with a Common Milestone Key
func MTOCommonSolutionGetByCommonMilestoneKeyLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []models.MTOCommonMilestoneKey) ([]*models.MTOCommonSolution, error) {

	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolution](np, sqlqueries.MTOCommonSolution.GetByCommonMilestoneKeyLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

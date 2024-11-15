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

// MTOSolutionGetByIDLoader returns solutions by ID
// TODO: This function is not technically loader specific, we will revisit this during a design pass before merging
func MTOSolutionGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOSolution, error) {
	args := map[string]interface{}{
		"ids": ids,
	}

	return sqlutils.SelectProcedure[models.MTOSolution](np, sqlqueries.MTOSolution.GetByIDLoader, args)
}

// MTOSolutionGetByModelPlanIDLoader returns all solutions, with the context of the model plan id to determine if it was added or not
// if model plan id is null, contextual data will show up as false (is_added, is_suggested)
func MTOSolutionGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.MTOSolution, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOSolution](np, sqlqueries.MTOSolution.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOSolutionGetByKeyLoader returns all solutions associated by a list of keys
func MTOSolutionGetByKeyLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []models.MTOCommonSolutionKey) ([]*models.MTOSolution, error) {

	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOSolution](np, sqlqueries.MTOCommonSolution.GetByKeyLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOSolutionGetByCommonMilestoneKeyLoader returns all solutions associated with a Common Milestone Key
func MTOSolutionGetByCommonMilestoneKeyLoader(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	keys []models.MTOCommonMilestoneKey,
) ([]*models.MTOCommonSolution, error) {

	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolution](np, sqlqueries.MTOCommonSolution.GetByCommonMilestoneKeyLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOSolutionCreate creates a new MTOSolution in the database
func MTOSolutionCreate(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	mtoSolution *models.MTOSolution,
) (*models.MTOSolution, error) {
	if mtoSolution.ID == uuid.Nil {
		mtoSolution.ID = uuid.New()
	}

	returned, procErr := sqlutils.GetProcedure[models.MTOSolution](np, sqlqueries.MTOSolution.Create, mtoSolution)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new MTOSolution object: %w", procErr)
	}
	return returned, nil
}

// MTOSolutionUpdate updates a new MTOSolution in the database
func MTOSolutionUpdate(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	mtoSolution *models.MTOSolution,
) (*models.MTOSolution, error) {
	returned, procErr := sqlutils.GetProcedure[models.MTOSolution](np, sqlqueries.MTOSolution.Update, mtoSolution)
	if procErr != nil {
		return nil, fmt.Errorf("issue updating MTOSolution object: %w", procErr)
	}
	return returned, nil
}

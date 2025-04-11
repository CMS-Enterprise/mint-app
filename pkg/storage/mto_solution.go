package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOSolutionGetByIDLoader returns solutions by ID
func MTOSolutionGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOSolution, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOSolution](np, sqlqueries.MTOSolution.GetByIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
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

// MTOSolutionGetByModelPlanIDAndFilterViewLoader returns all solutions associated with a model plan id and filter view
func MTOSolutionGetByModelPlanIDAndFilterViewLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []MTOSolutionByModelPlanIDAndFilterViewKey) ([]*models.MTOSolutionWithModelFilterView, error) {
	jsonParam, err := models.StructArrayToJSONArray(keys)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"paramTableJSON": jsonParam,
	}

	returned, err := sqlutils.SelectProcedure[models.MTOSolutionWithModelFilterView](np, sqlqueries.MTOSolution.GetByModelPlanIDAndFilterViewLoader, arg)
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

// MTOSolutionCreateAllowConflicts creates a new MTOSolution in the database, but
// in the case of a conflict, instead just returns the conflicting row (and doesn't return an error)
// TODO: Batch insert these solutions
func MTOSolutionCreateAllowConflicts(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	mtoSolution *models.MTOSolution,
) (*models.MTOSolution, error) {
	if mtoSolution.ID == uuid.Nil {
		mtoSolution.ID = uuid.New()
	}

	returned, procErr := sqlutils.GetProcedure[models.MTOSolution](
		np,
		sqlqueries.MTOSolution.CreateAllowConflicts,
		mtoSolution,
	)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new MTOSolution object (MTOSolutionCreateAllowConflicts): %w", procErr)
	}
	return returned, nil
}

// MTOSolutionCreateCommonAllowConflictsSQL takes a list of common solution keys for a model plan id, and inserts ones that don't exist
// it will return existing data, or newly inserted data
func MTOSolutionCreateCommonAllowConflictsSQL(
	tx *sqlx.Tx,
	_ *zap.Logger,
	commonSolutionKeys []models.MTOCommonSolutionKey,
	modelPlanID uuid.UUID,
	createdBy uuid.UUID,
) ([]*models.MTOSolutionWithNewlyInsertedStatus, error) {

	// Since this can delete and insert, we need to set the session user variable so that the audit trigger knows who made the delete operation
	err := setCurrentSessionUserVariable(tx, createdBy)
	if err != nil {
		return nil, err
	}
	args := map[string]interface{}{
		"model_plan_id":        modelPlanID,
		"common_solution_keys": pq.Array(commonSolutionKeys),
		"created_by":           createdBy,
	}
	returned, err := sqlutils.SelectProcedure[models.MTOSolutionWithNewlyInsertedStatus](tx, sqlqueries.MTOSolution.CreateCommonSolutionsAllowConflicts, args)
	if err != nil {
		return nil, err
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

func MTOSolutionGetByMilestoneIDLoader(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	milestoneIDs []uuid.UUID,
) ([]*models.MTOSolutionWithMilestoneID, error) {
	args := map[string]interface{}{
		"milestone_ids": pq.Array(milestoneIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOSolutionWithMilestoneID](np, sqlqueries.MTOSolution.GetByMilestoneIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func MTOSolutionDelete(tx *sqlx.Tx, actorUserID uuid.UUID, _ *zap.Logger, milestoneID uuid.UUID) error {
	// We need to set the session user variable so that the audit trigger knows who made the delete operation
	err := setCurrentSessionUserVariable(tx, actorUserID)
	if err != nil {
		return err
	}
	// Delete the milestone!
	// `ON CASCADE` functionality will delete any Milestone<->Solution links, if present
	arg := map[string]interface{}{"id": milestoneID}
	procErr := sqlutils.ExecProcedure(tx, sqlqueries.MTOSolution.Delete, arg)
	if procErr != nil {
		return fmt.Errorf("issue deleting MTOMilestone object: %w", procErr)
	}
	return nil
}

package storage

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage/genericmodel"
)

// PlanTaskGetByModelPlanIDs returns all plan tasks for a slice of model plan IDs. It backs the
// ByModelPlanID dataloader (see storage/loaders/plan_task_loader.go) exclusively - callers that
// need a single task by (modelPlanID, key), including those running inside a DB transaction that
// can't safely use the request-scoped dataloader, should use
// PlanTaskGetByModelPlanIDAndKey instead.
func PlanTaskGetByModelPlanIDs(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	modelPlanIDs []uuid.UUID,
) ([]*models.PlanTask, error) {
	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}

	return sqlutils.SelectProcedure[models.PlanTask](np, sqlqueries.PlanTask.GetByModelPlanIDLoader, args)
}

// PlanTaskGetByIDLoader returns plan tasks for a slice of task IDs
func PlanTaskGetByIDLoader(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	ids []uuid.UUID,
) ([]*models.PlanTask, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}

	return sqlutils.SelectProcedure[models.PlanTask](np, sqlqueries.PlanTask.GetByIDLoader, args)
}

// PlanTaskGetByModelPlanIDAndKey returns the plan task for a specific (modelPlanID, key) pair, or
// nil if none exists. Unlike PlanTaskGetByModelPlanIDs, this filters in SQL rather than fetching
// every task for the plan and scanning for the key in Go.
func PlanTaskGetByModelPlanIDAndKey(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	modelPlanID uuid.UUID,
	key models.PlanTaskKey,
) (*models.PlanTask, error) {
	args := map[string]interface{}{
		"model_plan_id": modelPlanID,
		"key":           key,
	}

	task, err := sqlutils.GetProcedure[models.PlanTask](np, sqlqueries.PlanTask.GetByModelPlanIDAndKey, args)
	if err != nil {
		if sqlutils.IsNoRowsResult(err) {
			return nil, nil
		}
		return nil, err
	}

	return task, nil
}

// PlanTaskUpdateStateByKey sets a plan task's state and completion metadata (identified by
// modelPlanID + key, rather than a pre-fetched row) in a single conditional update, attributing
// the change to modifiedBy. It returns (nil, nil) - a no-op, not an error - if the task was
// already at the target state and completion metadata, or if it doesn't exist for this model
// plan; callers that need to distinguish "doesn't exist" from "no-op" should follow up with
// PlanTaskGetByModelPlanIDAndKey in that case.
func PlanTaskUpdateStateByKey(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	modelPlanID uuid.UUID,
	key models.PlanTaskKey,
	newState models.PlanTaskState,
	completedBy *uuid.UUID,
	completedDts *time.Time,
	modifiedBy uuid.UUID,
) (*models.PlanTaskWithPreviousState, error) {
	args := map[string]interface{}{
		"model_plan_id":      modelPlanID,
		"key":                key,
		"state":              newState,
		"completed_by":       completedBy,
		"completed_dts":      completedDts,
		"modified_by":        modifiedBy,
		"target_is_complete": newState == models.PlanTaskStateComplete,
	}

	result, err := sqlutils.GetProcedure[models.PlanTaskWithPreviousState](np, sqlqueries.PlanTask.UpdateStateByKey, args)
	if err != nil {
		if sqlutils.IsNoRowsResult(err) {
			return nil, nil
		}
		return nil, err
	}

	return result, nil
}

// PlanTaskActivateUpcoming moves a plan task from UPCOMING to TO_DO in a single conditional
// update, attributing the change to modifiedBy. It returns nil if the task wasn't currently
// UPCOMING (already activated, has otherwise progressed, or doesn't exist), which is a no-op
// rather than an error.
func PlanTaskActivateUpcoming(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	modelPlanID uuid.UUID,
	key models.PlanTaskKey,
	modifiedBy uuid.UUID,
) (*models.PlanTask, error) {
	args := map[string]interface{}{
		"model_plan_id": modelPlanID,
		"key":           key,
		"modified_by":   modifiedBy,
	}

	task, err := sqlutils.GetProcedure[models.PlanTask](np, sqlqueries.PlanTask.ActivateUpcoming, args)
	if err != nil {
		if sqlutils.IsNoRowsResult(err) {
			return nil, nil
		}
		return nil, err
	}

	return task, nil
}

// PlanTaskCreate creates a new plan task (used when a model plan is created)
func PlanTaskCreate(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	task *models.PlanTask,
) (*models.PlanTask, error) {
	task.ID = utilityuuid.ValueOrNewUUID(task.ID)

	retTask, err := sqlutils.GetProcedure[models.PlanTask](np, sqlqueries.PlanTask.Create, task)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, task)
	}

	return retTask, nil
}

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

// PlanTaskGetByModelPlanIDs returns all plan tasks for a slice of model plan IDs. It's a plain,
// uncached store query - despite backing the ByModelPlanID dataloader (see
// storage/loaders/plan_task_loader.go), it's also called directly by callers running inside a DB
// transaction (see updatePlanTaskStateByKey), which can't safely use the request-scoped dataloader
// since it isn't transaction-aware.
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

// planTaskUpdateStateByKeyRow is the RETURNING shape of update_state_by_key.sql: the updated task
// plus the state it had immediately before this update, so the caller can tell whether a
// transition actually occurred without a separate read.
type planTaskUpdateStateByKeyRow struct {
	models.PlanTask
	PreviousState models.PlanTaskState `db:"previous_state"`
}

// PlanTaskUpdateStateByKeyResult carries the outcome of PlanTaskUpdateStateByKey.
type PlanTaskUpdateStateByKeyResult struct {
	Task          *models.PlanTask
	PreviousState models.PlanTaskState
}

// PlanTaskUpdateStateByKey sets a plan task's state and completion metadata (identified by
// modelPlanID + key, rather than a pre-fetched row) in a single conditional update, attributing
// the change to modifiedBy. It returns (nil, nil) - a no-op, not an error - if the task was
// already at the target state and completion metadata, or if it doesn't exist for this model
// plan; callers that need to distinguish "doesn't exist" from "no-op" should follow up with a
// plain lookup in that case.
func PlanTaskUpdateStateByKey(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	modelPlanID uuid.UUID,
	key models.PlanTaskKey,
	newState models.PlanTaskState,
	completedBy *uuid.UUID,
	completedDts *time.Time,
	modifiedBy uuid.UUID,
) (*PlanTaskUpdateStateByKeyResult, error) {
	args := map[string]interface{}{
		"model_plan_id":      modelPlanID,
		"key":                key,
		"state":              newState,
		"completed_by":       completedBy,
		"completed_dts":      completedDts,
		"modified_by":        modifiedBy,
		"target_is_complete": newState == models.PlanTaskStateComplete,
	}

	rows, err := sqlutils.SelectProcedure[planTaskUpdateStateByKeyRow](np, sqlqueries.PlanTask.UpdateStateByKey, args)
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return nil, nil
	}

	row := rows[0]
	task := row.PlanTask
	return &PlanTaskUpdateStateByKeyResult{
		Task:          &task,
		PreviousState: row.PreviousState,
	}, nil
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

	tasks, err := sqlutils.SelectProcedure[models.PlanTask](np, sqlqueries.PlanTask.ActivateUpcoming, args)
	if err != nil {
		return nil, err
	}
	if len(tasks) == 0 {
		return nil, nil
	}

	return tasks[0], nil
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

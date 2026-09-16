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

// PlanTaskGetByModelPlanIDLOADER returns all plan tasks for a slice of model plan IDs
func PlanTaskGetByModelPlanIDLOADER(
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

// PlanTaskUpdate updates mutable fields on a plan task (status and completion fields)
func PlanTaskUpdate(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	task *models.PlanTask,
) (*models.PlanTask, error) {
	updatedTask, err := sqlutils.GetProcedure[models.PlanTask](np, sqlqueries.PlanTask.Update, task)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, task)
	}

	return updatedTask, nil
}

// PlanTaskGetModelPlanIDsDueForPrepareForClearance returns the model plan IDs whose
// PREPARE_FOR_CLEARANCE task is still UPCOMING and whose internal clearance start date is on or
// before triggerThreshold (i.e. within models.PrepareForClearanceTriggerDays of now). Used by
// pkg/worker/prepare_for_clearance_batch_job.go to find which plans need activation.
func PlanTaskGetModelPlanIDsDueForPrepareForClearance(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	triggerThreshold time.Time,
) ([]*uuid.UUID, error) {
	args := map[string]interface{}{
		"trigger_threshold": triggerThreshold,
	}

	return sqlutils.SelectProcedure[uuid.UUID](np, sqlqueries.PlanTask.GetModelPlanIDsDueForPrepareForClearance, args)
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

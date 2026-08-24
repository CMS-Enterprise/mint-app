package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/helpers"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// PlanTaskGetByIDLOADER implements resolver logic to get a plan task by its ID using a data loader
func PlanTaskGetByIDLOADER(ctx context.Context, id uuid.UUID) (*models.PlanTask, error) {
	return loaders.PlanTask.ByID.Load(ctx, id)
}

// PlanTaskGetByModelPlanIDLOADER implements resolver logic to get plan tasks by model plan ID using a data loader
func PlanTaskGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.PlanTask, error) {
	return loaders.PlanTask.ByModelPlanID.Load(ctx, modelPlanID)
}

func updatePlanTaskStatusByKey(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	key models.PlanTaskKey,
	newStatus models.PlanTaskStatus,
	principal authentication.Principal,
	store *storage.Store,
) (*models.PlanTask, error) {
	tasks, err := storage.PlanTaskGetByModelPlanIDLOADER(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return nil, err
	}

	var task *models.PlanTask
	for _, t := range tasks {
		if t.Key == key {
			task = t
			break
		}
	}
	if task == nil {
		return nil, fmt.Errorf("plan task not found for modelPlanID %s and key %s", modelPlanID, key)
	}

	// Ensure completion metadata matches the target status before treating an update as a no-op.
	isCompletionMetadataConsistent := (newStatus == models.PlanTaskStatusComplete && task.CompletedBy != nil && task.CompletedDts != nil) ||
		(newStatus != models.PlanTaskStatusComplete && task.CompletedBy == nil && task.CompletedDts == nil)

	// Skip writes when status + completion metadata are already correct.
	if task.Status == newStatus && isCompletionMetadataConsistent {
		return task, nil
	}

	task.Status = newStatus

	if newStatus == models.PlanTaskStatusComplete {
		task.CompletedBy = &principal.Account().ID
		task.CompletedDts = helpers.PointerTo(time.Now().UTC())
	} else {
		task.CompletedBy = nil
		task.CompletedDts = nil
	}

	err = BaseStructPreUpdate(
		logger,
		task,
		map[string]interface{}{"status": newStatus},
		principal,
		store,
		true,
		true,
	)
	if err != nil {
		return nil, err
	}

	return storage.PlanTaskUpdate(np, logger, task)
}

// PlanTaskMarkComplete directly sets a manually-markable plan task's status to COMPLETE or TO_DO.
// Unlike the calculated task keys (MODEL_PLAN, MTO, DATA_EXCHANGE), which are derived from other
// model state and updated via updatePlanTaskStatusByKey's other callers, manually-markable keys
// (see models.PlanTaskKey.IsManuallyMarkable) have no calculated status and are only ever changed
// by direct user action, so a key is rejected here if it isn't on that allow-list.
//
// Marking a key complete may also activate another task (see models.PlanTaskKey.ActivationTarget),
// moving it from UPCOMING to TO_DO.
func PlanTaskMarkComplete(
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	key models.PlanTaskKey,
	isComplete bool,
	principal authentication.Principal,
	store *storage.Store,
) (*models.PlanTask, error) {
	if !key.IsManuallyMarkable() {
		return nil, fmt.Errorf("plan task key %s can not be manually marked complete", key)
	}

	newStatus := models.PlanTaskStatusToDo
	if isComplete {
		newStatus = models.PlanTaskStatusComplete
	}

	return sqlutils.WithTransaction[models.PlanTask](store, func(tx *sqlx.Tx) (*models.PlanTask, error) {
		task, err := updatePlanTaskStatusByKey(tx, logger, modelPlanID, key, newStatus, principal, store)
		if err != nil {
			return nil, err
		}

		if isComplete {
			if targetKey, ok := key.ActivationTarget(); ok {
				if err := activateUpcomingPlanTask(tx, logger, modelPlanID, targetKey, principal, store); err != nil {
					return nil, err
				}
			}
		}

		return task, nil
	})
}

// activateUpcomingPlanTask moves a plan task from UPCOMING to TO_DO. It is a no-op if the task isn't
// currently UPCOMING (already activated, or has otherwise progressed) or doesn't exist yet, since
// activation must never regress a task that has already moved on.
func activateUpcomingPlanTask(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	key models.PlanTaskKey,
	principal authentication.Principal,
	store *storage.Store,
) error {
	tasks, err := storage.PlanTaskGetByModelPlanIDLOADER(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return err
	}

	var target *models.PlanTask
	for _, t := range tasks {
		if t.Key == key {
			target = t
			break
		}
	}
	if target == nil {
		logger.Warn(
			"plan task activation target not found, skipping",
			zap.String("modelPlanID", modelPlanID.String()),
			zap.String("key", string(key)),
		)
		return nil
	}
	if target.Status != models.PlanTaskStatusUpcoming {
		return nil
	}

	_, err = updatePlanTaskStatusByKey(np, logger, modelPlanID, key, models.PlanTaskStatusToDo, principal, store)
	return err
}

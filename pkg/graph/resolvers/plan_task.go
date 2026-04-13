package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
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
) error {
	tasks, err := storage.PlanTaskGetByModelPlanIDLOADER(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return err
	}

	var task *models.PlanTask
	for _, t := range tasks {
		if t.Key == key {
			task = t
			break
		}
	}
	if task == nil {
		return fmt.Errorf("plan task not found for modelPlanID %s and key %s", modelPlanID, key)
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
		return err
	}

	_, err = storage.PlanTaskUpdate(np, logger, task)
	return err
}

// updateModelPlanTaskInProgress marks the MODEL_PLAN task as IN_PROGRESS.
func updateModelPlanTaskInProgress(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyModelPlan, models.PlanTaskStatusInProgress, principal, store)
}

// updateModelPlanTaskComplete marks the MODEL_PLAN task as COMPLETE.
func updateModelPlanTaskComplete(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyModelPlan, models.PlanTaskStatusComplete, principal, store)
}

// updateDataExchangeTaskInProgress marks the DATA_EXCHANGE task as IN_PROGRESS.
func updateDataExchangeTaskInProgress(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyDataExchange, models.PlanTaskStatusInProgress, principal, store)
}

// updateDataExchangeTaskComplete marks the DATA_EXCHANGE task as COMPLETE.
func updateDataExchangeTaskComplete(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyDataExchange, models.PlanTaskStatusComplete, principal, store)
}

// updateMTOTaskInProgress marks the MTO task as IN_PROGRESS.
func updateMTOTaskInProgress(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyMto, models.PlanTaskStatusInProgress, principal, store)
}

// updateMTOTaskComplete marks the MTO task as COMPLETE.
func updateMTOTaskComplete(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyMto, models.PlanTaskStatusComplete, principal, store)
}

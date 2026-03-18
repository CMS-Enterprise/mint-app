package resolvers

import (
	"context"
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
		return nil
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

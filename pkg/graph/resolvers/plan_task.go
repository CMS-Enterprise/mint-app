package resolvers

import (
	"context"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/helpers"
	"github.com/cms-enterprise/mint-app/pkg/models"
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

func updateModelPlanTaskStatus(
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	newStatus models.PlanTaskStatus,
	principal authentication.Principal,
	store *storage.Store,
) error {
	tasks, err := storage.PlanTaskGetByModelPlanIDLOADER(store, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return err
	}

	var modelPlanTask *models.PlanTask
	for _, t := range tasks {
		if t.Key == models.PlanTaskKeyModelPlan {
			modelPlanTask = t
			break
		}
	}
	if modelPlanTask == nil {
		return nil
	}

	// Early return if no change needed
	if modelPlanTask.Status == newStatus {
		return nil
	}

	// Ensure the updated value is persisted by PlanTaskUpdate
	modelPlanTask.Status = newStatus

	if newStatus == models.PlanTaskStatusComplete {
		modelPlanTask.CompletedBy = &principal.Account().ID
		modelPlanTask.CompletedDts = helpers.PointerTo(time.Now().UTC())
	} else {
		modelPlanTask.CompletedBy = nil
		modelPlanTask.CompletedDts = nil
	}

	err = BaseStructPreUpdate(
		logger,
		modelPlanTask,
		map[string]interface{}{"status": newStatus},
		principal,
		store,
		true,
		true,
	)
	if err != nil {
		return err
	}

	_, err = storage.PlanTaskUpdate(store, logger, modelPlanTask)
	return err
}

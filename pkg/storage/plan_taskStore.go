package storage

import (
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
	args := map[string]any{
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
	args := map[string]any{
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

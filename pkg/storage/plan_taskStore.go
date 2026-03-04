package storage

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
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

// PlanTaskByID retrieves a plan task for a given ID
func (s *Store) PlanTaskByID(_ *zap.Logger, id uuid.UUID) (*models.PlanTask, error) {
	stmt, err := s.db.PrepareNamed(sqlqueries.PlanTask.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	task := &models.PlanTask{}
	err = stmt.Get(task, utilitysql.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return task, nil
}

// PlanTaskUpdate updates mutable fields on a plan task (status and completion fields)
func (s *Store) PlanTaskUpdate(
	logger *zap.Logger,
	task *models.PlanTask,
) (*models.PlanTask, error) {
	stmt, err := s.db.PrepareNamed(sqlqueries.PlanTask.Update)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, task)
	}
	defer stmt.Close()

	err = stmt.Get(task, task)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, task)
	}

	return task, nil
}

// PlanTaskCreate creates a new plan task (used when a model plan is created)
func (s *Store) PlanTaskCreate(
	logger *zap.Logger,
	task *models.PlanTask,
	np sqlutils.NamedPreparer,
) (*models.PlanTask, error) {
	task.ID = utilityuuid.ValueOrNewUUID(task.ID)

	stmt, err := np.PrepareNamed(sqlqueries.PlanTask.Create)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, task)
	}
	defer stmt.Close()

	task.ModifiedBy = nil
	task.ModifiedDts = nil

	retTask := models.PlanTask{}
	err = stmt.Get(&retTask, task)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, task)
	}

	return &retTask, nil
}

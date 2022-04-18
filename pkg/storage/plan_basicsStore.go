package storage

import (
	_ "embed"
	"github.com/cmsgov/mint-app/pkg/shared/utility_sql"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utility_uuid"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

//go:embed SQL/plan_basics_create.sql
var planBasicsCreateSQL string

//go:embed SQL/plan_basics_update.sql
var planBasicsUpdateSQL string

//go:embed SQL/plan_basics_get_by_id.sql
var planBasicsGetByIdSQL string

//go:embed SQL/plan_basics_get_by_model_plan_id.sql
var planBasicsGetByModelPlan_IdSQL string

func (s *Store) PlanBasicsCreate(logger *zap.Logger, basics *models.PlanBasics) (*models.PlanBasics, error) {

	basics.ID = utility_uuid.ValueOrNewUUID(basics.ID)
	status := models.TaskReady
	basics.Status = &status

	statement, err := s.db.PrepareNamed(planBasicsCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, basics)
	}

	err = statement.Get(basics, basics)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, basics)
	}

	return basics, nil
}

func (s *Store) PlanBasicsUpdate(logger *zap.Logger, plan *models.PlanBasics) (*models.PlanBasics, error) {
	statement, err := s.db.PrepareNamed(planBasicsUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, plan)
	}

	err = statement.Get(plan, plan)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, plan)
	}

	return plan, nil
}

func (s *Store) PlanBasicsGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanBasics, error) {
	statement, err := s.db.PrepareNamed(planBasicsGetByIdSQL)
	if err != nil {
		return nil, err
	}

	var plan models.PlanBasics
	err = statement.Get(&plan, utility_sql.CreateIDQueryMap(id))

	if err != nil {
		return nil, genericmodel.HandleModelFetchByIDError(logger, err, id)
	}

	return &plan, nil
}

func (s *Store) PlanBasicsGetByModelPlanID(logger *zap.Logger, principal *string, modelPlanId uuid.UUID) (*models.PlanBasics, error) {
	statement, err := s.db.PrepareNamed(planBasicsGetByModelPlan_IdSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"modified_by":   principal,
		"created_by":    principal,
		"model_plan_id": modelPlanId,
	}

	var plan models.PlanBasics
	err = statement.Get(&plan, arg)
	if err != nil {
		return nil, genericmodel.HandleModelFetchByIDError(logger, err, modelPlanId)
	}

	return &plan, nil
}

package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_basics_create.sql
var planBasicsCreateSQL string

//go:embed SQL/plan_basics_update.sql
var planBasicsUpdateSQL string

//go:embed SQL/plan_basics_get_by_id.sql
var planBasicsGetByIDSQL string

//go:embed SQL/plan_basics_get_by_model_plan_id.sql
var planBasicsGetByModelPlanIDSQL string

//go:embed SQL/plan_basics_get_by_model_plan_id_LOADER.sql
var planBasicsGetByModelPlanIDLoaderSQL string

// PlanBasicsCreate creates a new plan basics
func (s *Store) PlanBasicsCreate(logger *zap.Logger, basics *models.PlanBasics) (*models.PlanBasics, error) {
	basics.ID = utilityUUID.ValueOrNewUUID(basics.ID)

	statement, err := s.db.PrepareNamed(planBasicsCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, basics)
	}

	basics.ModifiedBy = nil
	basics.ModifiedDts = nil

	err = statement.Get(basics, basics)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, basics)
	}

	return basics, nil
}

// PlanBasicsUpdate updates the plan basics for a given id
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

// PlanBasicsGetByID returns the plan basics for a given id
func (s *Store) PlanBasicsGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanBasics, error) {
	plan := models.PlanBasics{}

	statement, err := s.db.PrepareNamed(planBasicsGetByIDSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&plan, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}
	return &plan, nil
}

// PlanBasicsGetByModelPlanID returns the plan basics for a given model plan id
func (s *Store) PlanBasicsGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID) (*models.PlanBasics, error) {
	plan := models.PlanBasics{} //TOOD use new data loader query instead.

	statement, err := s.db.PrepareNamed(planBasicsGetByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err = statement.Get(&plan, arg)

	if err != nil {
		return nil, err
	}

	return &plan, nil
}

// PlanBasicsGetByModelPlanIDLOADER returns the plan basics for a slice of model plan ids
func (s *Store) PlanBasicsGetByModelPlanIDLOADER(logger *zap.Logger, modelPlanIDSlice []uuid.UUID) ([]*models.PlanBasics, error) {
	basicSlice := []*models.PlanBasics{} //TOOD use new data loader query instead.

	query, args, err := sqlx.In(planBasicsGetByModelPlanIDLoaderSQL, modelPlanIDSlice)
	if err != nil {
		return nil, err
	}
	query = s.db.Rebind(query)

	err = s.db.Select(&basicSlice, query, args...)

	if err != nil {
		return nil, err
	}

	return basicSlice, nil
}

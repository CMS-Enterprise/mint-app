package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_it_tools_create.sql
var planITToolsCreateSQL string

//go:embed SQL/plan_it_tools_update.sql
var planITToolsUpdateSQL string

//go:embed SQL/plan_it_tools_get_by_id.sql
var planITToolsGetByIDSQL string

//go:embed SQL/plan_it_tools_get_by_model_plan_id.sql
var planITToolsGetByModelPlanIDSQL string

// PlanITToolsCreate creates a new plan providers_and_participants object
func (s *Store) PlanITToolsCreate(logger *zap.Logger, it *models.PlanITTools) (*models.PlanITTools, error) {
	it.ID = utilityUUID.ValueOrNewUUID(it.ID)

	statement, err := s.db.PrepareNamed(planITToolsCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, it)
	}

	it.ModifiedBy = nil
	it.ModifiedDts = nil
	err = statement.Get(it, it)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, it)
	}

	return it, nil
}

// PlanITToolsUpdate updates the plan providers_and_participants for a given id
func (s *Store) PlanITToolsUpdate(logger *zap.Logger, it *models.PlanITTools) (*models.PlanITTools, error) {
	statement, err := s.db.PrepareNamed(planITToolsUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, it)
	}

	err = statement.Get(it, it)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, it)
	}

	return it, nil
}

// PlanITToolsGetByID returns the plan providers_and_participants for a given id
func (s *Store) PlanITToolsGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanITTools, error) {
	it := models.PlanITTools{}

	statement, err := s.db.PrepareNamed(planITToolsGetByIDSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&it, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}

	return &it, nil
}

// PlanITToolsGetByModelPlanID returns the providers_and_participants for a given model plan id
func (s *Store) PlanITToolsGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID) (*models.PlanITTools, error) {
	it := models.PlanITTools{}

	statement, err := s.db.PrepareNamed(planITToolsGetByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err = statement.Get(&it, arg)

	if err != nil {
		return nil, err
	}

	return &it, nil
}

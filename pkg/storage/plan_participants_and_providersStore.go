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

//go:embed SQL/plan_participants_and_providers/create.sql
var planParticipantsAndProvidersCreateSQL string

//go:embed SQL/plan_participants_and_providers/update.sql
var planParticipantsAndProvidersUpdateSQL string

//go:embed SQL/plan_participants_and_providers/get_by_id.sql
var planParticipantsAndProvidersGetByIDSQL string

//go:embed SQL/plan_participants_and_providers/get_by_model_plan_id_LOADER.sql
var planParticipantsAndProvidersGetByModelPlanIDLoaderSQL string

// PlanParticipantsAndProvidersGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanParticipantsAndProvidersGetByModelPlanIDLOADER(logger *zap.Logger, paramTableJSON string) ([]*models.PlanParticipantsAndProviders, error) {
	pAndPSlice := []*models.PlanParticipantsAndProviders{}

	stmt, err := s.statements.Get(planParticipantsAndProvidersGetByModelPlanIDLoaderSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&pAndPSlice, arg) //this returns more than one

	if err != nil {
		return nil, err
	}

	return pAndPSlice, nil
}

// PlanParticipantsAndProvidersCreate creates a new plan providers_and_participants object
func (s *Store) PlanParticipantsAndProvidersCreate(logger *zap.Logger, gc *models.PlanParticipantsAndProviders) (*models.PlanParticipantsAndProviders, error) {
	gc.ID = utilityUUID.ValueOrNewUUID(gc.ID)

	statement, err := s.statements.Get(planParticipantsAndProvidersCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, gc)
	}

	gc.ModifiedBy = nil
	gc.ModifiedDts = nil
	err = statement.Get(gc, gc)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, gc)
	}

	return gc, nil
}

// PlanParticipantsAndProvidersUpdate updates the plan providers_and_participants for a given id
func (s *Store) PlanParticipantsAndProvidersUpdate(logger *zap.Logger, gc *models.PlanParticipantsAndProviders) (*models.PlanParticipantsAndProviders, error) {
	statement, err := s.statements.Get(planParticipantsAndProvidersUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, gc)
	}

	err = statement.Get(gc, gc)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, gc)
	}

	return gc, nil
}

// PlanParticipantsAndProvidersGetByID returns the plan providers_and_participants for a given id
func (s *Store) PlanParticipantsAndProvidersGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanParticipantsAndProviders, error) {
	gc := models.PlanParticipantsAndProviders{}

	statement, err := s.statements.Get(planParticipantsAndProvidersGetByIDSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&gc, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}

	return &gc, nil
}

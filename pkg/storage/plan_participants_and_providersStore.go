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

//go:embed SQL/plan_participants_and_providers_create.sql
var planParticipantsAndProvidersCreateSQL string

//go:embed SQL/plan_participants_and_providers_update.sql
var planParticipantsAndProvidersUpdateSQL string

//go:embed SQL/plan_participants_and_providers_get_by_id.sql
var planParticipantsAndProvidersGetByIDSQL string

//go:embed SQL/plan_participants_and_providers_get_by_model_plan_id.sql
var planParticipantsAndProvidersGetByModelPlanIDSQL string

// PlanParticipantsAndProvidersCreate creates a new plan providers_and_participants object
func (s *Store) PlanParticipantsAndProvidersCreate(logger *zap.Logger, gc *models.PlanParticipantsAndProviders) (*models.PlanParticipantsAndProviders, error) {
	gc.ID = utilityUUID.ValueOrNewUUID(gc.ID)

	statement, err := s.db.PrepareNamed(planParticipantsAndProvidersCreateSQL)
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
	statement, err := s.db.PrepareNamed(planParticipantsAndProvidersUpdateSQL)
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

	statement, err := s.db.PrepareNamed(planParticipantsAndProvidersGetByIDSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&gc, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}

	return &gc, nil
}

// PlanParticipantsAndProvidersGetByModelPlanID returns the providers_and_participants for a given model plan id
func (s *Store) PlanParticipantsAndProvidersGetByModelPlanID(logger *zap.Logger, principal string, modelPlanID uuid.UUID) (*models.PlanParticipantsAndProviders, error) {
	gc := models.PlanParticipantsAndProviders{}

	statement, err := s.db.PrepareNamed(planParticipantsAndProvidersGetByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"modified_by":   principal,
		"created_by":    principal,
		"model_plan_id": modelPlanID,
	}

	err = statement.Get(&gc, arg)

	if err != nil {
		return nil, err
	}

	return &gc, nil
}

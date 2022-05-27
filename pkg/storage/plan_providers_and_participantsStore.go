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

//go:embed SQL/plan_providers_and_participants_create.sql
var planProvidersAndParticipantsCreateSQL string

//go:embed SQL/plan_providers_and_participants_update.sql
var planProvidersAndParticipantsUpdateSQL string

//go:embed SQL/plan_providers_and_participants_get_by_id.sql
var planProvidersAndParticipantsGetByIDSQL string

//go:embed SQL/plan_providers_and_participants_get_by_model_plan_id.sql
var planProvidersAndParticipantsGetByModelPlanIDSQL string

// PlanProvidersAndParticipantsCreate creates a new plan providers_and_participants object
func (s *Store) PlanProvidersAndParticipantsCreate(logger *zap.Logger, gc *models.PlanProvidersAndParticipants) (*models.PlanProvidersAndParticipants, error) {
	gc.ID = utilityUUID.ValueOrNewUUID(gc.ID)

	statement, err := s.db.PrepareNamed(planProvidersAndParticipantsCreateSQL)
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

// PlanProvidersAndParticipantsUpdate updates the plan providers_and_participants for a given id
func (s *Store) PlanProvidersAndParticipantsUpdate(logger *zap.Logger, gc *models.PlanProvidersAndParticipants) (*models.PlanProvidersAndParticipants, error) {
	statement, err := s.db.PrepareNamed(planProvidersAndParticipantsUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, gc)
	}

	err = statement.Get(gc, gc)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, gc)
	}

	return gc, nil
}

// PlanProvidersAndParticipantsGetByID returns the plan providers_and_participants for a given id
func (s *Store) PlanProvidersAndParticipantsGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanProvidersAndParticipants, error) {
	gc := models.PlanProvidersAndParticipants{}

	statement, err := s.db.PrepareNamed(planProvidersAndParticipantsGetByIDSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&gc, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}

	return &gc, nil
}

// PlanProvidersAndParticipantsGetByModelPlanID returns the providers_and_participants for a given model plan id
func (s *Store) PlanProvidersAndParticipantsGetByModelPlanID(logger *zap.Logger, principal string, modelPlanID uuid.UUID) (*models.PlanProvidersAndParticipants, error) {
	gc := models.PlanProvidersAndParticipants{}

	statement, err := s.db.PrepareNamed(planProvidersAndParticipantsGetByModelPlanIDSQL)
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

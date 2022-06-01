package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//PlanParticipantsAndProvidersUpdate updates a plan ProvidersAndParticipants buisness object
func PlanParticipantsAndProvidersUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal string, store *storage.Store) (*models.PlanParticipantsAndProviders, error) {
	//Get existing plan ProvidersAndParticipants
	existingProvidersAndParticipants, err := store.PlanParticipantsAndProvidersGetByID(logger, id)
	if err != nil {
		return nil, err
	}
	err = ApplyChanges(changes, existingProvidersAndParticipants)
	if err != nil {
		return nil, err
	}
	existingProvidersAndParticipants.ModifiedBy = &principal
	err = existingProvidersAndParticipants.CalcStatus()
	if err != nil {
		return nil, err
	}

	retProvidersAndParticipants, err := store.PlanParticipantsAndProvidersUpdate(logger, existingProvidersAndParticipants)
	return retProvidersAndParticipants, err

}

// PlanParticipantsAndProvidersGetByModelPlanID returns a plan ProvidersAndParticipants buisness object associated with a model plan
func PlanParticipantsAndProvidersGetByModelPlanID(logger *zap.Logger, principal string, modelPlanID uuid.UUID, store *storage.Store) (*models.PlanParticipantsAndProviders, error) {
	pp, err := store.PlanParticipantsAndProvidersGetByModelPlanID(logger, principal, modelPlanID)
	if err != nil {
		return nil, err
	}
	return pp, err

}

package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//PlanParticipantsAndProvidersUpdate updates a plan ProvidersAndParticipants buisness object
func PlanParticipantsAndProvidersUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.PlanParticipantsAndProviders, error) {
	//Get existing plan ProvidersAndParticipants
	existing, err := store.PlanParticipantsAndProvidersGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseTaskListSectionPreUpdate(logger, existing, changes, principal, store)
	if err != nil {
		return nil, err
	}

	retProvidersAndParticipants, err := store.PlanParticipantsAndProvidersUpdate(logger, existing)
	return retProvidersAndParticipants, err

}

// PlanParticipantsAndProvidersGetByModelPlanID returns a plan ProvidersAndParticipants buisness object associated with a model plan
func PlanParticipantsAndProvidersGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) (*models.PlanParticipantsAndProviders, error) {
	pp, err := store.PlanParticipantsAndProvidersGetByModelPlanID(logger, modelPlanID)
	if err != nil {
		return nil, err
	}
	return pp, err

}

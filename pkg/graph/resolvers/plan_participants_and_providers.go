package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// PlanParticipantsAndProvidersGetByModelPlanIDLOADER implements resolver logic to get Plan Participants and Providers by a model plan ID using a data loader
func PlanParticipantsAndProvidersGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanParticipantsAndProviders, error) {
	allLoaders, err := loaders.Loaders(ctx)
	if err != nil {
		return nil, err
	}
	pAndPLoader := allLoaders.ParticipantsAndProvidersLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID

	thunk := pAndPLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*models.PlanParticipantsAndProviders), nil
}

// PlanParticipantsAndProvidersUpdate updates a plan ProvidersAndParticipants buisness object
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

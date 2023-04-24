package resolvers

import (
	"context"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
)

// ExistingModelLinkGetByModelPlanIDLOADER implements resolver logic to get Existing Model Link by a model plan ID using a data loader
func ExistingModelLinkGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.ExistingModelLink, error) {
	allLoaders := loaders.Loaders(ctx)
	linkLoader := allLoaders.ExistingModelLinkLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID

	thunk := linkLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.([]*models.ExistingModelLink), nil
}

// ExistingModelLinkCreate creates a new existing model link
func ExistingModelLinkCreate(logger *zap.Logger, store *storage.Store, principal authentication.Principal, modelPlanID uuid.UUID, existingModelID *int, currentModelPlanID *uuid.UUID) (*models.ExistingModelLink, error) {
	//TODO: pass the changes object?
	link := models.NewExistingModelLink(principal.Account().ID, modelPlanID, existingModelID, currentModelPlanID)

	retLink, err := store.ExistingModelLinkCreate(logger, link)
	if err != nil {
		return nil, err
	}
	return retLink, err

}

// ExistingModelLinkGetByID returns an existing model link by it's id
func ExistingModelLinkGetByID(logger *zap.Logger, store *storage.Store, principal authentication.Principal, id uuid.UUID) (*models.ExistingModelLink, error) {

	retLink, err := store.ExistingModelLinkGetByID(logger, id)
	if err != nil {
		return nil, err
	}
	return retLink, err

}

// ExistingModelLinkDelete deletes an existing model link
func ExistingModelLinkDelete(logger *zap.Logger, store *storage.Store, principal authentication.Principal, id uuid.UUID) (*models.ExistingModelLink, error) {

	retLink, err := store.ExistingModelLinkGetByID(logger, id)
	if err != nil {
		return nil, err
	}
	return retLink, err

}

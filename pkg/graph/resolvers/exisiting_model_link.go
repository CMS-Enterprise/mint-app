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

// ExistingModelLinksUpdate creates or deletes existing model links based on the list provided.
func ExistingModelLinksUpdate(logger *zap.Logger, store *storage.Store, principal authentication.Principal, modelPlanID uuid.UUID, existingModelIDs []int, currentModelPlanIDs []uuid.UUID) ([]*models.ExistingModelLink, error) {
	link := models.NewExistingModelLink(principal.Account().ID, modelPlanID, nil, nil) // this is for access check
	err := BaseStructPreCreate(logger, link, principal, store, true)
	if err != nil {
		return nil, err
	}

	retLink, err := store.ExistingModelLinksUpdate(logger, principal.Account().ID, modelPlanID, existingModelIDs, currentModelPlanIDs)
	if err != nil {
		return nil, err
	}
	return retLink, err

}

// ExistingModelLinkCreate creates a new existing model link
func ExistingModelLinkCreate(logger *zap.Logger, store *storage.Store, principal authentication.Principal, modelPlanID uuid.UUID, existingModelID *int, currentModelPlanID *uuid.UUID) (*models.ExistingModelLink, error) {
	link := models.NewExistingModelLink(principal.Account().ID, modelPlanID, existingModelID, currentModelPlanID)
	err := BaseStructPreCreate(logger, link, principal, store, true)
	if err != nil {
		return nil, err
	}

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

	existing, err := store.ExistingModelLinkGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreDelete(logger, existing, principal, store, true) //Only allow delete if collab or admin
	if err != nil {
		return nil, err
	}

	retLink, err := store.ExistingModelLinkDelete(logger, id, principal.Account().ID)
	if err != nil {
		return nil, err
	}
	return retLink, err

}

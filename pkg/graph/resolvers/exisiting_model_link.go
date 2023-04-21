package resolvers

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// ExistingModelLinkCollectionGetByModelPlanID returns all existing models Links for a model plan ID
func ExistingModelLinkCollectionGetByModelPlanID(logger *zap.Logger, store *storage.Store) ([]*models.ExistingModelLink, error) { // TODO: make this a data loaders
	existingModels, err := store.ExistingModelLinkCollectionGetByModelPlanID(logger)
	if err != nil {
		return nil, err
	}
	return existingModels, err

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

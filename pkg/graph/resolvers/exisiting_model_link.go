package resolvers

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// ExistingModelLinkGetByModelPlanIDAndFieldNameLOADER implements resolver logic to get Existing Model Link by a model plan ID using a data loader
func ExistingModelLinkGetByModelPlanIDAndFieldNameLOADER(ctx context.Context, modelPlanID uuid.UUID, fieldName models.ExisitingModelLinkFieldType) ([]*models.ExistingModelLink, error) {
	allLoaders := loaders.Loaders(ctx)
	linkLoader := allLoaders.ExistingModelLinkLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID
	key.Args["field_name"] = fieldName

	thunk := linkLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.([]*models.ExistingModelLink), nil
}

// ExistingModelLinksGetByModelPlanIDAndFieldNameLOADER implements resolver logic to get Existing Model Link by a model plan ID using a data loader
func ExistingModelLinksGetByModelPlanIDAndFieldNameLOADER(ctx context.Context, modelPlanID uuid.UUID, fieldName models.ExisitingModelLinkFieldType) (*models.ExistingModelLinks, error) {
	linkCollection, err := ExistingModelLinkGetByModelPlanIDAndFieldNameLOADER(ctx, modelPlanID, fieldName)

	if err != nil {
		return nil, err
	}
	links := models.NewExistingModelLinks(modelPlanID, fieldName, linkCollection)

	return links, nil
}

// ExistingModelLinksUpdate creates or deletes existing model links based on the list provided.
func ExistingModelLinksUpdate(logger *zap.Logger, store *storage.Store, principal authentication.Principal, modelPlanID uuid.UUID, fieldName models.ExisitingModelLinkFieldType, existingModelIDs []int, currentModelPlanIDs []uuid.UUID) (*models.ExistingModelLinks, error) {
	link := models.NewExistingModelLink(principal.Account().ID, modelPlanID, nil, nil) // this is for access check
	err := BaseStructPreCreate(logger, link, principal, store, true)
	if err != nil {
		return nil, err
	}

	retLinks, err := store.ExistingModelLinksUpdate(logger, principal.Account().ID, modelPlanID, fieldName, existingModelIDs, currentModelPlanIDs)
	if err != nil {
		return nil, err
	}
	links := models.NewExistingModelLinks(modelPlanID, fieldName, retLinks)

	return links, err

}

// ExistingModelLinkGetByID returns an existing model link by its id
func ExistingModelLinkGetByID(logger *zap.Logger, store *storage.Store, principal authentication.Principal, id uuid.UUID) (*models.ExistingModelLink, error) {

	retLink, err := store.ExistingModelLinkGetByID(logger, id)
	if err != nil {
		return nil, err
	}
	return retLink, err

}

// ExistingModelLinkGetModel conditionally returns either an ExistingModel, or a ModelPlan that is connected in an existing model link
func ExistingModelLinkGetModel(ctx context.Context, link *models.ExistingModelLink) (models.LinkedExistingModel, error) {
	if link.CurrentModelPlanID != nil {
		return ModelPlanGetByIDLOADER(ctx, *link.CurrentModelPlanID)
	}

	if link.ExistingModelID != nil {
		return ExistingModelGetByIDLOADER(ctx, *link.ExistingModelID)
	}
	return nil, fmt.Errorf("no valid model for existing model link %s for model_plan_id %s", link.ID, link.ModelPlanID)

}

func ExistingModelLinksNameArray(ctx context.Context, modelPlanID uuid.UUID, fieldName models.ExisitingModelLinkFieldType) ([]string, error) {
	allLoaders := loaders.Loaders(ctx)
	linkLoader := allLoaders.ExistingModelLinkNameLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID
	key.Args["field_name"] = fieldName

	thunk := linkLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.([]string), nil
}

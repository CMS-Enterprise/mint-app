package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// modelPlanMTOTemplateLinkLoaders is a struct that holds LoaderWrappers related to Model Plan MTO Template Links
type modelPlanMTOTemplateLinkLoaders struct {
	ByID          LoaderWrapper[uuid.UUID, *models.ModelPlanMTOTemplateLink]
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.ModelPlanMTOTemplateLink]
	ByTemplateID  LoaderWrapper[uuid.UUID, []*models.ModelPlanMTOTemplateLink]
}

// ModelPlanMTOTemplateLink is the singleton instance of all LoaderWrappers related to Model Plan MTO Template Links
var ModelPlanMTOTemplateLink = &modelPlanMTOTemplateLinkLoaders{
	ByID:          NewLoaderWrapper(batchModelPlanMTOTemplateLinkGetByID),
	ByModelPlanID: NewLoaderWrapper(batchModelPlanMTOTemplateLinkGetByModelPlanID),
	ByTemplateID:  NewLoaderWrapper(batchModelPlanMTOTemplateLinkGetByTemplateID),
}

// batchModelPlanMTOTemplateLinkGetByID loads Model Plan MTO Template Links by ID
func batchModelPlanMTOTemplateLinkGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.ModelPlanMTOTemplateLink] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.ModelPlanMTOTemplateLink](ids, err)
	}

	data, err := storage.ModelPlanMTOTemplateLinkGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.ModelPlanMTOTemplateLink](ids, err)
	}

	getKeyFunc := func(data *models.ModelPlanMTOTemplateLink) uuid.UUID {
		return data.ID
	}

	// implement one to one
	return oneToOneDataLoader(ids, data, getKeyFunc)
}

// batchModelPlanMTOTemplateLinkGetByModelPlanID loads Model Plan MTO Template Links by Model Plan ID
func batchModelPlanMTOTemplateLinkGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.ModelPlanMTOTemplateLink] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.ModelPlanMTOTemplateLink](modelPlanIDs, err)
	}

	data, err := storage.ModelPlanMTOTemplateLinkGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.ModelPlanMTOTemplateLink](modelPlanIDs, err)
	}

	getKeyFunc := func(data *models.ModelPlanMTOTemplateLink) uuid.UUID {
		return data.ModelPlanID
	}

	// implement one to many
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)
}

// batchModelPlanMTOTemplateLinkGetByTemplateID loads Model Plan MTO Template Links by Template ID
func batchModelPlanMTOTemplateLinkGetByTemplateID(ctx context.Context, templateIDs []uuid.UUID) []*dataloader.Result[[]*models.ModelPlanMTOTemplateLink] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.ModelPlanMTOTemplateLink](templateIDs, err)
	}

	data, err := storage.ModelPlanMTOTemplateLinkGetByTemplateIDLoader(loaders.DataReader.Store, logger, templateIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.ModelPlanMTOTemplateLink](templateIDs, err)
	}

	getKeyFunc := func(data *models.ModelPlanMTOTemplateLink) uuid.UUID {
		return data.TemplateID
	}

	// implement one to many
	return oneToManyDataLoader(templateIDs, data, getKeyFunc)
}

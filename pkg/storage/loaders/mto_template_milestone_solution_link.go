package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// mtoTemplateMilestoneSolutionLinkLoaders is a struct that holds LoaderWrappers related to MTO Template Milestone Solution Links
type mtoTemplateMilestoneSolutionLinkLoaders struct {
	ByTemplateID LoaderWrapper[uuid.UUID, []*models.MTOTemplateMilestoneSolutionLink]
}

// MTOTemplateMilestoneSolutionLink is the singleton instance of all LoaderWrappers related to MTO Template Milestone Solution Links
var MTOTemplateMilestoneSolutionLink = &mtoTemplateMilestoneSolutionLinkLoaders{
	ByTemplateID: NewLoaderWrapper(batchMTOTemplateMilestoneSolutionLinkGetByTemplateID),
}

// batchMTOTemplateMilestoneSolutionLinkGetByTemplateID loads MTO Template Milestone Solution Links by Template ID
func batchMTOTemplateMilestoneSolutionLinkGetByTemplateID(ctx context.Context, templateIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOTemplateMilestoneSolutionLink] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateMilestoneSolutionLink](templateIDs, err)
	}

	data, err := storage.MTOTemplateMilestoneSolutionLinkGetByTemplateIDLoader(loaders.DataReader.Store, logger, templateIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateMilestoneSolutionLink](templateIDs, err)
	}

	getKeyFunc := func(data *models.MTOTemplateMilestoneSolutionLink) uuid.UUID {
		// Assuming you have a way to get template ID from the link
		// This might need to be adjusted based on your model structure
		return data.TemplateID
	}

	// implement one to many
	return oneToManyDataLoader(templateIDs, data, getKeyFunc)
}

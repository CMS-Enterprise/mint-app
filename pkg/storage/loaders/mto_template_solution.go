package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoTemplateSolutionLoaders is a struct that holds LoaderWrappers related to MTO Template Solutions
type mtoTemplateSolutionLoaders struct {
	// ByID Gets a MTO Template Solution record by the supplied solution id.
	ByID LoaderWrapper[uuid.UUID, *models.MTOTemplateSolution]
	// ByTemplateID Gets a list of MTO Template Solution records by the supplied template id.
	ByTemplateID LoaderWrapper[uuid.UUID, []*models.MTOTemplateSolution]
	// ByMilestoneID Gets a list of MTO Template Solution records by the supplied milestone id.
	ByMilestoneID LoaderWrapper[uuid.UUID, []*models.MTOTemplateSolution]
}

// MTOTemplateSolution is the singleton instance of all LoaderWrappers related to MTO Template Solutions
var MTOTemplateSolution = &mtoTemplateSolutionLoaders{
	ByID:          NewLoaderWrapper(batchMTOTemplateSolutionGetByID),
	ByTemplateID:  NewLoaderWrapper(batchMTOTemplateSolutionGetByTemplateID),
	ByMilestoneID: NewLoaderWrapper(batchMTOTemplateSolutionGetByMilestoneID),
}

func batchMTOTemplateSolutionGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.MTOTemplateSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOTemplateSolution](ids, err)
	}

	data, err := storage.MTOTemplateSolutionGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOTemplateSolution](ids, err)
	}
	getKeyFunc := func(data *models.MTOTemplateSolution) uuid.UUID {
		return data.ID
	}

	// implement one to one
	return oneToOneDataLoader(ids, data, getKeyFunc)
}

func batchMTOTemplateSolutionGetByTemplateID(ctx context.Context, templateIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOTemplateSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateSolution](templateIDs, err)
	}

	data, err := storage.MTOTemplateSolutionGetByTemplateIDLoader(loaders.DataReader.Store, logger, templateIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateSolution](templateIDs, err)
	}
	getKeyFunc := func(data *models.MTOTemplateSolution) uuid.UUID {
		return data.TemplateID
	}

	// implement one to many
	return oneToManyDataLoader(templateIDs, data, getKeyFunc)
}

// MTOTemplateSolutionGetByMilestoneIDLOADER implements resolver logic to get all MTO template solutions by a milestone ID using a data loader
func batchMTOTemplateSolutionGetByMilestoneID(ctx context.Context, milestoneIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOTemplateSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateSolution](milestoneIDs, err)
	}

	data, err := storage.MTOTemplateSolutionGetByMilestoneIDLoader(loaders.DataReader.Store, logger, milestoneIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateSolution](milestoneIDs, err)
	}
	getKeyFunc := func(data *models.MTOTemplateSolution) uuid.UUID {
		return data.ID
	}

	return oneToManyDataLoader(milestoneIDs, data, getKeyFunc)
}

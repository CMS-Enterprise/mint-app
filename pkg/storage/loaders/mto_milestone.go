package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoMilestoneLoaders is a struct that holds LoaderWrappers related to MTO Milestones
type mtoMilestoneLoaders struct {

	// ByModelPlanID Gets a list of mto Milestone records at the parent level associated with a model plan by the supplied model plan id.
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.MTOMilestone]
	// TODO: (mto) do we need to get by ID ever? By anything else?
}

// MTOMilestone is the singleton instance of all LoaderWrappers related to MTO Milestones
var MTOMilestone = &mtoMilestoneLoaders{
	ByModelPlanID: NewLoaderWrapper(batchMTOMilestoneGetByModelPlanID),
}

func batchMTOMilestoneGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOMilestone] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOMilestone](modelPlanIDs, err)
	}

	data, err := storage.MTOMilestoneGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOMilestone](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.MTOMilestone) uuid.UUID {
		return data.ModelPlanID
	}

	// implement one to many
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)

}

package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoCommonMilestoneLoaders is a struct that holds LoaderWrappers related to MTO Milestones
type mtoCommonMilestoneLoaders struct {

	// ByModelPlanID Gets a list of mto Milestone records associated with a model plan by the supplied model plan id.
	ByModelPlanID LoaderWrapper[*uuid.UUID, []*models.MTOCommonMilestone]
}

// MTOCommonMilestone is the singleton instance of all LoaderWrappers related to MTO Common Milestones
var MTOCommonMilestone = &mtoCommonMilestoneLoaders{
	ByModelPlanID: NewLoaderWrapper(batchMTOCommonMilestoneGetByModelPlanID),
}

func batchMTOCommonMilestoneGetByModelPlanID(ctx context.Context, modelPlanIDs []*uuid.UUID) []*dataloader.Result[[]*models.MTOCommonMilestone] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[*uuid.UUID, []*models.MTOCommonMilestone](modelPlanIDs, err)
	}

	data, err := storage.MTOCommonMilestoneGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[*uuid.UUID, []*models.MTOCommonMilestone](modelPlanIDs, err)
	}
	//TODO revisit this. pointers don't work as expected, we need to perhaps create a version that allows null, or handle the key differently
	getKeyFunc := func(data *models.MTOCommonMilestone) *uuid.UUID {
		return data.ModelPlanID
	}

	// implement one to many
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)

}

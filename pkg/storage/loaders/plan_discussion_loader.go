package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// planBasicsLoaders is a struct that holds LoaderWrappers related to Plan Discussions
type planDiscussionLoaders struct {
	// ByModelPlanID Gets a list of plan discussion records associated with a model plan by the supplied model plan id
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.PlanDiscussion]
}

// PlanDiscussion is the singleton instance of all LoaderWrappers related to Plan Discussions
var PlanDiscussion = &planDiscussionLoaders{
	ByModelPlanID: NewLoaderWrapper(batchPlanDiscussionGetByModelPlanID),
}

func batchPlanDiscussionGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.PlanDiscussion] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.PlanDiscussion](modelPlanIDs, err)
	}

	data, err := storage.PlanDiscussionGetByModelPlanIDLOADER(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.PlanDiscussion](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.PlanDiscussion) uuid.UUID {
		return data.ModelPlanID
	}

	// implement one to many
	return oneToManyDataLoaderFuncSimplified(modelPlanIDs, data, getKeyFunc)

}

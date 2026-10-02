package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// suggestedWaiverLoaders is a struct that holds LoaderWrappers related to SuggestedWaiver
type suggestedWaiverLoaders struct {
	// ByModelPlanID gets all SuggestedWaiver rows associated with a model plan id (one-to-many)
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.SuggestedWaiver]
}

var SuggestedWaiver = &suggestedWaiverLoaders{
	ByModelPlanID: NewLoaderWrapper(batchSuggestedWaiversByModelPlanID),
}

func batchSuggestedWaiversByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.SuggestedWaiver] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.SuggestedWaiver](modelPlanIDs, err)
	}

	data, err := storage.SuggestedWaiverGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.SuggestedWaiver](modelPlanIDs, err)
	}
	getKeyFunc := func(sw *models.SuggestedWaiver) uuid.UUID {
		return sw.ModelPlanID
	}
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)
}

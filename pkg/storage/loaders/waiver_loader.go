package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// waiverLoaders is a struct that holds LoaderWrappers related to Waiver
type waiverLoaders struct {
	// ByModelPlanID gets all Waiver rows associated with a model plan id (one-to-many)
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.Waiver]
}

var Waiver = &waiverLoaders{
	ByModelPlanID: NewLoaderWrapper(batchWaiversByModelPlanID),
}

func batchWaiversByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.Waiver] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.Waiver](modelPlanIDs, err)
	}

	data, err := storage.WaiverGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.Waiver](modelPlanIDs, err)
	}
	getKeyFunc := func(w *models.Waiver) uuid.UUID {
		return w.ModelPlanID
	}
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)
}

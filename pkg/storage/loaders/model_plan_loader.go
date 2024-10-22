package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// modelPlanLoaders is a struct that holds LoaderWrappers related to Model Plans
type modelPlanLoaders struct {
	// GetByID returns a model plan record associated with a uuid
	GetByID LoaderWrapper[uuid.UUID, *models.ModelPlan]
}

// ModelPlan is the singleton instance of all LoaderWrappers related to Model Plans
var ModelPlan = &modelPlanLoaders{
	GetByID: NewLoaderWrapper(batchModelPlanByModelPlanID),
}

func batchModelPlanByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[*models.ModelPlan] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.ModelPlan](modelPlanIDs, err)
	}

	data, err := storage.ModelPlansGetByModePlanIDsLOADER(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.ModelPlan](modelPlanIDs, err)
	}
	getKeyFunc := func(modelPlan *models.ModelPlan) uuid.UUID {
		return modelPlan.ID
	}

	return oneToOneDataLoader(modelPlanIDs, data, getKeyFunc)
}

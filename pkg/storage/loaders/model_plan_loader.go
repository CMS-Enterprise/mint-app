package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// modelPlanLoaders is a struct that holds LoaderWrappers related to Model Plans
type modelPlanLoaders struct {
	// GetByID returns a model plan record associated with a uuid
	GetByID          LoaderWrapper[uuid.UUID, *models.ModelPlan]
	ByCTATRequestID  LoaderWrapper[uuid.UUID, []*models.ModelPlan]
	ByMTOSolutionKey LoaderWrapper[models.MTOCommonSolutionKey, []*models.ModelPlanAndMTOCommonSolution]
}

// ModelPlan is the singleton instance of all LoaderWrappers related to Model Plans
var ModelPlan = &modelPlanLoaders{
	GetByID:          NewLoaderWrapper(batchModelPlanByModelPlanID),
	ByCTATRequestID:  NewLoaderWrapper(batchModelPlanGetByCTATRequestID),
	ByMTOSolutionKey: NewLoaderWrapper(batchModelPlanGetByMTOSolutionKey),
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

func batchModelPlanGetByCTATRequestID(ctx context.Context, ctatRequestIDs []uuid.UUID) []*dataloader.Result[[]*models.ModelPlan] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.ModelPlan](ctatRequestIDs, err)
	}

	data, err := storage.ModelPlansGetByCTATRequestIDsLOADER(loaders.DataReader.Store, logger, ctatRequestIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.ModelPlan](ctatRequestIDs, err)
	}

	getKeyFunc := func(data *models.ModelPlanWithCTATRequestID) uuid.UUID {
		return data.CTATRequestID
	}

	getResFunc := func(key uuid.UUID, resMap map[uuid.UUID][]*models.ModelPlanWithCTATRequestID) ([]*models.ModelPlan, bool) {
		res, ok := resMap[key]
		converted := make([]*models.ModelPlan, len(res))

		for i, planWithCTATRequestID := range res {
			converted[i] = planWithCTATRequestID.ToModelPlan()
		}

		return converted, ok
	}

	return oneToManyWithCustomKeyDataLoader(ctatRequestIDs, data, getKeyFunc, getResFunc)
}

// Add the batch function
func batchModelPlanGetByMTOSolutionKey(ctx context.Context, keys []models.MTOCommonSolutionKey) []*dataloader.Result[[]*models.ModelPlanAndMTOCommonSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[models.MTOCommonSolutionKey, []*models.ModelPlanAndMTOCommonSolution](keys, err)
	}

	data, err := storage.ModelPlanGetByMTOSolutionKeyLOADER(loaders.DataReader.Store, logger, keys)
	if err != nil {
		return errorPerEachKey[models.MTOCommonSolutionKey, []*models.ModelPlanAndMTOCommonSolution](keys, err)
	}

	getKeyFunc := func(data *models.ModelPlanAndMTOCommonSolution) models.MTOCommonSolutionKey {
		return data.Key
	}

	return oneToManyDataLoader(keys, data, getKeyFunc)
}

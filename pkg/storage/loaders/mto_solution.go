package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoSolutionLoaders is a struct that holds LoaderWrappers related to MTO Solutions
type mtoSolutionLoaders struct {
	// ByID Gets a list of mto Solution records by the supplied solution id.
	ByID LoaderWrapper[uuid.UUID, *models.MTOSolution]
	// ByModelPlanID Gets a list of mto Solution records associated with a model plan by the supplied model plan id.
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.MTOSolution]
	// ByModelPlanIDAndFilterView Gets a list of mto Solution records associated with a model plan as well as a filterView.
	ByModelPlanIDAndFilterView LoaderWrapper[storage.MTOSolutionByModelPlanIDAndFilterViewKey, []*models.MTOSolution]
	// ByMilestoneID Gets a list of mto Solution records associated with a milestone by the supplied milestone id.
	ByMilestoneID LoaderWrapper[uuid.UUID, []*models.MTOSolution]
}

// MTOSolution is the singleton instance of all LoaderWrappers related to MTO Solutions
var MTOSolution = &mtoSolutionLoaders{
	ByID:                       NewLoaderWrapper(batchMTOSolutionGetByID),
	ByModelPlanID:              NewLoaderWrapper(batchMTOSolutionGetByModelPlanID),
	ByModelPlanIDAndFilterView: NewLoaderWrapper(batchMTOSolutionGetByModelPlanIDAndFilterView),
	ByMilestoneID:              NewLoaderWrapper(batchMTOSolutionGetByMilestoneID),
}

func batchMTOSolutionGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.MTOSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOSolution](ids, err)
	}

	data, err := storage.MTOSolutionGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOSolution](ids, err)
	}
	getKeyFunc := func(data *models.MTOSolution) uuid.UUID {
		return data.ID
	}

	// implement one to one
	return oneToOneDataLoader(ids, data, getKeyFunc)
}

func batchMTOSolutionGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOSolution](modelPlanIDs, err)
	}

	data, err := storage.MTOSolutionGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOSolution](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.MTOSolution) uuid.UUID {
		return data.ModelPlanID
	}

	// implement one to many
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)
}

func batchMTOSolutionGetByModelPlanIDAndFilterView(ctx context.Context, keys []storage.MTOSolutionByModelPlanIDAndFilterViewKey) []*dataloader.Result[[]*models.MTOSolution] {
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[storage.MTOSolutionByModelPlanIDAndFilterViewKey, []*models.MTOSolution](keys, err)
	}
	logger := appcontext.ZLogger(ctx)

	data, err := storage.MTOSolutionGetByModelPlanIDAndFilterViewLoader(loaders.DataReader.Store, logger, keys)
	if err != nil {
		return errorPerEachKey[storage.MTOSolutionByModelPlanIDAndFilterViewKey, []*models.MTOSolution](keys, err)
	}
	//TODO: we will need to extend this implementation as the return type doesn't have filter view,
	// we need to use a custom implementation so that the data returns a solution with a filter view (that can never be nil)
	getKeyFunc := func(data *models.MTOSolutionWithModelFilterView) storage.MTOSolutionByModelPlanIDAndFilterViewKey {
		return storage.MTOSolutionByModelPlanIDAndFilterViewKey{
			ModelPlanID: data.ModelPlanID,
			FilterView:  data.FilterView,
		}

	}
	// TODO: verify that this method works as expected since  storage.MTOSolutionByModelPlanIDAndFilterViewKey is complex
	getResFunc := func(key storage.MTOSolutionByModelPlanIDAndFilterViewKey, resMap map[storage.MTOSolutionByModelPlanIDAndFilterViewKey][]*models.MTOSolutionWithModelFilterView) ([]*models.MTOSolution, bool) {
		res, ok := resMap[key]
		converted := make([]*models.MTOSolution, len(res))

		for i, mtoWith := range res {
			converted[i] = mtoWith.ToMTOSolution()
		}
		//iterate through and convert each
		return converted, ok
	}

	// implement one to many
	return oneToManyWithCustomKeyDataLoader(keys, data, getKeyFunc, getResFunc)

}

func batchMTOSolutionGetByMilestoneID(ctx context.Context, milestoneIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOSolution](milestoneIDs, err)
	}

	data, err := storage.MTOSolutionGetByMilestoneIDLoader(loaders.DataReader.Store, logger, milestoneIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOSolution](milestoneIDs, err)
	}

	getResFunc := func(key uuid.UUID, resMap map[uuid.UUID][]*models.MTOSolutionWithMilestoneID) ([]*models.MTOSolution, bool) {
		// TODO: (mto) see if we can genericize this so we only have to call mtoWith.ToMTOMilestone() instead of iterating too
		res, ok := resMap[key]
		converted := make([]*models.MTOSolution, len(res))

		for i, mtoWith := range res {
			converted[i] = mtoWith.ToMTOSolution()
		}
		//iterate through and convert each
		return converted, ok
	}
	getKeyFunc := func(data *models.MTOSolutionWithMilestoneID) uuid.UUID {
		return data.MilestoneID
	}

	return oneToManyWithCustomKeyDataLoader(milestoneIDs, data, getKeyFunc, getResFunc)

}

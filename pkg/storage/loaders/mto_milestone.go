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

	// ByModelPlanID Gets a list of mto Milestone records associated with a model plan by the supplied model plan id.
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.MTOMilestone]
	// ByModelPlanIDAndMTOCategoryID Gets a list of mto Milestone records associated with a model plan a specific category
	ByModelPlanIDAndMTOCategoryID LoaderWrapper[storage.MTOMilestoneByModelPlanAndCategoryKey, []*models.MTOMilestone]
	// By ID returns an MTOCategory by it's id. Note, it could actually be a subcategory as well, but it is returned as a regular category
	ByID LoaderWrapper[uuid.UUID, *models.MTOMilestone]
	// BySolutionID Gets a list of mto Milestone records associated with a solution by the supplied solution id.
	BySolutionID LoaderWrapper[uuid.UUID, []*models.MTOMilestone]
	// ByModelPlanIDNoLinkedSolution Gets a list of mto Milestone records associated with a model plan by the supplied model plan id that are not linked to a solution
	ByModelPlanIDNoLinkedSolution LoaderWrapper[uuid.UUID, []*models.MTOMilestone]
}

// MTOMilestone is the singleton instance of all LoaderWrappers related to MTO Milestones
var MTOMilestone = &mtoMilestoneLoaders{
	ByModelPlanID:                 NewLoaderWrapper(batchMTOMilestoneGetByModelPlanID),
	ByModelPlanIDAndMTOCategoryID: NewLoaderWrapper(batchMTOMilestoneGetByModelPlanIDAndMTOCategoryID),
	ByID:                          NewLoaderWrapper(batchMTOMilestoneGetByID),
	BySolutionID:                  NewLoaderWrapper(batchMTOMilestoneGetBySolutionID),
	ByModelPlanIDNoLinkedSolution: NewLoaderWrapper(batchMTOMilestoneGetByModelPlanIDNoLinkedSolution),
}

func batchMTOMilestoneGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.MTOMilestone] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOMilestone](ids, err)
	}
	data, err := storage.MTOMilestoneGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOMilestone](ids, err)
	}
	getKeyFunc := func(data *models.MTOMilestone) uuid.UUID {
		return data.ID
	}
	return oneToOneDataLoader(ids, data, getKeyFunc)
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

func batchMTOMilestoneGetByModelPlanIDAndMTOCategoryID(ctx context.Context, keys []storage.MTOMilestoneByModelPlanAndCategoryKey) []*dataloader.Result[[]*models.MTOMilestone] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[storage.MTOMilestoneByModelPlanAndCategoryKey, []*models.MTOMilestone](keys, err)
	}

	data, err := storage.MTOMilestoneGetByModelPlanIDAndCategoryIDLoader(loaders.DataReader.Store, logger, keys)
	if err != nil {
		return errorPerEachKey[storage.MTOMilestoneByModelPlanAndCategoryKey, []*models.MTOMilestone](keys, err)
	}
	getKeyFunc := func(data *models.MTOMilestone) storage.MTOMilestoneByModelPlanAndCategoryKey {
		var categoryID uuid.UUID

		if data.MTOCategoryID != nil {
			categoryID = *data.MTOCategoryID
		}

		return storage.MTOMilestoneByModelPlanAndCategoryKey{
			ModelPlanID:   data.ModelPlanID,
			MTOCategoryID: categoryID,
		}
	}

	// implement one to many
	return oneToManyDataLoader(keys, data, getKeyFunc)
}

func batchMTOMilestoneGetBySolutionID(ctx context.Context, solutionIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOMilestone] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOMilestone](solutionIDs, err)
	}

	data, err := storage.MTOMilestoneGetBySolutionIDLoader(loaders.DataReader.Store, logger, solutionIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOMilestone](solutionIDs, err)
	}

	getResFunc := func(key uuid.UUID, resMap map[uuid.UUID][]*models.MTOMilestoneWithSolutionID) ([]*models.MTOMilestone, bool) {
		// TODO: (mto) see if we can genericize this so we only have to call mtoWith.ToMTOMilestone() instead of iterating too
		res, ok := resMap[key]
		converted := make([]*models.MTOMilestone, len(res))

		for i, mtoWith := range res {
			converted[i] = mtoWith.ToMTOMilestone()
		}
		//iterate through and convert each
		return converted, ok
	}

	getKeyFunc := func(data *models.MTOMilestoneWithSolutionID) uuid.UUID {
		return data.SolutionID
	}

	return oneToManyWithCustomKeyDataLoader(solutionIDs, data, getKeyFunc, getResFunc)

}

func batchMTOMilestoneGetByModelPlanIDNoLinkedSolution(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOMilestone] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOMilestone](modelPlanIDs, err)
	}

	data, err := storage.MTOMilestoneGetByModelPlanIDNoLinkedSolutionLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOMilestone](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.MTOMilestone) uuid.UUID {
		return data.ModelPlanID
	}

	// implement one to many
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)
}

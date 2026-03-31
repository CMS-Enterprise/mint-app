package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoCommonSolutionLoaders is a struct that holds LoaderWrappers related to MTO Solutions
type mtoCommonSolutionLoaders struct {

	// ByModelPlanID Gets a list of mto Common Solution records  with  contextual data based on its associated with a model plan by the supplied model plan id.
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.MTOCommonSolution]

	// ByKey returns a list of mto Common Solution records by it's keys. It does not currently have contextual data
	ByKey LoaderWrapper[models.MTOCommonSolutionKey, *models.MTOCommonSolution]

	// ByCommonMilestoneID returns a list of mto Common Solution records by it's common milestone id. It does not currently have contextual data
	ByCommonMilestoneID LoaderWrapper[uuid.UUID, []*models.MTOCommonSolution]

	// ByID returns a list of mto Common Solution records by it's id. It does not currently have contextual data
	ByID LoaderWrapper[uuid.UUID, *models.MTOCommonSolution]
}

// MTOCommonSolution is the singleton instance of all LoaderWrappers related to MTO Common Solutions
var MTOCommonSolution = &mtoCommonSolutionLoaders{
	ByModelPlanID:       NewLoaderWrapper(batchMTOCommonSolutionGetByModelPlanID),
	ByKey:               NewLoaderWrapper(batchMTOCommonSolutionGetByKey),
	ByCommonMilestoneID: NewLoaderWrapper(batchMTOCommonSolutionGetByCommonMilestoneID),
	ByID:                NewLoaderWrapper(batchMTOCommonSolutionGetByID),
}

//Future Enhancement (mto) revisit this and see if you can refactor the dataloader to take *uuid.UUID. The only part that doesn't work is onePerMany,
// because a pointer of a map key is comparing the pointer address, not value.
// Currently we are relying in uuid.Nil (0000-0000-etc) to represent nil

// batchMTOCommonSolutionGetByModelPlanID returns a list of common Solutions as a dataloader.Result for a list of modelPlanIDS
func batchMTOCommonSolutionGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOCommonSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOCommonSolution](modelPlanIDs, err)
	}

	data, err := storage.MTOCommonSolutionGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOCommonSolution](modelPlanIDs, err)
	}

	getKeyFunc := func(data *models.MTOCommonSolution) uuid.UUID {
		if data.ModelPlanID != nil {
			return *data.ModelPlanID
		}
		// We use UUID.Nil for a nil value as a map to pointers doesn't compare the value
		return uuid.Nil
	}

	// implement one to many
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)

}

// batchMTOCommonSolutionGetByKey returns a list of common Solutions as a dataloader.Result for a list of commonSolutionKeys
func batchMTOCommonSolutionGetByKey(ctx context.Context, commonSolutionKeys []models.MTOCommonSolutionKey) []*dataloader.Result[*models.MTOCommonSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[models.MTOCommonSolutionKey, *models.MTOCommonSolution](commonSolutionKeys, err)
	}

	data, err := storage.MTOCommonSolutionGetByKeyLoader(loaders.DataReader.Store, logger, commonSolutionKeys)
	if err != nil {
		return errorPerEachKey[models.MTOCommonSolutionKey, *models.MTOCommonSolution](commonSolutionKeys, err)
	}

	getKeyFunc := func(data *models.MTOCommonSolution) models.MTOCommonSolutionKey {
		return data.Key
	}

	// implement one to many
	return oneToOneDataLoader(commonSolutionKeys, data, getKeyFunc)

}

// batchMTOCommonSolutionGetByCommonMilestoneID returns a list of common Solutions as a dataloader.Result for a list of commonMilestoneIDs (they are linked)
func batchMTOCommonSolutionGetByCommonMilestoneID(ctx context.Context, commonMilestoneIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOCommonSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOCommonSolution](commonMilestoneIDs, err)
	}

	data, err := storage.MTOCommonSolutionGetByCommonMilestoneIDLoader(loaders.DataReader.Store, logger, commonMilestoneIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOCommonSolution](commonMilestoneIDs, err)
	}

	getKeyFunc := func(data *models.MTOCommonSolution) uuid.UUID {
		if data.CommonMilestoneID != nil {
			return *data.CommonMilestoneID
		}

		return uuid.Nil
	}

	// implement one to many
	return oneToManyDataLoader(commonMilestoneIDs, data, getKeyFunc)

}

// batchMTOCommonSolutionGetByID returns MTO common solutions associated by a list of ids
func batchMTOCommonSolutionGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.MTOCommonSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOCommonSolution](ids, err)
	}

	data, err := storage.MTOCommonSolutionGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOCommonSolution](ids, err)
	}

	getKeyFunc := func(data *models.MTOCommonSolution) uuid.UUID {
		return data.ID
	}

	return oneToOneDataLoader(ids, data, getKeyFunc)
}

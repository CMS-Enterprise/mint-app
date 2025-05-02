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

	// ByCommonMilestoneKey returns a list of mto Common Solution records by it's keys. It does not currently have contextual data
	ByCommonMilestoneKey LoaderWrapper[models.MTOCommonMilestoneKey, []*models.MTOCommonSolution]
}

// MTOCommonSolution is the singleton instance of all LoaderWrappers related to MTO Common Solutions
var MTOCommonSolution = &mtoCommonSolutionLoaders{
	ByModelPlanID:        NewLoaderWrapper(batchMTOCommonSolutionGetByModelPlanID),
	ByKey:                NewLoaderWrapper(batchMTOCommonSolutionGetByKey),
	ByCommonMilestoneKey: NewLoaderWrapper(batchMTOCommonSolutionGetByCommonMilestoneKey),
}

//TODO (mto) revisit this and see if you can refactor the dataloader to take *uuid.UUID. The only part that doesn't work is onePerMany,
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

// batchMTOCommonSolutionGetByCommonMilestoneKey returns a list of common Solutions as a dataloader.Result for a list of commonMilestoneKeys (they are linked)
func batchMTOCommonSolutionGetByCommonMilestoneKey(ctx context.Context, commonMilestoneKeys []models.MTOCommonMilestoneKey) []*dataloader.Result[[]*models.MTOCommonSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[models.MTOCommonMilestoneKey, []*models.MTOCommonSolution](commonMilestoneKeys, err)
	}

	data, err := storage.MTOCommonSolutionGetByCommonMilestoneKeyLoader(loaders.DataReader.Store, logger, commonMilestoneKeys)
	if err != nil {
		return errorPerEachKey[models.MTOCommonMilestoneKey, []*models.MTOCommonSolution](commonMilestoneKeys, err)
	}

	getKeyFunc := func(data *models.MTOCommonSolution) models.MTOCommonMilestoneKey {
		if data.CommonMilestoneKey != nil {
			return *data.CommonMilestoneKey
		}
		// We use empty string for safety since the data model is a pointer. In practice, this should be populated from the query
		return ""
	}

	// implement one to many
	return oneToManyDataLoader(commonMilestoneKeys, data, getKeyFunc)

}

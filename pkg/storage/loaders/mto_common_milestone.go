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

	// ByModelPlanID Gets a list of mto Common Milestone records  with  contextual data based on its associated with a model plan by the supplied model plan id.
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.MTOCommonMilestone]

	// ByID returns an MTO Common Milestone associated with a specific ID. It doesn't return any meta data for it.
	ByID LoaderWrapper[uuid.UUID, *models.MTOCommonMilestone]
}

// MTOCommonMilestone is the singleton instance of all LoaderWrappers related to MTO Common Milestones
var MTOCommonMilestone = &mtoCommonMilestoneLoaders{
	ByModelPlanID: NewLoaderWrapper(batchMTOCommonMilestoneGetByModelPlanID),
	ByID:          NewLoaderWrapper(batchMTOCommonMilestoneGetByID),
}

//Future Enhancement (mto) revisit this and see if you can refactor the dataloader to take *uuid.UUID. The only part that doesn't work is onePerMany,
// because a pointer of a map key is comparing the pointer address, not value.
// Currently we are relying in uuid.Nil (0000-0000-etc) to represent nil

// batchMTOCommonMilestoneGetByModelPlanID returns a list of common milestones as a dataloader.Result for a list of modelPlanIDS
func batchMTOCommonMilestoneGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOCommonMilestone] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOCommonMilestone](modelPlanIDs, err)
	}

	data, err := storage.MTOCommonMilestoneGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOCommonMilestone](modelPlanIDs, err)
	}

	getKeyFunc := func(data *models.MTOCommonMilestone) uuid.UUID {
		if data.ModelPlanID != nil {
			return *data.ModelPlanID
		}
		// We use UUID.Nil for a nil value as a map to pointers doesn't compare the value
		return uuid.Nil
	}

	// implement one to many
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)

}

// batchMTOCommonMilestoneGetByID returns a list of common milestones as a dataloader.Result for a list of commonMilestoneIDs
func batchMTOCommonMilestoneGetByID(ctx context.Context, commonMilestoneIDs []uuid.UUID) []*dataloader.Result[*models.MTOCommonMilestone] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOCommonMilestone](commonMilestoneIDs, err)
	}

	data, err := storage.MTOCommonMilestoneGetByIDLoader(loaders.DataReader.Store, logger, commonMilestoneIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOCommonMilestone](commonMilestoneIDs, err)
	}

	getKeyFunc := func(data *models.MTOCommonMilestone) uuid.UUID {
		return data.ID
	}

	// implement one to many
	return oneToOneDataLoader(commonMilestoneIDs, data, getKeyFunc)

}

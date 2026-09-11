package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// commonWaiverLoaders is a struct that holds LoaderWrappers related to the CommonWaiver
type commonWaiverLoaders struct {
	// ByID gets a CommonWaiver record by the supplied ID
	ByID LoaderWrapper[uuid.UUID, *models.CommonWaiver]

	// GetAllByModelPlanID gets all CommonWaiver records by the optional model_plan_ID.
	// if model plan id is not provided, it will return the records without the contextual information.
	GetAllByModelPlanID LoaderWrapper[uuid.UUID, []*models.CommonWaiver]
}

var CommonWaiver = &commonWaiverLoaders{
	ByID:                NewLoaderWrapper(batchCommonWaiverByID),
	GetAllByModelPlanID: NewLoaderWrapper(batchCommonWaiverGetByModelPlanIDAll),
}

func batchCommonWaiverByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.CommonWaiver] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.CommonWaiver](ids, err)
	}

	data, err := storage.CommonWaiverGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.CommonWaiver](ids, err)
	}
	getKeyFunc := func(data *models.CommonWaiver) uuid.UUID {
		return data.ID
	}
	return oneToOneDataLoader(ids, data, getKeyFunc)
}

func batchCommonWaiverGetByModelPlanIDAll(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.CommonWaiver] {
	loaders, err := Loaders(ctx)

	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CommonWaiver](modelPlanIDs, err)
	}

	logger := appcontext.ZLogger(ctx)

	data, err := storage.CommonWaiverGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CommonWaiver](modelPlanIDs, err)
	}

	getKeyFunc := func(data *models.CommonWaiver) uuid.UUID {
		if data.ModelPlanID != nil {
			return *data.ModelPlanID
		}
		// We use UUID.Nil for a nil value as a map to pointers doesn't compare the value
		return uuid.Nil
	}
	// implement one to many
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)

}

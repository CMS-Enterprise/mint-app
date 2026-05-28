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

	// GetAll gets all CommonWaiver records
	GetAll LoaderWrapper[*uuid.UUID, []*models.CommonWaiver]
}

var CommonWaiver = &commonWaiverLoaders{
	ByID:   NewLoaderWrapper(batchCommonWaiverByID),
	GetAll: NewLoaderWrapper(batchCommonWaiverGetAll),
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

func batchCommonWaiverGetAll(ctx context.Context, ids []*uuid.UUID) []*dataloader.Result[[]*models.CommonWaiver] {
	loaders, err := Loaders(ctx)

	if err != nil {
		return errorPerEachKey[*uuid.UUID, []*models.CommonWaiver](ids, err)
	}

	logger := appcontext.ZLogger(ctx)

	data, err := storage.CommonWaiverGetAll(loaders.DataReader.Store, logger)
	if err != nil {
		return errorPerEachKey[*uuid.UUID, []*models.CommonWaiver](ids, err)
	}

	// Since this is "get all", every key gets the same result
	results := make([]*dataloader.Result[[]*models.CommonWaiver], len(ids))
	for i := range ids {
		results[i] = &dataloader.Result[[]*models.CommonWaiver]{Data: data}
	}
	return results
}

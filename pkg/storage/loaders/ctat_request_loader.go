package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// ctatRequestLoaders holds LoaderWrappers related to CTAT requests.
type ctatRequestLoaders struct {
	// GetByID gets a CTAT request by ID.
	GetByID LoaderWrapper[uuid.UUID, *models.CTATRequest]
	// ByRequesterID gets CTAT requests grouped by requester.
	ByRequesterID LoaderWrapper[uuid.UUID, []*models.CTATRequest]
}

// CTATRequest is the singleton instance of all LoaderWrappers related to CTAT requests.
var CTATRequest = &ctatRequestLoaders{
	GetByID:       NewLoaderWrapper(batchCTATRequestGetByID),
	ByRequesterID: NewLoaderWrapper(batchCTATRequestGetByRequesterID),
}

func batchCTATRequestGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.CTATRequest] {
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.CTATRequest](ids, err)
	}

	data, err := storage.CTATRequestGetByIDLOADER(loaders.DataReader.Store, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.CTATRequest](ids, err)
	}

	getKeyFunc := func(data *models.CTATRequest) uuid.UUID {
		return data.ID
	}

	return oneToOneDataLoader(ids, data, getKeyFunc)
}

func batchCTATRequestGetByRequesterID(ctx context.Context, requesterIDs []uuid.UUID) []*dataloader.Result[[]*models.CTATRequest] {
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CTATRequest](requesterIDs, err)
	}

	data, err := storage.CTATRequestGetByRequesterIDLOADER(loaders.DataReader.Store, requesterIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CTATRequest](requesterIDs, err)
	}

	getKeyFunc := func(data *models.CTATRequest) uuid.UUID {
		return data.Requester
	}

	return oneToManyDataLoader(requesterIDs, data, getKeyFunc)
}

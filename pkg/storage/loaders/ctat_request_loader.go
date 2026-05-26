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
	// ByRequesterID gets lite CTAT requests grouped by requester.
	ByRequesterID LoaderWrapper[uuid.UUID, []*models.CTATRequestLite]
}

// CTATRequest is the singleton instance of all LoaderWrappers related to CTAT requests.
var CTATRequest = &ctatRequestLoaders{
	ByRequesterID: NewLoaderWrapper(batchCTATRequestLiteGetByRequesterID),
}

func batchCTATRequestLiteGetByRequesterID(ctx context.Context, requesterIDs []uuid.UUID) []*dataloader.Result[[]*models.CTATRequestLite] {
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CTATRequestLite](requesterIDs, err)
	}

	data, err := storage.CTATRequestLiteGetByRequesterIDLOADER(loaders.DataReader.Store, requesterIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CTATRequestLite](requesterIDs, err)
	}

	getKeyFunc := func(data *models.CTATRequestLite) uuid.UUID {
		return data.Requester
	}

	return oneToManyDataLoader(requesterIDs, data, getKeyFunc)
}

package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// ctatRequestDocumentLoaders holds LoaderWrappers related to CTAT request documents.
type ctatRequestDocumentLoaders struct {
	// ByCTATRequestID gets CTAT request documents grouped by CTAT request.
	ByCTATRequestID LoaderWrapper[uuid.UUID, []*models.CTATRequestDocument]
}

// CTATRequestDocument is the singleton instance of all LoaderWrappers related to CTAT request documents.
var CTATRequestDocument = &ctatRequestDocumentLoaders{
	ByCTATRequestID: NewLoaderWrapper(batchCTATRequestDocumentGetByCTATRequestID),
}

func batchCTATRequestDocumentGetByCTATRequestID(ctx context.Context, ctatRequestIDs []uuid.UUID) []*dataloader.Result[[]*models.CTATRequestDocument] {
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CTATRequestDocument](ctatRequestIDs, err)
	}

	data, err := storage.CTATRequestDocumentGetByCTATRequestIDLOADER(loaders.DataReader.Store, ctatRequestIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CTATRequestDocument](ctatRequestIDs, err)
	}

	getKeyFunc := func(data *models.CTATRequestDocument) uuid.UUID {
		return data.CTATRequestID
	}

	return oneToManyDataLoader(ctatRequestIDs, data, getKeyFunc)
}

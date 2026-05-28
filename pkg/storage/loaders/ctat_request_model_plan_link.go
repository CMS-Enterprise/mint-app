package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// ctatRequestModelPlanLinkLoaders holds LoaderWrappers related to CTAT request model-plan links.
type ctatRequestModelPlanLinkLoaders struct {
	// ByCTATRequestID gets CTAT request model-plan links grouped by CTAT request.
	ByCTATRequestID LoaderWrapper[uuid.UUID, []*models.CTATRequestModelPlanLink]
}

// CTATRequestModelPlanLink is the singleton instance of all LoaderWrappers related to CTAT request model-plan links.
var CTATRequestModelPlanLink = &ctatRequestModelPlanLinkLoaders{
	ByCTATRequestID: NewLoaderWrapper(batchCTATRequestModelPlanLinkGetByCTATRequestID),
}

func batchCTATRequestModelPlanLinkGetByCTATRequestID(ctx context.Context, ctatRequestIDs []uuid.UUID) []*dataloader.Result[[]*models.CTATRequestModelPlanLink] {
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CTATRequestModelPlanLink](ctatRequestIDs, err)
	}

	data, err := storage.CTATRequestModelPlanLinkGetByCTATRequestIDLOADER(loaders.DataReader.Store, ctatRequestIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CTATRequestModelPlanLink](ctatRequestIDs, err)
	}

	getKeyFunc := func(data *models.CTATRequestModelPlanLink) uuid.UUID {
		return data.CTATRequestID
	}

	return oneToManyDataLoader(ctatRequestIDs, data, getKeyFunc)
}

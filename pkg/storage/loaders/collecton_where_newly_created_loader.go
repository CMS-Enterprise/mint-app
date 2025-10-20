package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"

	"github.com/graph-gophers/dataloader/v7"
)

// modelPlanAndGroupLoaders is a struct that holds LoaderWrappers related to ModelPlanAndGroup
type collectionWhereNewlyCreatedLoaders struct {
	// CollectionWhereNewlyCreated returns model plans for a specific model plan filter
	CollectionWhereNewlyCreated LoaderWrapper[uuid.UUID, []*models.ModelPlan]
}

// CollectionWhereNewlyCreated is the singleton instance of all LoaderWrappers related to CollectionWhereNewlyCreated
var CollectionWhereNewlyCreated = &collectionWhereNewlyCreatedLoaders{
	CollectionWhereNewlyCreated: NewLoaderWrapper(batchCollectionWhereNewlyCreated),
}

func batchCollectionWhereNewlyCreated(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.ModelPlan] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.ModelPlan]([]uuid.UUID{}, err)
	}

	data, err := loaders.DataReader.Store.ModelPlanCollectionNewlyCreatedLOADER(logger)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.ModelPlan]([]uuid.UUID{}, err)
	}

	return oneToManyDataLoader([]uuid.UUID{}, data, nil)

}

package loaders

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"

	"github.com/graph-gophers/dataloader/v7"
)

// modelPlanAndGroupLoaders is a struct that holds LoaderWrappers related to ModelPlanAndGroup
type modelPlanAndGroupLoaders struct {
	// ByComponentGroup returns model plans for a specific component group key
	ByComponentGroup LoaderWrapper[models.ComponentGroup, []*models.ModelPlanAndGroup]
}

// ModelPlanAndGroup is the singleton instance of all LoaderWrappers related to ModelPlanAndGroup
var ModelPlanAndGroup = &modelPlanAndGroupLoaders{
	ByComponentGroup: NewLoaderWrapper(batchModelPlansByComponentGroup),
}

func batchModelPlansByComponentGroup(ctx context.Context, componentGroups []models.ComponentGroup) []*dataloader.Result[[]*models.ModelPlanAndGroup] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[models.ComponentGroup, []*models.ModelPlanAndGroup](componentGroups, err)
	}

	data, err := loaders.DataReader.Store.ModelPlanGetByComponentGroupLoader(logger, componentGroups)
	if err != nil {
		return errorPerEachKey[models.ComponentGroup, []*models.ModelPlanAndGroup](componentGroups, err)
	}

	getKeyFunc := func(modelPlanAndGroup *models.ModelPlanAndGroup) models.ComponentGroup {
		return modelPlanAndGroup.ComponentGroup
	}

	return oneToManyDataLoader(componentGroups, data, getKeyFunc)
}

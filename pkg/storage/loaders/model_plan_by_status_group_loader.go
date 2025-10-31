package loaders

import (
	"context"

	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/logfields"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// modelPlanByStatusGroup is a struct that holds LoaderWrappers related to ModelPlanByStatusGroup
type modelPlanByStatusGroupLoaders struct {
	// ByStatus returns model plans for a specific status
	ByStatusGroup LoaderWrapper[models.ModelPlanStatusGroup, []*models.ModelPlan]
}

// ModelPlanByStatusGroup is the singleton instance of all LoaderWrappers related to ModelPlanByStatusGroup
var ModelPlanByStatusGroup = &modelPlanByStatusGroupLoaders{
	ByStatusGroup: NewLoaderWrapper(batchModelPlansGetByStatusGroup),
}

func batchModelPlansGetByStatusGroup(ctx context.Context, statusGroup []models.ModelPlanStatusGroup) []*dataloader.Result[[]*models.ModelPlan] {
	logger := appcontext.ZLogger(ctx).With(logfields.DataLoaderAppSection)
	loaders, err := Loaders(ctx)
	_ = logger
	if err != nil {
		return errorPerEachKey[models.ModelPlanStatusGroup, []*models.ModelPlan](statusGroup, err)
	}

	// Get all relevant statuses for the requested status groups
	// 1. flatten the list of statuses
	// 2. get unique statuses only
	allStatuses := lo.Uniq(lo.FlatMap(statusGroup, func(group models.ModelPlanStatusGroup, _ int) []models.ModelStatus {
		return models.ModelPlanStatusGroupToModelStatus[group]
	}))

	data, err := storage.ModelPlanGetByStatuses(loaders.DataReader.Store, logger, allStatuses)
	if err != nil {
		return errorPerEachKey[models.ModelPlanStatusGroup, []*models.ModelPlan](statusGroup, err)
	}

	getKeyFunc := func(modelPlan *models.ModelPlan) models.ModelStatus {
		return modelPlan.Status
	}

	// This get res function uses two different keys,
	// 1. to make a map of model plans by Model Status
	// 2. to get model plans by Model Plan Status Group by looking up all relevant Model Statuses for that group
	// Get res then combines the list and returns the results in the order requested by the dataloader
	getResFunc := func(key models.ModelPlanStatusGroup, resMap map[models.ModelStatus][]*models.ModelPlan) ([]*models.ModelPlan, bool) {
		// Get all the statuses for that status group
		relevantStatuses := models.ModelPlanStatusGroupToModelStatus[key]
		allRelevantModelPlans := []*models.ModelPlan{}
		// for each status, check if there is a result
		for _, status := range relevantStatuses {
			res, ok := resMap[status]
			// if there are models for that status append them to the overall result
			if ok && res != nil && len(res) > 0 {
				allRelevantModelPlans = append(allRelevantModelPlans, res...)
			}
		}
		// return the collection of model plans for all relevant statuses
		return allRelevantModelPlans, len(allRelevantModelPlans) > 0
	}

	return oneToManyWithCustomKeyDataLoader(statusGroup, data, getKeyFunc, getResFunc)

}

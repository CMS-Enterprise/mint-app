package loaders

import (
	"context"

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

	var allStatuses []models.ModelStatus
	// todo remove duplicates, consider using lo package
	for _, group := range statusGroup {
		allStatuses = append(allStatuses, models.ModelPlanStatusGroupToModelStatus[group]...)
	}

	// var statuses = models.ModelPlanStatusGroupToModelStatus[statusGroup]

	data, err := storage.ModelPlanGetByStatuses(loaders.DataReader.Store, logger, allStatuses)
	if err != nil {
		return errorPerEachKey[models.ModelPlanStatusGroup, []*models.ModelPlan](statusGroup, err)
	}

	getKeyFunc := func(modelPlan *models.ModelPlan) models.ModelStatus {
		return modelPlan.Status
	}

	getResFunc := func(key models.ModelPlanStatusGroup, resMap map[models.ModelPlanStatusGroup]*[]models.ModelStatus) (*models.ModelPlan, bool) {

		res, ok := resMap[key]
		if ok {
			return res, ok
		}
		return nil, ok
	}
	return oneToManyWithCustomKeyDataLoader(statusGroup, data, getKeyFunc, getResFunc)

}

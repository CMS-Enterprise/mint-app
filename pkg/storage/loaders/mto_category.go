package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoCategoryLoaders is a struct that holds LoaderWrappers related to MTO Categories
type mtoCategoryLoaders struct {
	// ByModelPlanID Gets a list of mto category records associated with a model plan by the supplied model plan id
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.MTOCategory]
}

// mtoSubcategoryLoaders is a struct that holds LoaderWrappers related to MTO Subcategories
type mtoSubcategoryLoaders struct {
	// ByParentID Gets a list of mto category records associated with a parent id
	ByParentID LoaderWrapper[uuid.UUID, []*models.MTOSubcategory]
}

// MTOCategory is the singleton instance of all LoaderWrappers related to MTO Categories
var MTOCategory = &mtoCategoryLoaders{
	ByModelPlanID: NewLoaderWrapper(batchMTOCategoryGetByModelPlanID),
}

// MTOSubcategory is the singleton instance of all LoaderWrappers related to MTO Categories
var MTOSubcategory = &mtoSubcategoryLoaders{
	ByParentID: NewLoaderWrapper(batchMTOSubcategoryGetByModelPlanID),
}

func batchMTOCategoryGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOCategory] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOCategory](modelPlanIDs, err)
	}

	data, err := storage.MTOCategoryGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOCategory](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.MTOCategory) uuid.UUID {
		return data.ModelPlanID
	}

	// implement one to many
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)

}

func batchMTOSubcategoryGetByModelPlanID(ctx context.Context, parentIDS []uuid.UUID) []*dataloader.Result[[]*models.MTOSubcategory] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOSubcategory](parentIDS, err)
	}

	data, err := storage.MTOSubcategoryGetByParentIDLoader(loaders.DataReader.Store, logger, parentIDS)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOSubcategory](parentIDS, err)
	}
	getKeyFunc := func(data *models.MTOSubcategory) uuid.UUID {
		return *data.ParentID
	}

	// implement one to many
	return oneToManyDataLoader(parentIDS, data, getKeyFunc)

}

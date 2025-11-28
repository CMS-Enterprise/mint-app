package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoTemplateCategoryLoaders is a struct that holds LoaderWrappers related to MTO Template Categories
type mtoTemplateCategoryLoaders struct {
	// ByID Gets a MTO Template Category record by the supplied category id.
	ByID LoaderWrapper[uuid.UUID, *models.MTOTemplateCategory]
	// ByTemplateID Gets a list of MTO Template Category records by the supplied template id.
	ByTemplateID LoaderWrapper[uuid.UUID, []*models.MTOTemplateCategory]
}

// MTOTemplateCategory is the singleton instance of all LoaderWrappers related to MTO Template Categories
var MTOTemplateCategory = &mtoTemplateCategoryLoaders{
	ByID:         NewLoaderWrapper(batchMTOTemplateCategoryGetByID),
	ByTemplateID: NewLoaderWrapper(batchMTOTemplateCategoryGetByTemplateID),
}

func batchMTOTemplateCategoryGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.MTOTemplateCategory] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOTemplateCategory](ids, err)
	}

	data, err := storage.MTOTemplateCategoryGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOTemplateCategory](ids, err)
	}
	getKeyFunc := func(data *models.MTOTemplateCategory) uuid.UUID {
		return data.ID
	}

	// implement one to one
	return oneToOneDataLoader(ids, data, getKeyFunc)
}

func batchMTOTemplateCategoryGetByTemplateID(ctx context.Context, templateIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOTemplateCategory] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateCategory](templateIDs, err)
	}

	data, err := storage.MTOTemplateCategoryGetByTemplateIDLoader(loaders.DataReader.Store, logger, templateIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateCategory](templateIDs, err)
	}
	getKeyFunc := func(data *models.MTOTemplateCategory) uuid.UUID {
		return data.TemplateID
	}

	// implement one to many
	return oneToManyDataLoader(templateIDs, data, getKeyFunc)
}

// mtoTemplateSubCategoryLoaders is a struct that holds LoaderWrappers related to MTO Template SubCategories
type mtoTemplateSubCategoryLoaders struct {
	// ByID Gets a MTO Template SubCategory record by the supplied subcategory id.
	ByID LoaderWrapper[uuid.UUID, *models.MTOTemplateSubCategory]
	// ByCategoryID Gets a list of MTO Template SubCategory records by the supplied category id.
	ByCategoryID LoaderWrapper[uuid.UUID, []*models.MTOTemplateSubCategory]
}

// MTOTemplateSubCategory is the singleton instance of all LoaderWrappers related to MTO Template SubCategories
var MTOTemplateSubCategory = &mtoTemplateSubCategoryLoaders{
	ByID:         NewLoaderWrapper(batchMTOTemplateSubCategoryGetByID),
	ByCategoryID: NewLoaderWrapper(batchMTOTemplateSubCategoryGetByCategoryID),
}

func batchMTOTemplateSubCategoryGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.MTOTemplateSubCategory] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOTemplateSubCategory](ids, err)
	}

	data, err := storage.MTOTemplateSubCategoryGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOTemplateSubCategory](ids, err)
	}
	getKeyFunc := func(data *models.MTOTemplateSubCategory) uuid.UUID {
		return data.ID
	}

	return oneToOneDataLoader(ids, data, getKeyFunc)
}

func batchMTOTemplateSubCategoryGetByCategoryID(ctx context.Context, categoryIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOTemplateSubCategory] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateSubCategory](categoryIDs, err)
	}

	data, err := storage.MTOTemplateSubCategoryGetByCategoryIDLoader(loaders.DataReader.Store, logger, categoryIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateSubCategory](categoryIDs, err)
	}
	getKeyFunc := func(data *models.MTOTemplateSubCategory) uuid.UUID {
		return *data.ParentID // Assuming ParentID points to the category
	}

	return oneToManyDataLoader(categoryIDs, data, getKeyFunc)
}

package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoTemplateMilestoneLoaders is a struct that holds LoaderWrappers related to MTO Template Milestones
type mtoTemplateMilestoneLoaders struct {
	// ByID Gets a MTO Template Milestone record by the supplied milestone id.
	ByID LoaderWrapper[uuid.UUID, *models.MTOTemplateMilestone]
	// ByTemplateID Gets a list of MTO Template Milestone records by the supplied template id.
	ByTemplateID LoaderWrapper[uuid.UUID, []*models.MTOTemplateMilestone]
	// ByCategoryID Gets a list of MTO Template Milestone records by the supplied subcategory id.
	ByCategoryID LoaderWrapper[uuid.UUID, []*models.MTOTemplateMilestone]
	// BySolutionID Gets a list of MTO Template Milestone records by the supplied solution id.
	BySolutionID LoaderWrapper[uuid.UUID, []*models.MTOTemplateMilestone]
}

// MTOTemplateMilestone is the singleton instance of all LoaderWrappers related to MTO Template Milestones
var MTOTemplateMilestone = &mtoTemplateMilestoneLoaders{
	ByID:         NewLoaderWrapper(batchMTOTemplateMilestoneGetByID),
	ByTemplateID: NewLoaderWrapper(batchMTOTemplateMilestoneGetByTemplateID),
	ByCategoryID: NewLoaderWrapper(batchMTOTemplateMilestoneGetByCategoryID),
	BySolutionID: NewLoaderWrapper(batchMTOTemplateMilestoneGetBySolutionID),
}

func batchMTOTemplateMilestoneGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.MTOTemplateMilestone] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOTemplateMilestone](ids, err)
	}

	data, err := storage.MTOTemplateMilestoneGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOTemplateMilestone](ids, err)
	}
	getKeyFunc := func(data *models.MTOTemplateMilestone) uuid.UUID {
		return data.ID
	}

	// implement one to one
	return oneToOneDataLoader(ids, data, getKeyFunc)
}

func batchMTOTemplateMilestoneGetByTemplateID(ctx context.Context, templateIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOTemplateMilestone] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateMilestone](templateIDs, err)
	}

	data, err := storage.MTOTemplateMilestoneGetByTemplateIDLoader(loaders.DataReader.Store, logger, templateIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateMilestone](templateIDs, err)
	}
	getKeyFunc := func(data *models.MTOTemplateMilestone) uuid.UUID {
		return data.TemplateID
	}

	// implement one to many
	return oneToManyDataLoader(templateIDs, data, getKeyFunc)
}

// batchMTOTemplateMilestoneGetByCategoryID fetches MTO Template Milestones by SubCategory IDs
func batchMTOTemplateMilestoneGetByCategoryID(ctx context.Context, subCategoryIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOTemplateMilestone] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateMilestone](subCategoryIDs, err)
	}

	data, err := storage.MTOTemplateMilestoneGetByCategoryIDLoader(loaders.DataReader.Store, logger, subCategoryIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateMilestone](subCategoryIDs, err)
	}
	getKeyFunc := func(data *models.MTOTemplateMilestone) uuid.UUID {
		return *data.MTOTemplateCategoryID
	}

	return oneToManyDataLoader(subCategoryIDs, data, getKeyFunc)
}

// batchMTOTemplateMilestoneGetBySolutionID fetches MTO Template Milestones by Solution IDs
func batchMTOTemplateMilestoneGetBySolutionID(ctx context.Context, solutionIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOTemplateMilestone] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateMilestone](solutionIDs, err)
	}

	data, err := storage.MTOTemplateMilestoneGetBySolutionIDLoader(loaders.DataReader.Store, logger, solutionIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplateMilestone](solutionIDs, err)
	}
	getKeyFunc := func(data *models.MTOTemplateMilestone) uuid.UUID {
		return *data.MTOTemplateCategoryID
	}

	// implement one to many
	return oneToManyDataLoader(solutionIDs, data, getKeyFunc)
}

package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoTemplateLoaders is a struct that holds LoaderWrappers related to MTO Templates
type mtoTemplateLoaders struct {
	// ByID Gets a MTO Template record by the supplied template id.
	ByID LoaderWrapper[uuid.UUID, *models.MTOTemplate]
	// ByModelPlanID Gets a list of MTO Template records associated with a model plan by the supplied model plan id.
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.MTOTemplate]
	// ByKey Gets a MTO Template record by the supplied template key.
	ByKey LoaderWrapper[models.MTOTemplateKey, *models.MTOTemplate]
	// GetAll Gets all MTO Template records.
	GetAll LoaderWrapper[string, []*models.MTOTemplate]
}

// MTOTemplate is the singleton instance of all LoaderWrappers related to MTO Templates
var MTOTemplate = &mtoTemplateLoaders{
	ByID:          NewLoaderWrapper(batchMTOTemplateGetByID),
	ByModelPlanID: NewLoaderWrapper(batchMTOTemplateGetByModelPlanID),
	ByKey:         NewLoaderWrapper(batchMTOTemplateGetByKey),
	GetAll:        NewLoaderWrapper(batchMTOTemplateGetAll),
}

func batchMTOTemplateGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.MTOTemplate] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOTemplate](ids, err)
	}

	data, err := storage.MTOTemplateGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOTemplate](ids, err)
	}
	getKeyFunc := func(data *models.MTOTemplate) uuid.UUID {
		return data.ID
	}

	// implement one to one
	return oneToOneDataLoader(ids, data, getKeyFunc)
}

func batchMTOTemplateGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOTemplate] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplate](modelPlanIDs, err)
	}

	data, err := storage.MTOTemplateGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOTemplate](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.MTOTemplate) uuid.UUID {
		return data.ModelPlanID
	}

	// implement one to many
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)
}

func batchMTOTemplateGetByKey(ctx context.Context, keys []models.MTOTemplateKey) []*dataloader.Result[*models.MTOTemplate] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[models.MTOTemplateKey, *models.MTOTemplate](keys, err)
	}

	data, err := storage.MTOTemplateGetByKeyLoader(loaders.DataReader.Store, logger, keys)
	if err != nil {
		return errorPerEachKey[models.MTOTemplateKey, *models.MTOTemplate](keys, err)
	}
	getKeyFunc := func(data *models.MTOTemplate) models.MTOTemplateKey {
		return data.Key
	}

	// implement one to one
	return oneToOneDataLoader(keys, data, getKeyFunc)
}

// batchMTOTemplateGetAll loads all MTO templates; the key is ignored but required by the dataloader interface
func batchMTOTemplateGetAll(ctx context.Context, keys []string) []*dataloader.Result[[]*models.MTOTemplate] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[string, []*models.MTOTemplate](keys, err)
	}

	data, err := storage.MTOTemplateGetAllLoader(loaders.DataReader.Store, logger)
	if err != nil {
		return errorPerEachKey[string, []*models.MTOTemplate](keys, err)
	}

	// Since this is "get all", every key gets the same result
	results := make([]*dataloader.Result[[]*models.MTOTemplate], len(keys))
	for i := range keys {
		results[i] = &dataloader.Result[[]*models.MTOTemplate]{Data: data}
	}
	return results
}

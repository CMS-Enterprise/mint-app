package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// keyContactCategoryLoaders is a struct that holds LoaderWrappers related to Key Contact Categories
type keyContactCategoryLoaders struct {
	// ByID returns a single KeyContactCategory by its ID
	ByID LoaderWrapper[uuid.UUID, *model.KeyContactCategory]

	// GetAll returns all KeyContactCategories
	GetAll LoaderWrapper[*uuid.UUID, []*model.KeyContactCategory]
}

// KeyContactCategory is the singleton instance of all LoaderWrappers related to Key Contact Category
var KeyContactCategory = &keyContactCategoryLoaders{
	ByID:   NewLoaderWrapper(batchKeyContactCategoryGetByID),
	GetAll: NewLoaderWrapper(batchKeyContactCategoryGetAll),
}

func batchKeyContactCategoryGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*model.KeyContactCategory] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)

	if err != nil {
		return errorPerEachKey[uuid.UUID, *model.KeyContactCategory](ids, err)
	}

	data, err := storage.KeyContactCategoryGetByIDsLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *model.KeyContactCategory](ids, err)
	}

	getKeyFunc := func(data *model.KeyContactCategory) uuid.UUID {
		return data.ID
	}

	return oneToOneDataLoader(ids, data, getKeyFunc)
}

// batchKeyContactCategoryGetAll loads all key contact categories; the key is ignored but required by the dataloader interface
func batchKeyContactCategoryGetAll(ctx context.Context, ids []*uuid.UUID) []*dataloader.Result[[]*model.KeyContactCategory] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)

	if err != nil {
		return errorPerEachKey[*uuid.UUID, []*model.KeyContactCategory](ids, err)
	}

	data, err := storage.KeyContactCategoryGetAllLoader(loaders.DataReader.Store, logger)
	if err != nil {
		return errorPerEachKey[*uuid.UUID, []*model.KeyContactCategory](ids, err)
	}

	// Since this is "get all", every key gets the same result
	results := make([]*dataloader.Result[[]*model.KeyContactCategory], len(ids))
	for i := range ids {
		results[i] = &dataloader.Result[[]*model.KeyContactCategory]{Data: data}
	}

	return results
}

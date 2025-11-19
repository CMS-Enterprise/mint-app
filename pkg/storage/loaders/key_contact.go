package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// keyContactLoaders is a struct that holds LoaderWrappers related to Key Contacts
type keyContactLoaders struct {

	// ByKeyContactCategory returns a list of key contacts by their key contact categories. It does not currently have contextual data
	// TODO(Elle) uncomment below once category is implemented
	// ByKeyContactCategory LoaderWrapper[models.KeyContactCategory, []*models.KeyContact]

	// ByID returns a single KeyContact by its ID
	ByID LoaderWrapper[uuid.UUID, *models.KeyContact]
}

// KeyContact is the singleton instance of all LoaderWrappers related to MTO Common Solutions
var KeyContact = &keyContactLoaders{

	// ByKeyContactCategory: NewLoaderWrapper(batchKeyContactGetByKeyContactCategory),
	ByID: NewLoaderWrapper(batchKeyContactGetByID),
}

// batchKeyContactGetByKeyContactCategory returns a list of key contacts as a dataloader.Result for a list of key contact categories (they are linked)
// TODO(Elle) uncomment below once category is implemented
// func batchKeyContactGetByKeyContactCategory(ctx context.Context, keyContactCategories []models.KeyContactCategory) []*dataloader.Result[[]*models.KeyContact] {
// 	loaders, err := Loaders(ctx)
// 	logger := appcontext.ZLogger(ctx)
// 	if err != nil {
// 		return errorPerEachKey[models.KeyContactCategory, []*models.KeyContact](keyContactCategories, err)
// 	}

// 	data, err := storage.KeyContactGetByKeyContactCategoryLoader(loaders.DataReader.Store, logger, keyContactCategories)
// 	if err != nil {
// 		return errorPerEachKey[models.KeyContactCategory, []*models.KeyContact](keyContactCategories, err)
// 	}

// 	getKeyFunc := func(data *models.KeyContact) models.KeyContactCategory {
// 		return data.Category
// 	}

// 	// implement one to many
// 	return oneToManyDataLoader(commonSolutionKeys, data, getKeyFunc)

// }

func batchKeyContactGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.KeyContact] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.KeyContact](ids, err)
	}

	data, err := storage.KeyContactGetByIDsLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.KeyContact](ids, err)
	}

	getKeyFunc := func(data *models.KeyContact) uuid.UUID {
		return data.ID
	}

	return oneToOneDataLoader(ids, data, getKeyFunc)
}

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
	// ByID returns a single KeyContact by its ID
	ByID LoaderWrapper[uuid.UUID, *models.KeyContact]

	// GetAll returns all KeyContacts
	GetAll LoaderWrapper[*uuid.UUID, []*models.KeyContact]
}

// KeyContact is the singleton instance of all LoaderWrappers related to Key Contact
var KeyContact = &keyContactLoaders{
	ByID:   NewLoaderWrapper(batchKeyContactGetByID),
	GetAll: NewLoaderWrapper(batchKeyContactGetAll),
}

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

// batchKeyContactGetAll loads all subject matter experts; the key is ignored but required by the dataloader interface
func batchKeyContactGetAll(ctx context.Context, ids []*uuid.UUID) []*dataloader.Result[[]*models.KeyContact] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[*uuid.UUID, []*models.KeyContact](ids, err)
	}

	data, err := storage.KeyContactGetAllLoader(loaders.DataReader.Store, logger)
	if err != nil {
		return errorPerEachKey[*uuid.UUID, []*models.KeyContact](ids, err)
	}

	// Since this is "get all", every key gets the same result
	results := make([]*dataloader.Result[[]*models.KeyContact], len(ids))
	for i := range ids {
		results[i] = &dataloader.Result[[]*models.KeyContact]{Data: data}
	}
	return results
}

package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoCommonSolutionContactLoaders is a struct that holds LoaderWrappers related to MTO Solutions
type mtoCommonSolutionContactLoaders struct {

	// ByCommonSolutionKey returns a list of mto Common Solution Contact records by their keys. It does not currently have contextual data
	ByCommonSolutionKey LoaderWrapper[models.MTOCommonSolutionKey, []*models.MTOCommonSolutionContact]
	// ByID returns a single MTOCommonSolutionContact by its ID
	ByID LoaderWrapper[uuid.UUID, *models.MTOCommonSolutionContact]
}

// MTOCommonSolutionContact is the singleton instance of all LoaderWrappers related to MTO Common Solutions
var MTOCommonSolutionContact = &mtoCommonSolutionContactLoaders{

	ByCommonSolutionKey: NewLoaderWrapper(batchMTOCommonSolutionContactGetByCommonSolutionKey),
	ByID:                NewLoaderWrapper(batchMTOCommonSolutionContactGetByID),
}

// batchMTOCommonSolutionContactGetByCommonSolutionKey returns a list of common Solutions as a dataloader.Result for a list of commonSolutionKeys (they are linked)
func batchMTOCommonSolutionContactGetByCommonSolutionKey(ctx context.Context, commonSolutionKeys []models.MTOCommonSolutionKey) []*dataloader.Result[[]*models.MTOCommonSolutionContact] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[models.MTOCommonSolutionKey, []*models.MTOCommonSolutionContact](commonSolutionKeys, err)
	}

	data, err := storage.MTOCommonSolutionContactGetByCommonSolutionKeyLoader(loaders.DataReader.Store, logger, commonSolutionKeys)
	if err != nil {
		return errorPerEachKey[models.MTOCommonSolutionKey, []*models.MTOCommonSolutionContact](commonSolutionKeys, err)
	}

	getKeyFunc := func(data *models.MTOCommonSolutionContact) models.MTOCommonSolutionKey {
		return data.Key
	}

	// implement one to many
	return oneToManyDataLoader(commonSolutionKeys, data, getKeyFunc)

}

func batchMTOCommonSolutionContactGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.MTOCommonSolutionContact] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOCommonSolutionContact](ids, err)
	}

	data, err := storage.MTOCommonSolutionContactGetByIDsLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOCommonSolutionContact](ids, err)
	}

	getKeyFunc := func(data *models.MTOCommonSolutionContact) uuid.UUID {
		return data.ID
	}

	return oneToOneDataLoader(ids, data, getKeyFunc)
}

package resolvers

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// PossibleOperationalSolutionContactsGetByPossibleSolutionID returns all the contacts associated with a possible operational solution
// it uses a data loader to ensure efficient querying
func PossibleOperationalSolutionContactsGetByPossibleSolutionID(ctx context.Context, possibleSolutionID int) ([]*models.PossibleOperationalSolutionContact, error) {
	allLoaders, ok := loaders.Loaders(ctx)
	if !ok {
		return nil, loaders.ErrNoLoaderOnContext
	}
	contactLoader := allLoaders.PossibleOperationSolutionContactLoader
	key := loaders.NewKeyArgs()
	key.Args[loaders.DLPosOperationalSolutionKey] = possibleSolutionID

	thunk := contactLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.([]*models.PossibleOperationalSolutionContact), nil
}

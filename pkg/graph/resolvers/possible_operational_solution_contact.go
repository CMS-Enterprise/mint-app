package resolvers

import (
	"context"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
)

// PossibleOperationalSolutionContactsGetByPossibleSolutionID returns all the contacts associated with a possible operational solution
// it uses a data loader to ensure efficient querying
func PossibleOperationalSolutionContactsGetByPossibleSolutionID(ctx context.Context, possibleSolutionID int) ([]*models.PossibleOperationalSolutionContact, error) {
	allLoaders := loaders.Loaders(ctx)
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

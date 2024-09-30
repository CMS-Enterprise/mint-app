package resolvers

import (
	"context"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// PossibleOperationalSolutionCollectionGetByNeedType returns all possible operational Solutions linked to Operational Need Type
func PossibleOperationalSolutionCollectionGetByNeedType(logger *zap.Logger, needType models.OperationalNeedKey, store *storage.Store) ([]*models.PossibleOperationalSolution, error) {
	return store.PossibleOperationalSolutionCollectionGetByNeedType(logger, needType)
}

// PossibleOperationalSolutionCollectionGetAll returns all possible operational Solutions linked to Operational Need Type
func PossibleOperationalSolutionCollectionGetAll(logger *zap.Logger, store *storage.Store) ([]*models.PossibleOperationalSolution, error) {
	return store.PossibleOperationalSolutionCollectionGetAll(logger)
}

// PossibleOperationalSolutionGetByID returns a possible operational Solutions according to it's id
func PossibleOperationalSolutionGetByID(logger *zap.Logger, store *storage.Store, id int) (*models.PossibleOperationalSolution, error) {
	return store.PossibleOperationalSolutionGetByID(logger, id)
}

// PossibleOperationalSolutionGetByKey returns a possible operational Solutions according to it's operational solution key
func PossibleOperationalSolutionGetByKey(ctx context.Context, key models.OperationalSolutionKey) (*models.PossibleOperationalSolution, error) {
	return loaders.PossibleOperationalSolutionByKey(ctx, key)
}

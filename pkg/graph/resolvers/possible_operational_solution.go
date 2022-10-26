package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// PossibleOperationalSolutionCollectionGetByNeedType returns all possible operational Solutions linked to Operational Need Type
func PossibleOperationalSolutionCollectionGetByNeedType(logger *zap.Logger, needType models.OperationalNeedKey, store *storage.Store) ([]*models.PossibleOperationalSolution, error) {
	return store.PossibleOperationalSolutionCollectionGetByNeedType(logger, needType)
}

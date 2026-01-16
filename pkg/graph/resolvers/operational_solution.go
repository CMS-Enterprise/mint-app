package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// OperationalSolutionsAndPossibleGetByOPNeedIDLOADER returns operational Solutions and possible Operational Solutions based on a specific operational Need ID using a Data Loader
func OperationalSolutionsAndPossibleGetByOPNeedIDLOADER(ctx context.Context, operationalNeedID uuid.UUID, includeNotNeeded bool) ([]*models.OperationalSolution, error) {
	return loaders.OperationalSolutions.AndPossibleByOperationalNeedID.Load(ctx,
		storage.SolutionAndPossibleKey{
			OperationalNeedID: operationalNeedID,
			IncludeNotNeeded:  includeNotNeeded,
		})
}

// OperationalSolutionGetByID returns an operational Solution by it's ID
func OperationalSolutionGetByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.OperationalSolution, error) {
	return store.OperationalSolutionGetByID(logger, id)
}

// OperationalSolutionGetByIDLOADER implements resolver logic to get an Operational Solution by ID using a data loader
func OperationalSolutionGetByIDLOADER(ctx context.Context, id uuid.UUID) (*models.OperationalSolution, error) {
	return loaders.OperationalSolutions.ByID.Load(ctx, id)
}

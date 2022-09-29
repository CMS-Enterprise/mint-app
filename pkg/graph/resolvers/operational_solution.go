package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// OperationalSolutionCollectionGetByOperationalNeedID returns Operational Solutions correspondind to an Operational Need
func OperationalSolutionCollectionGetByOperationalNeedID(logger *zap.Logger, operationalNeedID uuid.UUID, store *storage.Store) ([]*models.OperationalSolution, error) {
	// result, err := store.OperationalSolutionGetByModelPlanID(logger,modelPlanID);
	return store.OperationalSolutionCollectionGetByOperationalNeedID(logger, operationalNeedID)
}

package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

func ModelPlansByOperationalSolutionKey(
	logger *zap.Logger,
	store *storage.Store,
	operationalSolutionKey models.OperationalSolutionKey,
) ([]*models.ModelPlanAndOperationalSolution, error) {
	return store.ModelPlanGetByOperationalSolutionKey(logger, operationalSolutionKey)
}

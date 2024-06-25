package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

func ModelPlansByOperationalSolutionKey(
	logger *zap.Logger,
	store *storage.Store,
	operationalSolutionKey models.OperationalSolutionKey,
) ([]*model.ModelPlanAndOperationalSolution, error) {
	return store.ModelPlanGetByOperationalSolutionKey(logger, operationalSolutionKey)
}

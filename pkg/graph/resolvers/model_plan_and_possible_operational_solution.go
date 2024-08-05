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
) ([]*models.ModelPlanAndPossibleOperationalSolution, error) {
	return store.ModelPlanGetByOperationalSolutionKey(logger, operationalSolutionKey)
}

// ModelBySolutionStatus converts a Model status to a ModelBySolutionStatus
func ModelBySolutionStatus(modelPlanStatus models.ModelStatus) models.ModelBySolutionStatus {
	switch modelPlanStatus {
	case models.ModelStatusActive:
		return models.MbSSActive
	case models.ModelStatusEnded:
		return models.MbSSEnded
	// These status we don't want to show up in the PLANNED status column.
	case models.ModelStatusCanceled, models.ModelStatusPaused:
		return models.MbSSOther
	default:
		return models.MbSSPlanned
	}
}

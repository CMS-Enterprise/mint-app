package resolvers

import (
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func ModelPlansByOperationalSolutionKey(
	logger *zap.Logger,
	store *storage.Store,
	operationalSolutionKey models.OperationalSolutionKey,
) ([]*models.ModelPlanAndPossibleOperationalSolution, error) {
	return store.ModelPlanGetByOperationalSolutionKey(logger, operationalSolutionKey)
}

// ModelPlansByMTOSolutionKey returns a list of model plans which utilize an mto common solution
func ModelPlansByMTOSolutionKey(
	logger *zap.Logger,
	np sqlutils.NamedPreparer,
	solutionKey models.MTOCommonSolutionKey,
) ([]*models.ModelPlanAndMTOCommonSolution, error) {
	return storage.ModelPlanGetByMTOSolutionKey(np, logger, solutionKey)
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

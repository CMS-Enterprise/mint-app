package resolvers

import (
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func ModelPlansByComponentGroup(logger *zap.Logger, store *storage.Store, componentGroup models.ComponentGroup) ([]*models.ModelPlanAndGroup, error) {
	return store.ModelPlanGetByComponentGroup(logger, componentGroup)
}

func ModelByGroupStatus(modelPlanStatus models.ModelStatus) models.ModelByGroupStatus {
	switch modelPlanStatus {
	case models.ModelStatusActive:
		return models.MbGSActive
	case models.ModelStatusEnded:
		return models.MbGSEnded
	default:
		return models.MbGSSPlanned
	}
}

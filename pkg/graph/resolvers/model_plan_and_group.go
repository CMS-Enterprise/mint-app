package resolvers

import (
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func ModelPlansByComponentGroup(logger *zap.Logger, store *storage.Store, componentGroup models.ComponentGroup) ([]*models.ModelPlanAndGroup, error) {
	return store.ModelPlanGetByComponentGroup(logger, componentGroup)
}

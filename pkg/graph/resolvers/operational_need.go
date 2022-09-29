package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// OperationalNeedCollectionGetByModelPlanID returns possible and existing OperationalNeeds associated to a model plan
func OperationalNeedCollectionGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) ([]*models.OperationalNeed, error) {
	// result, err := store.OperationalNeedGetByModelPlanID(logger,modelPlanID);
	return store.OperationalNeedCollectionGetByModelPlanID(logger, modelPlanID)
}

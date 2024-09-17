package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// PossibleOperationalNeedCollectionGet returns all possible OperationalNeeds
func PossibleOperationalNeedCollectionGet(logger *zap.Logger, store *storage.Store) ([]*models.PossibleOperationalNeed, error) {
	posNeeds, err := store.PossibleOperationalNeedCollectionGetByModelPlanID(logger, uuid.Nil)
	if err != nil {
		return nil, err
	}

	return posNeeds, nil
}

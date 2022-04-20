package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func ModelPlanCreate(logger *zap.Logger, plan *models.ModelPlan, store *storage.Store) (*models.ModelPlan, error) {

	createdPlan, err := store.ModelPlanCreate(logger, plan)
	if err != nil {
		return nil, err
	}
	return createdPlan, err
}

func ModelPlanUpdate(logger *zap.Logger, plan *models.ModelPlan, store *storage.Store) (*models.ModelPlan, error) {
	retPlan, err := store.ModelPlanUpdate(logger, plan)
	if err != nil {
		return nil, err
	}
	return retPlan, err

}

func ModelPlanGetByID(logger *zap.Logger, principal string, id uuid.UUID, store *storage.Store) (*models.ModelPlan, error) {
	plan, err := store.ModelPlanGetByID(logger, id)
	if err != nil {
		return nil, err
	}
	//TODO add job code authorization Checks?

	return plan, nil
}
func ModelPlanCollectionByUser(logger *zap.Logger, principal string, store *storage.Store) ([]*models.ModelPlan, error) {
	plans, err := store.ModelPlanCollectionByUser(logger, principal)
	if err != nil {
		return nil, err
	}

	return plans, err
}

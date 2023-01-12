package resolvers

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// IsPlanFavorited checks if a model plan is a favorite.
func IsPlanFavorited(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (bool, error) {

	favorite, err := PlanFavoriteGet(logger, principal, store, modelPlanID)
	if err != nil {
		return false, err
	}
	isFavorite := (favorite != nil)

	return isFavorite, nil

}

// PlanFavoriteCreate creates a new plan favorite record in the database
func PlanFavoriteCreate(logger *zap.Logger, principal authentication.Principal, userEUAID string, store *storage.Store, modelPlanID uuid.UUID) (*models.PlanFavorite, error) {

	favorite := models.NewPlanFavorite(principal.Account().ID, modelPlanID)

	err := BaseStructPreCreate(logger, &favorite, principal, store, false) //you don't need to be a collaborator to favorite a model plan.
	if err != nil {
		return nil, err
	}

	return store.PlanFavoriteCreate(logger, favorite)

}

// PlanFavoriteDelete deletes a plan favorite record in the database
func PlanFavoriteDelete(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (*models.PlanFavorite, error) {

	existingFavorite, err := store.PlanFavoriteGetByModelIDAndEUA(logger, principal.ID(), modelPlanID)

	if err != nil {
		return nil, err
	}

	err = BaseStructPreDelete(logger, existingFavorite, principal, store, false) //you don't need to be a collaborator to favorite a model plan.
	if err != nil {
		return nil, err
	}

	return store.PlanFavoriteDelete(logger, principal.ID(), modelPlanID)

}

// PlanFavoriteGet returns a plan favorite record
func PlanFavoriteGet(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlandID uuid.UUID) (*models.PlanFavorite, error) {

	return store.PlanFavoriteGetByModelIDAndEUA(logger, principal.ID(), modelPlandID)

}

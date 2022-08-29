package resolvers

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//IsPlanFavorited checks if a model plan is a favorite.
func IsPlanFavorited(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (bool, error) {

	favorite, err := PlanFavoriteGet(logger, principal, store, modelPlanID)
	if err != nil {
		return false, err
	}
	isFavorite := false
	if favorite != nil {
		isFavorite = true

	}
	return isFavorite, nil

}

//PlanFavoriteCreate creates a new plan favorite record in the database
func PlanFavoriteCreate(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlandID uuid.UUID) (*models.PlanFavorite, error) {

	favorite := models.PlanFavorite{
		UserID:      principal.ID(),
		ModelPlanID: modelPlandID,
		BaseStruct: models.BaseStruct{
			CreatedBy: principal.ID(),
		},
	}

	return store.PlanFavoriteCreate(logger, favorite)

}

//PlanFavoriteDelete deletes a plan favorite record in the database
func PlanFavoriteDelete(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlandID uuid.UUID) (*models.PlanFavorite, error) {

	return store.PlanFavoriteDelete(logger, principal.ID(), modelPlandID)

}

//PlanFavoriteGet returns a plan favorite record
func PlanFavoriteGet(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlandID uuid.UUID) (*models.PlanFavorite, error) {

	return store.PlanFavoriteGetByModelIDAndEUA(logger, principal.ID(), modelPlandID)

}

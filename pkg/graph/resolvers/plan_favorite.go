package resolvers

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//PlanFavoriteCollection returns a list of favorites
func PlanFavoriteCollection(logger *zap.Logger, principal authentication.Principal, store *storage.Store) ([]*models.PlanFavorite, error) {
	favorites, err := store.PlanFavoriteCollectionByUser(logger, principal.ID(), false)
	if err != nil {
		return nil, err
	}

	return favorites, err
}

//IsPlanFavorited checks if a model plan is a favorite.
func IsPlanFavorited(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlandID uuid.UUID) (bool, error) {

	favorite, err := PlanFavoriteGet(logger, principal, store, modelPlandID)
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

	return store.PlanFavoriteGet(logger, principal.ID(), modelPlandID)

}

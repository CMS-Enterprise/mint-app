package resolvers

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
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
func PlanFavoriteCreate(np sqlutils.NamedPreparer, logger *zap.Logger, principal authentication.Principal, userAccountID uuid.UUID, store *storage.Store, modelPlanID uuid.UUID) (*models.PlanFavorite, error) {

	favorite := models.NewPlanFavorite(principal.Account().ID, userAccountID, modelPlanID)

	err := BaseStructPreCreate(logger, &favorite, principal, store, false) //you don't need to be a collaborator to favorite a model plan.
	if err != nil {
		return nil, err
	}

	return store.PlanFavoriteCreate(np, logger, favorite)

}

// PlanFavoriteDelete deletes a plan favorite record in the database
func PlanFavoriteDelete(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (*models.PlanFavorite, error) {

	existingFavorite, err := store.PlanFavoriteGetByModelIDAndUserAccountID(logger, principal.Account().ID, modelPlanID)

	if err != nil {
		return nil, err
	}

	err = BaseStructPreDelete(logger, existingFavorite, principal, store, false) //you don't need to be a collaborator to favorite a model plan.
	if err != nil {
		return nil, err
	}

	return store.PlanFavoriteDelete(logger, principal.Account().ID, modelPlanID, principal.Account().ID)

}

// PlanFavoriteGet returns a plan favorite record
func PlanFavoriteGet(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlandID uuid.UUID) (*models.PlanFavorite, error) {

	return store.PlanFavoriteGetByModelIDAndUserAccountID(logger, principal.Account().ID, modelPlandID)

}

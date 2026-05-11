package resolvers

import (
	"context"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// IsPlanFavorited checks if a user has favorited a model plan using a DataLoader.
func IsPlanFavorited(ctx context.Context, userID uuid.UUID, modelPlanID uuid.UUID) (bool, error) {
	key := storage.IsFavoriteKey{
		ModelPlanID: modelPlanID,
		UserID:      userID,
	}
	return loaders.PlanFavorites.IsFavorited.Load(ctx, key)
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

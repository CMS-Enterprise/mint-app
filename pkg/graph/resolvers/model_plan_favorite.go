package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//ModelPlanFavoriteCollection returns a list of favorites
func ModelPlanFavoriteCollection(logger *zap.Logger, principal authentication.Principal, store *storage.Store) ([]*models.ModelPlanFavorite, error) {
	favorites, err := store.ModelPlanFavoriteCollectionByUser(logger, principal.ID(), false)
	if err != nil {
		return nil, err
	}

	return favorites, err
}

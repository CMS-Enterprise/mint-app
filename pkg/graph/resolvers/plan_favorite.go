package resolvers

import (
	"go.uber.org/zap"

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

package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// UserAccountGetByEUAID returns a user account by it's EUAID
func UserAccountGetByEUAID(logger *zap.Logger, store *storage.Store, euaID string) (*models.UserAccount, error) {

	return store.UserAccountGetByEUAID(euaID)

}

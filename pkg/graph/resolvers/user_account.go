package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// UserAccountGetByEUAID returns a user account by it's EUAID
func UserAccountGetByEUAID(logger *zap.Logger, store *storage.Store, euaID string) (*authentication.UserAccount, error) {

	return store.UserAccountGetByUsername(euaID)

}

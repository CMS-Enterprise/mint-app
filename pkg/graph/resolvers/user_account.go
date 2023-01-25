package resolvers

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// UserAccountGetByUsername returns a user account by it's EUAID
func UserAccountGetByUsername(logger *zap.Logger, store *storage.Store, euaID string) (*authentication.UserAccount, error) {

	return store.UserAccountGetByUsername(euaID)

}

// UserAccountGetByID returns a user account by it's internal ID
func UserAccountGetByID(logger *zap.Logger, store *storage.Store, id uuid.UUID) (*authentication.UserAccount, error) {
	return store.UserAccountGetByID(id)

}

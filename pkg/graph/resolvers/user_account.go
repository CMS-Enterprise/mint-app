package resolvers

import (
	"context"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
)

// UserAccountGetByUsername returns a user account by it's userName
func UserAccountGetByUsername(logger *zap.Logger, store *storage.Store, userName string) (*authentication.UserAccount, error) {

	return store.UserAccountGetByUsername(userName)

}

// UserAccountGetByIDLOADER returns a user account by it's internal ID, utilizing a data loader
func UserAccountGetByIDLOADER(ctx context.Context, id uuid.UUID) (*authentication.UserAccount, error) {
	return userhelpers.UserAccountGetByIDLOADER(ctx, id)

}

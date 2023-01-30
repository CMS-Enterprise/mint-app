package resolvers

import (
	"context"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
)

// UserAccountGetByUsername returns a user account by it's EUAID
func UserAccountGetByUsername(logger *zap.Logger, store *storage.Store, euaID string) (*authentication.UserAccount, error) {

	return store.UserAccountGetByUsername(euaID)

}

// // UserAccountGetByID returns a user account by it's internal ID
// func UserAccountGetByID(logger *zap.Logger, store *storage.Store, id uuid.UUID) (*authentication.UserAccount, error) {
// 	return store.UserAccountGetByID(id)

// }

// UserAccountGetByIDLOADER returns a user account by it's internal ID, utilizing a data loader
func UserAccountGetByIDLOADER(ctx context.Context, id uuid.UUID) (*authentication.UserAccount, error) {
	allLoaders := loaders.Loaders(ctx)
	userAccountLoader := allLoaders.UserAccountLoader

	key := loaders.NewKeyArgs()
	key.Args["id"] = id

	thunk := userAccountLoader.Loader.Load(ctx, key)
	result, err := thunk()
	if err != nil {
		return nil, err
	}

	return result.(*authentication.UserAccount), nil

}

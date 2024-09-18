// Package dataloadertestconfigs provides utility functions for injecting dataloaders into test code
package dataloadertestconfigs

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// DecorateTestContextWithDataLoader Wraps a context with data loaders as needed for some unit testing
func DecorateTestContextWithDataLoader(ctx context.Context, store *storage.Store) context.Context {

	dataLoaders := loaders.NewDataLoaders(store)
	return loaders.CTXWithLoaders(ctx, dataLoaders)

}

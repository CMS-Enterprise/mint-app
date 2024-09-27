package loaders

import (
	"context"

	"github.com/graph-gophers/dataloader/v7"
)

// LoadFunc is a function called to load dataloader and return a result
type LoadFunc[K comparable, V any] func(context.Context, K) (V, error)

type LoaderConfig[K comparable, V any] struct {
	Note string

	batchFunction dataloader.BatchFunc[K, V]
	// Load is an abstraction used to call a dataloader
	Load LoadFunc[K, V]

	//TODO (loaders) decide if we want to abstract the method for fetching a specific loader. This might be circular, we can consider a map and key approach
	// getExistingBatchFunction func(ctx context.Context) dataloader.BatchFunc[K, V]
}

// NewBatchedLoader generates a Batched loader based on the specified configuration
func (lm *LoaderConfig[K, V]) NewBatchedLoader() *dataloader.Loader[K, V] {
	return dataloader.NewBatchedLoader(lm.batchFunction, dataloader.WithClearCacheOnBatch[K, V]())
}

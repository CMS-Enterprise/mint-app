package loaders

import (
	"context"

	"github.com/graph-gophers/dataloader/v7"
)

// LoadFunc is a function called to load dataloader and return a result
type LoadFunc[K comparable, V any] func(context.Context, K) (V, error)

type LoaderConfig[K comparable, V any] struct {
	batchFunction dataloader.BatchFunc[K, V]
	// Load is an abstraction used to call a dataloader
	Load LoadFunc[K, V]
}

// NewBatchedLoader generates a Batched loader based on the specified configuration
func (lm *LoaderConfig[K, V]) NewBatchedLoader() *dataloader.Loader[K, V] {
	return dataloader.NewBatchedLoader(lm.batchFunction, dataloader.WithClearCacheOnBatch[K, V]())
}

//TODO (loaders) Consider how we might be able to generically retrieve a data loader by a key, and cast it to a specific type.

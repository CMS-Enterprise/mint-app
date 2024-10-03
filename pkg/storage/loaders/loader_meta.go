package loaders

import (
	"context"

	"github.com/graph-gophers/dataloader/v7"
)

// LoadFunc is a function called to load dataloader and return a result
type LoadFunc[K comparable, V any] func(context.Context, K) (V, error)

type LoaderConfig[K comparable, V any] struct {
	// batchFunction is a type of function which takes an array of keys, and returns an array of *dataloader.Result[V]. It's responsible for returning the list ordered the same as the provided keys
	batchFunction dataloader.BatchFunc[K, V]

	// loader is the actual reference to a dataloader. It must be instantiated
	loader *dataloader.Loader[K, V]
}

// newBatchedLoader generates a Batched loader based on the specified configuration
func (lm *LoaderConfig[K, V]) newBatchedLoader() *dataloader.Loader[K, V] {
	loader := dataloader.NewBatchedLoader(lm.batchFunction, dataloader.WithClearCacheOnBatch[K, V]())
	return loader
}

// Load loads a dataloader with a relevant key to return a result. It relies on the batch function to debounce and return the result
func (lm *LoaderConfig[K, V]) Load(ctx context.Context, key K) (V, error) {
	var empty V
	if lm.loader == nil {
		return empty, ErrLoaderIsNotInstantiated
	}
	return lm.loader.Load(ctx, key)()
}

// init instantiates the loaderConfig with an instance of a dataloader
func (lm *LoaderConfig[K, V]) init() {
	lm.loader = lm.newBatchedLoader()
}

package loaders

import (
	"context"

	"github.com/graph-gophers/dataloader/v7"
)

// LoadFunc is a function called to load dataloader and return a result
type LoadFunc[K comparable, V any] func(context.Context, K) (V, error)

// LoaderWrapper is a wrapper around a dataloader.Loader.
// It's responsible for implementing a generic "Load" function which takes a key and returns a result.
// It's also responsible for holding a reference to a batch function which is used to fetch data by many keys at once
type LoaderWrapper[K comparable, V any] struct {
	// batchFunction is a type of function which takes an array of keys, and returns an array of *dataloader.Result[V]. It's responsible for returning the list ordered the same as the provided keys
	batchFunction dataloader.BatchFunc[K, V]

	// loader is the actual reference to a dataloader. It must be instantiated
	loader *dataloader.Loader[K, V]
}

// Load loads a dataloader with a relevant key to return a result. It relies on the batch function to debounce and return the result
func (lw *LoaderWrapper[K, V]) Load(ctx context.Context, key K) (V, error) {
	var empty V
	if lw.loader == nil {
		return empty, ErrLoaderIsNotInstantiated
	}
	return lw.loader.Load(ctx, key)()
}

func NewLoaderWrapper[K comparable, V any](batchFn dataloader.BatchFunc[K, V]) LoaderWrapper[K, V] {
	lw := LoaderWrapper[K, V]{
		batchFunction: batchFn,
	}
	lw.loader = dataloader.NewBatchedLoader(batchFn, dataloader.WithClearCacheOnBatch[K, V]())
	return lw
}

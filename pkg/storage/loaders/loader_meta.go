package loaders

import (
	"context"

	"github.com/graph-gophers/dataloader/v7"
)

type LoaderMap[K comparable, V any] map[string]*dataloader.Loader[K, V]
type HolderMap map[string]DataLoadersHolder

// LoadFunc is a function called to load dataloader and return a result
type LoadFunc[K comparable, V any] func(context.Context, K) (V, error)

type DataLoadersHolder interface {
	init()
	getByKey() any
	addLoaderByKeys(*HolderMap)
}

type LoaderConfig[K comparable, V any] struct {
	// batchFunction is a type of function which takes an array of keys, and returns an array of *dataloader.Result[V]. It's responsible for returning the list ordered the same as the provided keys
	batchFunction dataloader.BatchFunc[K, V]
	// loadFunc is an abstraction used to store the reference to the load function
	loadFunc LoadFunc[K, V]

	// loader is the actual reference to a dataloader. It must be instantiated
	loader *dataloader.Loader[K, V]
}

// NewBatchedLoader generates a Batched loader based on the specified configuration
func (lm *LoaderConfig[K, V]) NewBatchedLoader() *dataloader.Loader[K, V] {
	loader := dataloader.NewBatchedLoader(lm.batchFunction, dataloader.WithClearCacheOnBatch[K, V]())
	lm.loader = loader
	return loader
}

func (lm *LoaderConfig[K, V]) Load(ctx context.Context, key K) (V, error) {
	var empty V
	if lm.loader == nil {
		return empty, ErrLoaderIsNotInstantiated
	}
	return lm.loader.Load(ctx, key)()
}

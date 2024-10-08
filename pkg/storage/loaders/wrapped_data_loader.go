package loaders

import (
	oldDataloader "github.com/graph-gophers/dataloader"
)

// WrappedDataLoader wraps a DataLoader so it has access to an optional Map
type WrappedDataLoader struct {
	Loader *oldDataloader.Loader
}

func newWrappedDataLoader(batchFn oldDataloader.BatchFunc) *WrappedDataLoader {

	return &WrappedDataLoader{
		Loader: oldDataloader.NewBatchedLoader(batchFn, oldDataloader.WithClearCacheOnBatch()),
	}
}

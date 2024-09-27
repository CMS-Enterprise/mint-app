package loaders

import (
	"github.com/graph-gophers/dataloader"
)

// WrappedDataLoader wraps a DataLoader so it has access to an optional Map
type WrappedDataLoader struct {
	Loader *dataloader.Loader
}

func newWrappedDataLoader(batchFn dataloader.BatchFunc) *WrappedDataLoader {

	return &WrappedDataLoader{
		Loader: dataloader.NewBatchedLoader(batchFn, dataloader.WithClearCacheOnBatch()),
	}
}

// // WrappedTypedDataLoader wraps a DataLoader so it has access to an optional Map
// type WrappedTypedDataLoader struct {
// 	Loader [K any, V any]*v7.L
// }

// func newWrappedTypedDataLoader(batchFn dataloader.BatchFunc) *WrappedTypedDataLoader {
// 	loader := v7.NewBatchedLoader()

// 	return &WrappedTypedDataLoader{
// 		Loader: dataloader.NewBatchedLoader(batchFn, dataloader.WithClearCacheOnBatch()),
// 	}
// }

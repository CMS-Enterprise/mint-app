package loaders

import (
	oldDataloader "github.com/graph-gophers/dataloader"
)

const (
	// DLModelPlanIDKey is the key used to store and retrieve the modelPlanID
	DLModelPlanIDKey string = "model_plan_id"
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

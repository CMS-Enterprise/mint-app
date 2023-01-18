package loaders

import "github.com/cmsgov/mint-app/pkg/storage"

// DataLoaders wrap your data loaders to inject via middleware
type DataLoaders struct {
	BasicsLoader                      *WrappedDataLoader
	OperationalNeedLoader             *WrappedDataLoader
	OperationSolutionLoader           *WrappedDataLoader
	OperationSolutionLoaderSimplified *WrappedDataLoader
	DataReader                        *DataReader
}

// NewDataLoaders instantiates data loaders for the middleware
func NewDataLoaders(store *storage.Store) *DataLoaders {
	loaders := &DataLoaders{
		DataReader: &DataReader{
			Store: store,
		},
	}
	loaders.BasicsLoader = newWrappedDataLoader(loaders.GetPlanBasicsByModelPlanID)
	loaders.OperationalNeedLoader = newWrappedDataLoader(loaders.GetOperationalNeedsByModelPlanID)
	loaders.OperationSolutionLoader = newWrappedDataLoader(loaders.GetOperationalSolutionAndPossibleCollectionByOperationalNeedID)
	loaders.OperationSolutionLoaderSimplified = newWrappedDataLoader(loaders.GetOperationalSolutionAndPossibleCollectionByOperationalNeedIDSimplified)

	return loaders
}

// DataReader reads Users from a database
type DataReader struct {
	Store *storage.Store
}

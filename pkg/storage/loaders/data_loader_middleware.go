package loaders

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/graph-gophers/dataloader"

	"github.com/cmsgov/mint-app/pkg/storage"
)

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

// WrappedDataLoader wraps a DataLoader so it has access to an optional Map
type WrappedDataLoader struct {
	Loader *dataloader.Loader
}

func newLoaderWithMap(batchFn dataloader.BatchFunc) *WrappedDataLoader {

	return &WrappedDataLoader{
		Loader: dataloader.NewBatchedLoader(batchFn, dataloader.WithClearCacheOnBatch()),
	}
}

// Loaders wrap your data loaders to inject via middleware
type Loaders struct {
	BasicsLoader            *WrappedDataLoader
	OperationalNeedLoader   *WrappedDataLoader
	OperationSolutionLoader *WrappedDataLoader
	DataReader              *DataReader
}

// CompoundKey implements the DataLoader Key interface
type CompoundKey struct {
	Args map[string]interface{}
}

// NewCompoundKey instantiates a compound key
func NewCompoundKey() CompoundKey {
	return CompoundKey{
		Args: map[string]interface{}{},
	}
}

// CompoundKeys represents an Array of CompoundKeys
type CompoundKeys []CompoundKey

// ToJSONArray converts CompoundKeys to JSON array notation
func (ck CompoundKeys) ToJSONArray() (string, *error) {

	mapSlice := []map[string]interface{}{}
	for _, v := range ck {
		mapSlice = append(mapSlice, v.Args)
	}
	byteArr, err := json.Marshal(mapSlice)
	if err != nil {
		return "", &err
	}
	return string(byteArr), nil
}

// CompoundKeyArray casts a dataloader.Keys object to a CompoundKeys object
func CompoundKeyArray(Keys dataloader.Keys) (CompoundKeys, *error) {

	cKeys := []CompoundKey{}
	for _, ck := range Keys {
		converted, ok := ck.Raw().(CompoundKey)
		if ok {
			cKeys = append(cKeys, converted)
		}

	}
	return cKeys, nil

}

// String is an identity method. Used to implement String interface
func (k CompoundKey) String() string { return fmt.Sprint(k.Args) }

// Raw is an identity method. Used to implement Key Raw
func (k CompoundKey) Raw() interface{} { return k }

// NewLoaders instantiates data loaders for the middleware
func NewLoaders(store *storage.Store) *Loaders {
	loaders := &Loaders{
		DataReader: &DataReader{
			Store: store,
		},
	}
	loaders.BasicsLoader = newLoaderWithMap(loaders.GetPlanBasicsByModelPlanID)
	loaders.OperationalNeedLoader = newLoaderWithMap(loaders.GetOperationalNeedsByModelPlanID)
	loaders.OperationSolutionLoader = newLoaderWithMap(loaders.GetOperationalSolutionAndPossibleCollectionByOperationalNeedID)

	return loaders
}

func dataLoadermMiddleware(loaders *Loaders, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCtx := context.WithValue(r.Context(), loadersKey, loaders)
		r = r.WithContext(nextCtx)
		next.ServeHTTP(w, r)
	})
}

// NewDataLoaderMiddleware decorates a request with data loader context
func NewDataLoaderMiddleware(loaders *Loaders) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return dataLoadermMiddleware(loaders, next)
	}
}

// For returns the dataLoaders for a given context
func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}

// DataReader reads Users from a database
type DataReader struct {
	Store *storage.Store
}

func stringArrayFromKeys(keys dataloader.Keys) []string {
	stringArr := make([]string, len(keys))
	for ix, key := range keys {
		stringArr[ix] = key.String()
	}
	return stringArr
}

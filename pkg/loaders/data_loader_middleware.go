package loaders

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
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

// GetPlanBasicsByModelPlanID uses a DataLoader to aggreggate a SQL call and return all plan basics in one query
func (loaders *Loaders) GetPlanBasicsByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	modelPlanIDs := make([]string, len(keys))
	for ix, key := range keys {
		modelPlanIDs[ix] = key.String()
	}
	logger := appcontext.ZLogger(ctx)
	basics, _ := dr.Store.PlanBasicsGetByModelPlanIDLOADER(logger, modelPlanIDs)

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		basic, ok := lo.Find(basics, func(basic *models.PlanBasics) bool { //Get the  plan basic that matches what we asked for

			return basic.ModelPlanID.String() == key.String()
		})

		if ok {
			output[index] = &dataloader.Result{Data: basic, Error: nil}
		} else {
			err := fmt.Errorf("plan basic not found for model plan %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}

func stringArrayFromKeys(keys dataloader.Keys) []string {
	stringArr := make([]string, len(keys))
	for ix, key := range keys {
		stringArr[ix] = key.String()
	}
	return stringArr
}

// GetOperationalNeedsByModelPlanID uses a data loader to aggregate SQL calls and return data
func (loaders *Loaders) GetOperationalNeedsByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {

	modelPlanIDs := stringArrayFromKeys(keys)
	logger := appcontext.ZLogger(ctx)
	dr := loaders.DataReader

	opNeeds, _ := dr.Store.OperationalNeedCollectionGetByModelPlanIDLOADER(logger, modelPlanIDs)

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		needs := lo.Filter(opNeeds, func(opNeed *models.OperationalNeed, index int) bool {
			return opNeed.ModelPlanID.String() == key.String()
		})
		output[index] = &dataloader.Result{Data: needs, Error: nil}

	}
	return output

}

// GetOperationalSolutionAndPossibleCollectionByOperationalNeedID uses a data loader to return operational solutions by operational need id
func (loaders *Loaders) GetOperationalSolutionAndPossibleCollectionByOperationalNeedID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)
	arrayCK, err := CompoundKeyArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Operational Solutions", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Operational Solutions", zap.Error(*err))
	}

	dr := loaders.DataReader

	sols, loadErr := dr.Store.OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER(logger, marshaledParams)

	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck := key.Raw().(CompoundKey)
		opNeedID := fmt.Sprint(ck.Args["operational_need_id"])
		needs := lo.Filter(sols, func(opSol *models.OperationalSolution, index int) bool {

			return opSol.OperationalNeedID.String() == opNeedID
		})
		output[index] = &dataloader.Result{Data: needs, Error: loadErr}

	}
	return output

}

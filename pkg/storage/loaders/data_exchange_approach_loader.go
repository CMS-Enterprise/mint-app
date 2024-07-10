package loaders

import (
	"context"
	"fmt"

	"github.com/davecgh/go-spew/spew"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
)

const (
	// DLDataExchangeApproachIDKey is the key for the data loader for data exchange approach by ID
	DLDataExchangeApproachIDKey = "id"
)

// GetDataExchangeApproachByIDBatch uses a DataLoader to aggregate a SQL call and return all Data Exchange Approaches in one query
func (loaders *DataLoaders) GetDataExchangeApproachByIDBatch(
	ctx context.Context,
	keys dataloader.Keys,
) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Data Exchange Approach", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Data Exchange Approach", zap.Error(*err))
	}

	fmt.Printf("marshaledParams: %s\n", marshaledParams)

	deas, _ := dr.Store.DataExchangeApproachGetByIDLOADER(logger, marshaledParams)

	fmt.Printf("deas: %s\n", spew.Sdump(deas))

	deaByID := lo.Associate(deas, func(dea *models.DataExchangeApproach) (string, *models.DataExchangeApproach) {
		return dea.ID.String(), dea
	})

	fmt.Printf("deaByID: %s\n", spew.Sdump(deaByID))

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["id"])
			dea, ok := deaByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: dea, Error: nil}
			} else {
				err := fmt.Errorf("data exchange approach not found with ID %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrieve key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output
}

// GetDataExchangeApproachByModelPlanIDBatch uses a DataLoader to aggregate a SQL call and return all Data Exchange Approaches in one query
func (loaders *DataLoaders) GetDataExchangeApproachByModelPlanIDBatch(
	ctx context.Context,
	keys dataloader.Keys,
) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Data Exchange Approach", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Data Exchange Approach", zap.Error(*err))
	}

	deas, _ := dr.Store.DataExchangeApproachGetByModelPlanIDLOADER(logger, marshaledParams)
	deaByID := lo.Associate(deas, func(dea *models.DataExchangeApproach) (string, *models.DataExchangeApproach) {
		return dea.ModelPlanID.String(), dea
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"])
			dea, ok := deaByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: dea, Error: nil}
			} else {
				err := fmt.Errorf("data exchange approach not found for model plan %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrieve key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output
}

// GetDataExchangeApproachByID returns a data exchange approach by id utilizing a data loader
func GetDataExchangeApproachByID(ctx context.Context, id uuid.UUID) (
	*models.DataExchangeApproach,
	error,
) {

	allLoaders := Loaders(ctx)
	dataExchangeApproachLoader := allLoaders.DataExchangeApproachLoader
	key := NewKeyArgs()
	key.Args[DLDataExchangeApproachIDKey] = []uuid.UUID{id}

	thunk := dataExchangeApproachLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	dataExchangeApproachLoaderSlice, ok := result.([]*models.DataExchangeApproach)
	if !ok {
		return nil, fmt.Errorf("could not cast data exchange approach to slice")
	}

	if len(dataExchangeApproachLoaderSlice) == 0 {
		return nil, nil
	}

	return dataExchangeApproachLoaderSlice[0], nil
}

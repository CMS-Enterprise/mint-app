package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// OperationalSolutionGetByID uses a data loader to return an operational solution by ID
func (loaders *DataLoaders) OperationalSolutionGetByID(
	ctx context.Context,
	keys dataloader.Keys,
) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Operational Solution", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Operational Solution", zap.Error(*err))
	}

	dr := loaders.DataReader

	opSols, loadErr := dr.Store.OperationalSolutionGetByIDLOADER(logger, marshaledParams)
	if loadErr != nil {
		return []*dataloader.Result{{Data: nil, Error: loadErr}}
	}

	opSolsByID := lo.Associate(opSols, func(gc *models.OperationalSolution) (string, *models.OperationalSolution) {
		return gc.ID.String(), gc
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["id"])
			opSol, ok := opSolsByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: opSol, Error: nil}
			} else {
				err := fmt.Errorf("operational solution not found for id %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}

	return output
}

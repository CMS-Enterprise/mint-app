package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
)

// GetOperationalSolutionAndPossibleCollectionByOperationalNeedID uses a data loader to return operational solutions by operational need id
func (loaders *DataLoaders) GetOperationalSolutionAndPossibleCollectionByOperationalNeedID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Operational Solutions", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Operational Solutions", zap.Error(*err))
	}

	dr := loaders.DataReader

	sols, loadErr := dr.Store.OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER(logger, marshaledParams)
	if loadErr != nil {
		return []*dataloader.Result{{Data: nil, Error: loadErr}}

	}
	solsByID := map[string][]*models.OperationalSolution{}
	for _, sol := range sols {
		slice, ok := solsByID[string(sol.OperationalNeedID.String())]
		if ok {
			slice = append(slice, sol) //Add to existing slice
			solsByID[string(sol.OperationalNeedID.String())] = slice
			continue
		}
		solsByID[string(sol.OperationalNeedID.String())] = []*models.OperationalSolution{sol}
	}

	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {

			resKey := fmt.Sprint(ck.Args["operational_need_id"])
			sols := solsByID[resKey] //Any Solutions not found will return a zero state result eg empty array

			output[index] = &dataloader.Result{Data: sols, Error: nil}

		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}

	}
	return output

}

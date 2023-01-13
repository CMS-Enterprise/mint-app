package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
)

// GetOperationalSolutionAndPossibleCollectionByOperationalNeedID uses a data loader to return operational solutions by operational need id
func (loaders *DataLoaders) GetOperationalSolutionAndPossibleCollectionByOperationalNeedID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
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

	resSet, loadErr := dr.Store.OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER(logger, marshaledParams)

	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck := key.Raw().(KeyArgs)
		resKey := fmt.Sprint(ck.Args["operational_need_id"])
		resKey = resKey + fmt.Sprint(ck.Args["include_not_needed"]) //so there isn't a space
		opSols := resSet[resKey]
		output[index] = &dataloader.Result{Data: opSols, Error: loadErr}

	}
	return output

}

package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
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

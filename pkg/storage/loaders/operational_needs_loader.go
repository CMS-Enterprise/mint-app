package loaders

import (
	"context"

	"github.com/graph-gophers/dataloader"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
)

// GetOperationalNeedsByModelPlanID uses a data loader to aggregate SQL calls and return data
func (loaders *DataLoaders) GetOperationalNeedsByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {

	modelPlanIDs := stringArrayFromKeys(keys)
	logger := appcontext.ZLogger(ctx)
	dr := loaders.DataReader

	opNeeds, _ := dr.Store.OperationalNeedCollectionGetByModelPlanIDLOADER(logger, modelPlanIDs)
	opNeedsByID := map[string][]*models.OperationalNeed{}
	for _, opNeed := range opNeeds {

		slice, ok := opNeedsByID[string(opNeed.ModelPlanID.String())]
		if ok {
			slice = append(slice, opNeed) //Add to existing slice
			opNeedsByID[string(opNeed.ModelPlanID.String())] = slice
			continue
		}
		opNeedsByID[string(opNeed.ModelPlanID.String())] = []*models.OperationalNeed{opNeed}
	}

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		needs := opNeedsByID[key.String()]
		// needs := lo.Filter(opNeeds, func(opNeed *models.OperationalNeed, index int) bool {
		// 	return opNeed.ModelPlanID.String() == key.String()
		// })
		output[index] = &dataloader.Result{Data: needs, Error: nil}

	}
	return output

}

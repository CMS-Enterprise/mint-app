package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
)

// GetPlanBasicsByModelPlanID uses a DataLoader to aggreggate a SQL call and return all plan basics in one query
func (loaders *DataLoaders) GetPlanBasicsByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	modelPlanIDs := make([]string, len(keys))
	for ix, key := range keys {
		modelPlanIDs[ix] = key.String()
	}
	logger := appcontext.ZLogger(ctx)
	basics, _ := dr.Store.PlanBasicsGetByModelPlanIDLOADER(logger, modelPlanIDs)
	basicsByID := lo.Associate(basics, func(b *models.PlanBasics) (string, *models.PlanBasics) {
		return b.ModelPlanID.String(), b
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		basic, ok := basicsByID[key.String()]

		if ok {
			output[index] = &dataloader.Result{Data: basic, Error: nil}
		} else {
			err := fmt.Errorf("plan basic not found for model plan %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}

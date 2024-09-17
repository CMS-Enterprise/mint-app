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

// GetPlanParticipantsAndProvidersByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Plan Participants and Providers in one query
func (loaders *DataLoaders) GetPlanParticipantsAndProvidersByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Plan Participants and Providers", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Plan Participants and Providers", zap.Error(*err))
	}

	pAndPs, _ := dr.Store.PlanParticipantsAndProvidersGetByModelPlanIDLOADER(logger, marshaledParams)
	pAndPByID := lo.Associate(pAndPs, func(gc *models.PlanParticipantsAndProviders) (string, *models.PlanParticipantsAndProviders) {
		return gc.ModelPlanID.String(), gc
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"])
			pAndP, ok := pAndPByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: pAndP, Error: nil}
			} else {
				err := fmt.Errorf("plan Participants and Providers not found for model plan %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}

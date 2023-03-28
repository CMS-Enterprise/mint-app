package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
)

// GetPlanCollaboratorByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Plan Collaborator in one query
func (loaders *DataLoaders) GetPlanCollaboratorByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Plan Collaborator", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Plan Collaborator", zap.Error(*err))
	}

	collabs, _ := dr.Store.PlanCollaboratorGetByModelPlanIDLOADER(logger, marshaledParams)
	collabByID := map[string][]*models.PlanCollaborator{}
	for _, collab := range collabs {
		slice, ok := collabByID[string(collab.ModelPlanID.String())]
		if ok {
			slice = append(slice, collab) //Add to existing slice
			collabByID[string(collab.ModelPlanID.String())] = slice
			continue
		}
		collabByID[string(collab.ModelPlanID.String())] = []*models.PlanCollaborator{collab}
	}

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"])
			collab, ok := collabByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: collab, Error: nil}
			} else {
				err := fmt.Errorf("plan Collaborator not found for model plan %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}

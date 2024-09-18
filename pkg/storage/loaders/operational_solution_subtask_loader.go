package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// GetOperationalSolutionSubtaskByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Operational Solution Subtask in one query
func (loaders *DataLoaders) GetOperationalSolutionSubtaskByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Operational Solution Subtask", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Operational Solution Subtask", zap.Error(*err))
	}

	OpSolSs, _ := dr.Store.OperationalSolutionSubtaskGetByModelPlanIDLOADER(logger, marshaledParams)
	OpSolSByID := map[string][]*models.OperationalSolutionSubtask{}
	for _, opNeed := range OpSolSs {

		slice, ok := OpSolSByID[string(opNeed.SolutionID.String())]
		if ok {
			slice = append(slice, opNeed) //Add to existing slice
			OpSolSByID[string(opNeed.SolutionID.String())] = slice
			continue
		}
		OpSolSByID[string(opNeed.SolutionID.String())] = []*models.OperationalSolutionSubtask{opNeed}
	}

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["solution_id"])
			OpSolS := OpSolSByID[resKey]
			output[index] = &dataloader.Result{Data: OpSolS, Error: nil}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}

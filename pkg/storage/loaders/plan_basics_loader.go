package loaders

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	v7 "github.com/graph-gophers/dataloader/v7"
)

// GetPlanBasicsByModelPlanID uses a DataLoader to aggreggate a SQL call and return all plan basics in one query
func (loaders *DataLoaders) GetPlanBasicsByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Plan Basics", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Plan Basics", zap.Error(*err))
	}

	basics, _ := dr.Store.PlanBasicsGetByModelPlanIDLOADER(logger, marshaledParams)
	basicsByID := lo.Associate(basics, func(b *models.PlanBasics) (string, *models.PlanBasics) {
		return b.ModelPlanID.String(), b
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"])
			basic, ok := basicsByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: basic, Error: nil}
			} else {
				err := fmt.Errorf("plan basic not found for model plan %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}

func PlanBasicsGetByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanBasics, error) {

	loadgen, ok := loadgensFromCTX(ctx)
	if !ok {
		return nil, fmt.Errorf("unexpected nil loaders in PlanBasicsGetByModelPlanID")
	}

	return loadgen.PlanBasicsByModelPlanID.Load(ctx, modelPlanID)
}

func (dl *DataLoadgens) batchPlanBasicsGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) ([]*models.PlanBasics, []error) {
	logger := appcontext.ZLogger(ctx)
	data, err := storage.PlanBasicsGetByModelPlanIDLOADGEN(dl.dataReader.Store, logger, modelPlanIDs)
	if err != nil {
		// TODO: verify that this works as anticipated
		return nil, []error{err}
	}
	basicsByModelPlanID := lo.Associate(data, func(basics *models.PlanBasics) (uuid.UUID, *models.PlanBasics) {
		return basics.ModelPlanID, basics
	})
	//TODO: Implement
	_ = basicsByModelPlanID
	return nil, nil

}

func (loaders *DataLoaders) batchPlanBasicsGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*v7.Result[*models.PlanBasics] {
	// ([]*models.PlanBasics, []error) {
	logger := appcontext.ZLogger(ctx)
	output := make([]*v7.Result[*models.PlanBasics], len(modelPlanIDs))

	data, err := storage.PlanBasicsGetByModelPlanIDLOADGEN(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {

		// TODO return an error per result if needed
		for index := range modelPlanIDs {
			output[index] = &v7.Result[*models.PlanBasics]{Data: nil, Error: err}
		}
		return output
		// return nil, []error{err}
	}
	basicsByModelPlanID := lo.Associate(data, func(basics *models.PlanBasics) (uuid.UUID, *models.PlanBasics) {
		return basics.ModelPlanID, basics
	})
	//TODO: Implement
	_ = basicsByModelPlanID

	// RETURN IN THE SAME ORDER REQUESTED

	for index, id := range modelPlanIDs {

		basics, ok := basicsByModelPlanID[id]
		if ok {
			output[index] = &v7.Result[*models.PlanBasics]{Data: basics, Error: nil}
		} else {
			err2 := fmt.Errorf("plan basics not found for modelPlanID id %s", id)
			output[index] = &v7.Result[*models.PlanBasics]{Data: nil, Error: err2}
		}
	}
	return output

}

func PlanBasicsGetByModelPlanIDLoader2(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanBasics, error) {
	allLoaders := Loaders(ctx)
	basicsLoader := allLoaders.TestingLoader
	// loaders, ok := Loader(ctx)
	// if !ok {
	// 	return nil, fmt.Errorf("unexpected nil loaders in GetModelPlanByModelPlanID")
	// }

	// thunk := basicsLoader.Load(ctx, modelPlanID)
	// return thunk()
	// TODO (loaders), should we inline this? Or separate the thunk?
	return basicsLoader.Load(ctx, modelPlanID)()

}

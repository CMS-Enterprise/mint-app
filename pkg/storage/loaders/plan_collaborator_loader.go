package loaders

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

const (
	// DLIDKey is the key used to store and retrieve an id
	DLIDKey string = "id"
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
			err := fmt.Errorf("could not retrieve key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}

// getPlanCollaboratorByIDBatch uses a DataLoader to aggregate a SQL call and return all Plan Collaborators for a collection of IDS in one query
func (loaders *DataLoaders) getPlanCollaboratorByIDBatch(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	jsonParams, err := CovertToJSONArray(keys)
	output := make([]*dataloader.Result, len(keys))
	if err != nil {
		setEachOutputToError(fmt.Errorf("issue converting keys to json for PlanCollaboratorByIDLoader, %w", err), output)
		return output
	}
	collaborators, err := storage.PlanCollaboratorGetIDLOADER(loaders.DataReader.Store, jsonParams)
	if err != nil {
		setEachOutputToError(err, output)
		return output
	}

	collaboratorByID := lo.Associate(collaborators, func(collab *models.PlanCollaborator) (string, *models.PlanCollaborator) { //TRANSLATE TO MAP
		return collab.ID.String(), collab
	})
	// RETURN IN THE SAME ORDER REQUESTED

	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args[DLIDKey])
			user, ok := collaboratorByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: user, Error: nil}
			} else {
				err := fmt.Errorf("plan collaborator not found for id %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrieve key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output
}

// PlanCollaboratorByID returns the Plan Collaborator data loader, loads it, and returns the correct result
func PlanCollaboratorByID(ctx context.Context, id uuid.UUID) (*models.PlanCollaborator, error) {
	allLoaders := Loaders(ctx)
	collabByIDLoader := allLoaders.PlanCollaboratorByIDLoader
	key := NewKeyArgs()

	key.Args[DLIDKey] = id
	thunk := collabByIDLoader.Loader.Load(ctx, key)

	result, err := thunk()
	if err != nil {
		return nil, err
	}
	return result.(*models.PlanCollaborator), nil

}

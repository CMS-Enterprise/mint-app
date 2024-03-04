package loaders

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

const (
	// DLModelPlanIDsKey is the key used to store and retrieve the modelPlanIDs
	DLModelPlanIDsKey string = "model_plan_ids"
	// DLDateKey is the key used to store and retrieve date parameters
	DLDateKey string = "date"
)

// DLAnalyzedAuditCompoundKey combines both individual keys used for the Analyzed audit loader to streamline returning the result set
var DLAnalyzedAuditCompoundKey = DLModelPlanIDsKey + "_" + DLDateKey

// analyzedAuditGetByModelPlanIDAndDateBatch returns an array of dataloader results for a given set of keys
func (loaders *DataLoaders) analyzedAuditGetByModelPlanIDAndDateBatch(_ context.Context, keys dataloader.Keys) []*dataloader.Result {
	jsonParams, err := CovertToJSONArray(keys)
	if err != nil {
		return []*dataloader.Result{{Data: nil, Error: fmt.Errorf("issue converting keys to json for AnalyzedAuditLoader, %w", err)}}
	}

	audits, err := storage.AnalyzedAuditGetByModelPlanIDsAndDateLoader(loaders.DataReader.Store, jsonParams)
	if err != nil {
		return []*dataloader.Result{{Data: nil, Error: err}}
	}

	auditsByID := map[string][]*models.AnalyzedAudit{}
	//MAP by date first

	for _, anAudit := range audits {
		// key = DLDateKey
		// slice, ok := auditsByID[string(anAudit.Date.UTC().Format("2006-01-02"))]
		slice, ok := auditsByID[string(anAudit.UTCDate())]
		if ok {
			slice = append(slice, anAudit) //Add to existing slice
			auditsByID[string(anAudit.UTCDate())] = slice
			continue
		}
		auditsByID[string(anAudit.UTCDate())] = []*models.AnalyzedAudit{anAudit}

	}
	//TODO: EASI-(EASI-3949) Make this actually return based on the ids and the date. If needed, just do it for one date and id, and do another layer that combines a selection of model plan IDs

	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {

			resKey := fmt.Sprint(ck.Args[DLDateKey])
			sols := auditsByID[resKey] //Any Audits not found will return a zero state result eg empty array

			output[index] = &dataloader.Result{Data: sols, Error: nil}

		} else {
			err := fmt.Errorf("could not retrieve key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}

	}
	return output
}

// AnalyzedAuditGetByModelPlanIDsAndDate returns a collection of analyzed audits for a model plans for a specific date utilizing a data loader
func AnalyzedAuditGetByModelPlanIDsAndDate(ctx context.Context, modelPlanIDs []uuid.UUID, date time.Time) ([]*models.AnalyzedAudit, error) {

	allLoaders := Loaders(ctx)
	auditLoader := allLoaders.AnalyzedAuditLoader
	key := NewKeyArgs()
	key.Args[DLModelPlanIDsKey] = modelPlanIDs
	key.Args[DLDateKey] = date.UTC().Format("2006-01-02")

	thunk := auditLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}
	return result.([]*models.AnalyzedAudit), nil

}

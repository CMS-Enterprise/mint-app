package loaders

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
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

	//First Key is Date, second is modelPlanID
	auditsByID := map[string]map[uuid.UUID]*models.AnalyzedAudit{}
	//MAP by date first
	// then MAP by model_plan_id

	for _, anAudit := range audits {
		dateKey := string(anAudit.UTCDate())
		if _, ok := auditsByID[dateKey]; !ok {
			auditsByID[dateKey] = map[uuid.UUID]*models.AnalyzedAudit{}
		}
		auditsByID[string(anAudit.UTCDate())][anAudit.ModelPlanID] = anAudit

	}

	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {

			dateKey := fmt.Sprint(ck.Args[DLDateKey])
			mpKeysRaw := ck.Args[DLModelPlanIDsKey]
			// Cast the ids to the uuid
			modelPlanIDS, ok := mpKeysRaw.([]uuid.UUID)
			if !ok {
				err := fmt.Errorf("could not retrieve key from %s", key.String())
				output[index] = &dataloader.Result{Data: nil, Error: err}
				continue
			}

			// Build the result set
			retAudits := []*models.AnalyzedAudit{}
			var auditErr error
			for _, id := range modelPlanIDS {
				// Get the specific audit
				audit := auditsByID[dateKey][id]
				if audit == nil {
					if auditErr == nil {
						auditErr = fmt.Errorf("analyzed audit not found for %s, %s", dateKey, id)
					} else {
						auditErr = fmt.Errorf("err: %w, analyzed audit not found for %s, %s", auditErr, dateKey, id)
					}
				}
				retAudits = append(retAudits, audit)
			}
			if auditErr != nil {
				output[index] = &dataloader.Result{Data: retAudits, Error: auditErr}
			} else {
				output[index] = &dataloader.Result{Data: retAudits, Error: nil}
			}

		} else {
			err := fmt.Errorf("could not retrieve key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}

	}
	return output
}

// AnalyzedAuditGetByModelPlanIDsAndDate returns a collection of analyzed audits for a model plans for a specific date utilizing a data loader
func AnalyzedAuditGetByModelPlanIDsAndDate(ctx context.Context, modelPlanIDs []uuid.UUID, date time.Time) ([]*models.AnalyzedAudit, error) {

	allLoaders, err := Loaders(ctx)
	if err != nil {
		return nil, err
	}
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

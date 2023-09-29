package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
)

// PossibleOperationalSolutionContactsGetByPossibleSolutionID uses a DataLoader to aggreggate a SQL call and return all contacts in one query
func (loaders *DataLoaders) PossibleOperationalSolutionContactsGetByPossibleSolutionID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Possible Operational Solution Contact", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Possible Operational Solution Contact", zap.Error(*err))
	}

	contacts, loadErr := dr.Store.PossibleOperationalSolutionContactsGetByPossibleSolutionIDLOADER(logger, marshaledParams)
	if loadErr != nil {
		return []*dataloader.Result{{Data: nil, Error: loadErr}}

	}
	contactsByID := map[string][]*models.PossibleOperationalSolutionContact{}

	for _, contact := range contacts {
		key := fmt.Sprint(contact.PossibleOperationalSolutionID)
		slice, ok := contactsByID[key]
		if ok { // There is already a slice in the array
			slice = append(slice, contact) // Add existing to slice
			contactsByID[key] = slice
		}
		contactsByID[key] = []*models.PossibleOperationalSolutionContact{contact}
	}

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["possible_operational_solution_id"])
			contacts := contactsByID[resKey] // If a contact is not found, it will return a zero state result eg empty array.

			output[index] = &dataloader.Result{Data: contacts, Error: nil}

		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}

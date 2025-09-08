package notifications

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// activityCreate creates a new activity in the database.
func activityCreate(_ context.Context, np sqlutils.NamedPreparer, activity *models.Activity) (*models.Activity, error) {
	// All activities need to call the specific resolver, this is the resolver simply to create the DB record and the notifications

	retActivity, err := dbStore.activity.Create(np, activity)
	if err != nil {
		return nil, err
	}
	return retActivity, nil

}

// ActivityGetByIDLoaderThunk is the method called by the data loader to batch
func ActivityGetByIDLoaderThunk(_ context.Context, np sqlutils.NamedPreparer, paramTableJSON string, orderedKeys []string) []*dataloader.Result {

	activities, err := dbStore.activity.GetByIDLoader(np, paramTableJSON)
	if err != nil {
		return []*dataloader.Result{{Data: nil, Error: err}}
	}

	activitiesByID := lo.Associate(activities, func(a *models.Activity) (string, *models.Activity) {
		return a.ID.String(), a
	})
	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(orderedKeys))
	for index, key := range orderedKeys {
		activity, ok := activitiesByID[key]
		if ok {
			// PARSE the meta data
			success, err := activity.ParseRawActivityMetaData()
			if !success || err != nil {
				err = fmt.Errorf("issue converting activity meta data to discrete type: %w", err)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}

			output[index] = &dataloader.Result{Data: activity, Error: nil}

		} else {
			err := fmt.Errorf("activity not found for id %s", key)
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}

	}
	return output

}

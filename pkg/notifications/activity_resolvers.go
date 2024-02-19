package notifications

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

//TODO: EASI-3294 Perhaps export this differently? EG, a distinct function call? Or a package with distinct calls? That might allow us to move this back to models...

// activityCreate creates a new activity in the database.
// It ensures that a notification record is also created in the database for each relevant user based on
// a. Activity type
// b. Notification preferences
func activityCreate(_ context.Context, np sqlutils.NamedPreparer, activity *Activity) (*Activity, error) {
	// All activities need to call the specific resolver, this is the resolver simply to create the DB record and the notifications

	// //TODO: EASI-3294: either switch here, or make distinct Calls.. Probably favor distinct calls
	// meta := createNewPlanDiscussionActivityMeta(activity.EntityID)
	// activity.MetaData = meta
	retActivity, err := dbCall.ActivityCreate(np, activity)
	if err != nil {
		return nil, err
	}

	//TODO: EASI-3295 should we just create notifications in each resolver instead of this shared one?

	//TODO: EASI-3294 create all notifications for all relevant users, either as
	//   a. part of this function
	//   b. db trigger
	//   c. another transaction?
	// _, err = userNotificationCreateAllPerActivity(ctx, np, retActivity)
	// if err != nil {
	// 	return nil, err
	// }

	return retActivity, nil

}

// ActivityGetByID Returns an activity from the database
// the dataloader should be favored over this method
func ActivityGetByID(_ context.Context, np sqlutils.NamedPreparer, id uuid.UUID) (*Activity, error) {
	//TODO: EASI-3925 think about refactoring package structure to allow this
	// return loaders.ActivityGetByID(ctx, id)

	return dbCall.ActivityGetByID(np, id)
	//TODO: EASI-3294 implement this as a dataloader
}

// ActivityGetByIDLoaderThunk is the method called by the data loader to
func ActivityGetByIDLoaderThunk(_ context.Context, np sqlutils.NamedPreparer, paramTableJSON string, orderedKeys []string) []*dataloader.Result {

	activities, err := dbCall.ActivityGetByIDLoader(np, paramTableJSON)
	if err != nil {
		return []*dataloader.Result{{Data: nil, Error: err}}
	}

	activitiesByID := lo.Associate(activities, func(a *Activity) (string, *Activity) {
		return a.ID.String(), a
	})
	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(orderedKeys))
	for index, key := range orderedKeys {
		activity, ok := activitiesByID[key]
		if ok {
			// PARSE the meta data

			meta, err := parseRawActivityMetaData(activity.ActivityType, activity.MetaDataRaw)
			if err != nil {
				err = fmt.Errorf("issue converting activity meta data to discrete type: %w", err)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
			activity.MetaData = meta

			output[index] = &dataloader.Result{Data: activity, Error: nil}

		} else {
			err := fmt.Errorf("activity  not found for id %s", key)
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}

	}
	return output

}

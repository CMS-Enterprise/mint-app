package notifications

import (
	"context"

	"github.com/google/uuid"

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

// createNewPlanDiscussionActivityMeta creates the relevant meta data object for a new plan Discussion activity
func createNewPlanDiscussionActivityMeta(discussionID uuid.UUID) ActivityMetaData {
	return newNewPlanDiscussionActivityMeta(discussionID)
}

// ActivityGetByID Returns an activity from the database
func ActivityGetByID(_ context.Context, np sqlutils.NamedPreparer, id uuid.UUID) (*Activity, error) {

	return dbCall.ActivityGetByID(np, id)
	//TODO: EASI-3294 implement this as a dataloader
}

package notifications

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// ActivityNewModelPlanCreate creates an activity for when a new model plan is created.
// It also creates all the relevant notifications
func ActivityNewModelPlanCreate(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	getPreferencesFunc GetUserNotificationPreferencesFunc) (*models.Activity, error) {

	activity := models.NewNewModelPlanMetaActivity(actorID, modelPlanID)

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	// TODO: Which user IDs should be passed here? (1/2)
	pref, err := getPreferencesFunc(ctx, uuid.Nil)
	if err != nil {
		return nil, fmt.Errorf("unable to get user notification preference, Notification not created %w", err)
	}

	// TODO: Which user IDs should be passed here? (2/2)
	_, err = userNotificationCreate(ctx, np, retActivity, uuid.Nil, pref.AddedAsCollaborator)
	if err != nil {
		return nil, err
	}

	return retActivity, nil

}

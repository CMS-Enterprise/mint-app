package notifications

import (
	"context"

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
	userAccountPrefs []*models.UserAccountAndNotificationPreferences,
) (*models.Activity, error) {

	activity := models.NewNewModelPlanMetaActivity(actorID, modelPlanID)

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	for _, pref := range userAccountPrefs {
		_, err := userNotificationCreate(ctx, np, retActivity, pref.ID, pref.PreferenceFlags)
		if err != nil {
			return nil, err
		}
	}

	return retActivity, nil

}

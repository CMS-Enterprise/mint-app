package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// ActivityDatesChangedCreate creates an activity for when a model plan has its dates changed
func ActivityDatesChangedCreate(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	datesChanged []models.DateChange,
	receiverIDs []uuid.UUID,
	getPreferencesFunc GetUserNotificationPreferencesFunc,
) (*models.Activity, error) {
	activity := models.NewDatesChangedActivity(actorID, modelPlanID, datesChanged)

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	for _, receiverID := range receiverIDs {
		preferences, err := getPreferencesFunc(ctx, receiverID)
		if err != nil {
			return nil, err
		}

		_, err = userNotificationCreate(ctx, np, retActivity, receiverID, preferences.DatesChanged)
		if err != nil {
			return nil, err
		}
	}

	return retActivity, nil
}

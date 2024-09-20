package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// ActivityDataExchangeApproachCompletedCreate creates an activity for when a data exchange approach is completed
func ActivityDataExchangeApproachCompletedCreate(
	ctx context.Context,
	actorID uuid.UUID,
	np sqlutils.NamedPreparer,
	receivers []*models.UserAccountAndNotificationPreferences,
	approachID uuid.UUID,
	markedCompletedBy uuid.UUID,
	getPreferencesFunc GetUserNotificationPreferencesFunc,
) (*models.Activity, error) {

	activity := models.NewDataExchangeApproachCompletedActivity(
		actorID,
		approachID,
		markedCompletedBy,
	)

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	for _, receiver := range receivers {
		_, err := userNotificationCreate(ctx, np, retActivity, receiver.ID, receiver.PreferenceFlags)
		if err != nil {
			return nil, err
		}
	}

	return retActivity, nil
}

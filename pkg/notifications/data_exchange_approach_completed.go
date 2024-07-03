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
	receiverIDs []uuid.UUID,
	approach *models.DataExchangeApproach,
	markedCompletedBy uuid.UUID,
	getPreferencesFunc GetUserNotificationPreferencesFunc,
) (*models.Activity, error) {
	activity := models.NewDataExchangeApproachCompletedActivity(
		actorID,
		approach,
		markedCompletedBy,
	)

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	for _, receiverID := range receiverIDs {
		preferences, err := getPreferencesFunc(ctx, receiverID)
		if err != nil {
			return nil, err
		}

		_, err = userNotificationCreate(ctx, np, retActivity, receiverID, preferences.ModelPlanShared)
		if err != nil {
			return nil, err
		}
	}

	return retActivity, nil
}

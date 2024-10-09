package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityDataExchangeApproachMarkedCompleteCreate creates an activity for when a data exchange approach is marked complete
func ActivityDataExchangeApproachMarkedCompleteCreate(
	ctx context.Context,
	actorID uuid.UUID,
	np sqlutils.NamedPreparer,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlanID,
	approachID uuid.UUID,
	markedCompletedBy uuid.UUID,
) (*models.Activity, error) {

	activity := models.NewPlanDataExchangeApproachMarkedCompleteActivity(
		actorID,
		modelPlanID,
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

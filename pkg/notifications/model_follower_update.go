package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityModelFollowerUpdateCreate creates an activity for when a model plan sends an update message to its followers
func ActivityModelFollowerUpdateCreate(
	ctx context.Context,
	actorID uuid.UUID,
	np sqlutils.NamedPreparer,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlanID uuid.UUID,
	content string,
) (*models.Activity, error) {

	activity := models.NewModelFollowerUpdateActivity(
		actorID,
		modelPlanID,
		content,
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

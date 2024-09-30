package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityModelPlanSharedCreate creates an activity for when a model plan is shared
func ActivityModelPlanSharedCreate(ctx context.Context, np sqlutils.NamedPreparer, actorID uuid.UUID, receiverIDs []uuid.UUID, modelPlanID uuid.UUID, optionalMessage *string, getPreferencesFunc GetUserNotificationPreferencesFunc) (*models.Activity, error) {
	activity := models.NewModelPlanSharedActivityMeta(actorID, modelPlanID, optionalMessage)

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

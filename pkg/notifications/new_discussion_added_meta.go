package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityNewDiscussionAddedCreate creates an activity for when a Discussion is added.
func ActivityNewDiscussionAddedCreate(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	actorID uuid.UUID,
	receiverIDs []uuid.UUID,
	planDiscussion *models.PlanDiscussion,
	modelPlan *models.ModelPlan,
	userName string,
	role string,
	getPreferencesFunc GetUserNotificationPreferencesFunc,
) (*models.Activity, error) {

	activity := models.NewNewDiscussionAddedActivity(planDiscussion, modelPlan, actorID, userName, role)

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	for _, receiverID := range receiverIDs {
		preferences, err := getPreferencesFunc(ctx, receiverID)
		if err != nil {
			return nil, err
		}

		_, err = userNotificationCreate(ctx, np, retActivity, receiverID, preferences.NewDiscussionAdded)
		if err != nil {
			return nil, err
		}
	}

	return retActivity, nil
}

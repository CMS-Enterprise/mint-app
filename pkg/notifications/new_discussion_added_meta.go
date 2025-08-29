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
	recipients []*models.UserAccountAndNotificationPreferences,
	planDiscussion *models.PlanDiscussion,
	modelPlan *models.ModelPlan,
	userName string,
	role string,
) (*models.Activity, error) {
	activity := models.NewNewDiscussionAddedActivity(planDiscussion, modelPlan, actorID, userName, role)

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	for _, recipient := range recipients {
		_, err := userNotificationCreate(ctx, np, retActivity, recipient.ID, recipient.PreferenceFlags)
		if err != nil {
			return nil, err
		}
	}

	return retActivity, nil
}

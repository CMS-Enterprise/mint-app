package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// ActivityDatesChangedCreate creates an activity for when a model plan has its dates changed
func ActivityDatesChangedCreate(ctx context.Context, np sqlutils.NamedPreparer, actorID uuid.UUID, modelPlanID uuid.UUID, datesChanged []models.DateChange, recipients []*models.UserAccountAndNotificationPreferences) (*models.Activity, error) {
	activity := models.NewDatesChangedActivity(actorID, modelPlanID, datesChanged)

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

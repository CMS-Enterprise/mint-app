package notifications

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// DatesChangedCreate creates an activity for when dates are changed on a model plan
func DatesChangedCreate(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	dateChanges []models.DateChange,
	recipients []uuid.UUID,
	getPreferencesFunc GetUserNotificationPreferencesFunc) (*models.Activity, error) {

	activity := models.NewDatesChangedActivity(actorID, modelPlanID, dateChanges)

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	for _, recipient := range recipients {
		pref, err := getPreferencesFunc(ctx, recipient)
		if err != nil {
			return nil, fmt.Errorf("unable to get user notification preference, Notification not created %w", err)
		}

		_, err = userNotificationCreate(ctx, np, retActivity, recipient, pref.AddedAsCollaborator)
		if err != nil {
			return nil, err
		}
	}

	return retActivity, nil

}

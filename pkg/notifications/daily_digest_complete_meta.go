package notifications

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityDailyDigestComplete creates a new activity for the Daily Digest Complete email
func ActivityDailyDigestComplete(ctx context.Context, np sqlutils.NamedPreparer, actorID uuid.UUID, userID uuid.UUID, date time.Time, modelPlanIDs []uuid.UUID, getPreferencesFunc GetUserNotificationPreferencesFunc) (*models.Activity, error) {

	activity := models.NewDailyDigestCompleteActivity(actorID, userID, date, modelPlanIDs)

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}
	pref, err := getPreferencesFunc(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("unable to get user notification preference, Notification not created %w", err)
	}

	_, err = userNotificationCreate(ctx, np, retActivity, userID, pref.DailyDigestComplete)
	if err != nil {
		return nil, err
	}

	return retActivity, nil

}

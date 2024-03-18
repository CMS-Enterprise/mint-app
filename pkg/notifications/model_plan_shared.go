package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// ActivityModelPlanSharedCreate creates an activity for when a model plan is shared
func ActivityModelPlanSharedCreate(ctx context.Context, np sqlutils.NamedPreparer, actorID uuid.UUID, modelPlanID uuid.UUID, prefs *models.UserNotificationPreferences) (*models.Activity, error) {
	activity := models.NewModelPlanSharedActivityMeta(actorID, modelPlanID)

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	if prefs.ModelPlanShared.InApp() {
		_, err := userNotificationCreate(ctx, np, retActivity, actorID, prefs.ModelPlanShared)
		if err != nil {
			return nil, err
		}
	}

	return retActivity, nil
}

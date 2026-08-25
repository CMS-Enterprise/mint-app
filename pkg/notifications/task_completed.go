package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityTaskCompletedCreate creates an activity for when a plan task is completed.
func ActivityTaskCompletedCreate(
	ctx context.Context,
	actorID uuid.UUID,
	np sqlutils.NamedPreparer,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlanID uuid.UUID,
	task *models.PlanTask,
	completedBy uuid.UUID,
) (*models.Activity, error) {
	activity := models.NewTaskCompletedActivity(
		actorID,
		modelPlanID,
		task.ID,
		task.Key,
		completedBy,
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

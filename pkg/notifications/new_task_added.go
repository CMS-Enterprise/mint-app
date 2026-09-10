package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityNewTaskAddedCreate creates an activity for when a plan task becomes available.
func ActivityNewTaskAddedCreate(
	ctx context.Context,
	actorID uuid.UUID,
	np sqlutils.NamedPreparer,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlanID uuid.UUID,
	task *models.PlanTask,
) (*models.Activity, error) {
	activity := models.NewNewTaskAddedActivity(
		actorID,
		modelPlanID,
		task.ID,
		task.Key,
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

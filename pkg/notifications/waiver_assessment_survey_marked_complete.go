package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityWaiverAssessmentSurveyMarkedCompleteCreate creates an activity for when a waiver assessment survey is marked complete
func ActivityWaiverAssessmentSurveyMarkedCompleteCreate(
	ctx context.Context,
	actorID uuid.UUID,
	np sqlutils.NamedPreparer,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlanID uuid.UUID,
	surveyID uuid.UUID,
	markedCompleteBy uuid.UUID,
) (*models.Activity, error) {

	activity := models.NewWaiverAssessmentSurveyMarkedCompleteActivity(
		actorID,
		modelPlanID,
		surveyID,
		markedCompleteBy,
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

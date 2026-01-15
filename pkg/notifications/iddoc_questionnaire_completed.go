package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityIDDOCQuestionnaireCompletedCreate creates an activity for when an IDDOC questionnaire is marked complete
func ActivityIDDOCQuestionnaireCompletedCreate(
	ctx context.Context,
	actorID uuid.UUID,
	np sqlutils.NamedPreparer,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlanID uuid.UUID,
	iddocQuestionnaireID uuid.UUID,
	markedCompletedBy uuid.UUID,
) (*models.Activity, error) {

	activity := models.NewIDDOCQuestionnaireCompletedActivity(
		actorID,
		modelPlanID,
		iddocQuestionnaireID,
		markedCompletedBy,
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

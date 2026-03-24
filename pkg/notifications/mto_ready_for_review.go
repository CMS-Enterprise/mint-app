package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityMTOReadyForReviewCreate creates an activity for when an MTO is marked ready for review
func ActivityMTOReadyForReviewCreate(
	ctx context.Context,
	actorID uuid.UUID,
	np sqlutils.NamedPreparer,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlanID uuid.UUID,
	mtoInfoID uuid.UUID,
	markedReadyForReview uuid.UUID,
) (*models.Activity, error) {

	activity := models.NewMTOReadyForReviewActivity(
		actorID,
		modelPlanID,
		mtoInfoID,
		markedReadyForReview,
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

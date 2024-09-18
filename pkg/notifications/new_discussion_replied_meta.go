package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityNewDiscussionRepliedCreate creates an activity for when a Discussion is replied to.
func ActivityNewDiscussionRepliedCreate(ctx context.Context, np sqlutils.NamedPreparer, actorID uuid.UUID, modelPlanID uuid.UUID, discussionID uuid.UUID, discussionCreatorID uuid.UUID, replyID uuid.UUID, discussionReplyContent models.TaggedHTML, userPreferences *models.UserNotificationPreferences) (*models.Activity, error) {

	activity := models.NewNewDiscussionRepliedActivity(actorID, modelPlanID, discussionID, replyID, discussionReplyContent.RawContent.String())

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	_, err := userNotificationCreate(ctx, np, retActivity, discussionCreatorID, userPreferences.NewDiscussionReply)
	if err != nil {
		return nil, err
	}

	return retActivity, nil
}

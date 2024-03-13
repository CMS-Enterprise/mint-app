package notifications

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// ActivityNewDiscussionRepliedCreate creates an activity for when a Discussion is replied to.
func ActivityNewDiscussionRepliedCreate(ctx context.Context, np sqlutils.NamedPreparer, actorID uuid.UUID, modelPlanID uuid.UUID, discussionID uuid.UUID, discussionCreatorID uuid.UUID, replyID uuid.UUID, discussionReplyContent models.TaggedHTML, getPreferencesFunc GetUserNotificationPreferencesFunc) (*models.Activity, error) {

	activity := models.NewNewDiscussionRepliedActivity(actorID, modelPlanID, discussionID, discussionCreatorID, replyID, discussionReplyContent.RawContent.String())

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	pref, err := getPreferencesFunc(ctx, actorID)
	if err != nil {
		return nil, fmt.Errorf("unable to get user notification preference, Notification not created %w", err)
	}

	_, err = userNotificationCreate(ctx, np, retActivity, discussionCreatorID, pref.NewDiscussionReply)
	if err != nil {
		return nil, err
	}

	return retActivity, nil
}

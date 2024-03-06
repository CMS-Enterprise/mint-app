package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// ActivityNewDiscussionRepliedCreate creates an activity for when a Discussion is replied to.
func ActivityNewDiscussionRepliedCreate(ctx context.Context, np sqlutils.NamedPreparer, actorID uuid.UUID, discussionID uuid.UUID, replyID uuid.UUID, discussionContent models.TaggedHTML, getPreferencesFunc GetUserNotificationPreferencesFunc) (*models.Activity, error) {

	activity := models.NewNewDiscussionRepliedActivity(actorID, discussionID, replyID, discussionContent.RawContent.String())

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	return retActivity, nil
}

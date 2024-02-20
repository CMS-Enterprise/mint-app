package notifications

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// ActivityTaggedInDiscussionReplyCreate creates an activity for when a User is Tagged in a Discussion Reply.
// It also creates all the relevant notifications for every tag. Currently, only tagged users get a notification
func ActivityTaggedInDiscussionReplyCreate(ctx context.Context, np sqlutils.NamedPreparer, actorID uuid.UUID, discussionID uuid.UUID, replyID uuid.UUID, replyContent models.TaggedHTML) (*models.Activity, error) {

	activity := models.NewTaggedInDiscussionReplyActivity(actorID, discussionID, replyID, replyContent.RawContent.String())

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}
	var errs []error
	// TODO: EASI-3925 make a decision about error handling here. We don't really want notifications to cause a transaction to rollback.
	for _, mention := range replyContent.UniqueMentions() { // Get only unique mentions so we don't send multiple emails if someone is tagged in the same content twice
		if mention.Entity == nil {
			err := fmt.Errorf("there is no entity in this mention. Unable to generate a notification")
			errs = append(errs, err)
			// if there isn't an entity, don't try to write a notification

			continue // non blocking
		}

		switch mention.Type {
		case models.TagTypeUserAccount:

			if mention.EntityUUID == nil {
				err := fmt.Errorf("this html mention entity UUID is nil. Unable to create a notification")
				errs = append(errs, err)
				continue

			}
			//TODO: EASI-3925 update dependencies so we can use the dataloader
			pref, err := storage.UserNotificationPreferencesGetByUserID(np, *mention.EntityUUID)
			if err != nil {
				errs = append(errs, fmt.Errorf("unable to get user notification preference, Notification not created %w", err))
			}

			_, err = userNotificationCreate(ctx, np, activity, *mention.EntityUUID, pref.TaggedInDiscussionReply)
			if err != nil {
				return nil, err
			}
		default:
			// we only care about user accounts
			continue

		}
	}
	if len(errs) > 0 {
		return nil, fmt.Errorf("error generating tagged in discussion reply notifications. First error: %v", errs[0])
	}

	return retActivity, nil

}

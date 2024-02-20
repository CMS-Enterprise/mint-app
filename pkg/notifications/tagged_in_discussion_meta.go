package notifications

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// ActivityTaggedInDiscussionCreate creates an activity for when a User is Tagged in a Discussion.
// It also creates all the relevant notifications for every tag. Currently, only tagged users get a notification
func ActivityTaggedInDiscussionCreate(ctx context.Context, np sqlutils.NamedPreparer, actorID uuid.UUID, discussionID uuid.UUID, discussionContent models.TaggedHTML) (*models.Activity, error) {

	activity := models.NewTaggedInPlanDiscussionActivity(actorID, discussionID, discussionContent.RawContent.String())

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}
	// Notice:  We will fail early if any part of this fails
	for _, mention := range discussionContent.UniqueMentions() { // Get only unique mentions so we don't send multiple emails if someone is tagged in the same content twice
		if mention.Entity == nil {
			err := fmt.Errorf("there is no entity in this mention. Unable to generate a notification")

			// if there isn't an entity, don't try to write a notification
			return nil, err
		}

		switch mention.Type {
		case models.TagTypeUserAccount:

			if mention.EntityUUID == nil {
				err := fmt.Errorf("this html mention entity UUID is nil. Unable to create a notification")
				return nil, err

			}
			//Future Enhancement: update dependencies so we can use the dataloader
			pref, err := storage.UserNotificationPreferencesGetByUserID(np, *mention.EntityUUID)
			if err != nil {
				return nil, fmt.Errorf("unable to get user notification preference, Notification not created %w", err)
			}

			_, err = userNotificationCreate(ctx, np, activity, *mention.EntityUUID, pref.TaggedInDiscussion)
			if err != nil {
				return nil, err
			}
		default:
			// we only care about user accounts
			continue

		}
	}

	return retActivity, nil

}

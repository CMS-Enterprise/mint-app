package notifications

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityTaggedInDiscussionCreate creates an activity for when a User is Tagged in a Discussion.
// It also creates all the relevant notifications for every tag. Currently, only tagged users get a notification
func ActivityTaggedInDiscussionCreate(ctx context.Context, np sqlutils.NamedPreparer, actorID uuid.UUID, modelPlanID uuid.UUID, discussionID uuid.UUID, discussionContent models.TaggedHTML, getPreferencesFunc GetUserNotificationPreferencesFunc) (*models.Activity, error) {

	activity := models.NewTaggedInPlanDiscussionActivity(actorID, modelPlanID, discussionID, discussionContent.RawContent.String())

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
			pref, err := getPreferencesFunc(ctx, *mention.EntityUUID)
			if err != nil {
				return nil, fmt.Errorf("unable to get user notification preference, Notification not created %w", err)
			}

			_, err = userNotificationCreate(ctx, np, retActivity, *mention.EntityUUID, pref.TaggedInDiscussion)
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

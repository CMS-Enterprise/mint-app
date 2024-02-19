package notifications

import (
	"context"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// TaggedInDiscussionReplyActivityMeta represents the notification data that is relevant to being tagged in a new Plan Discussion
type TaggedInDiscussionReplyActivityMeta struct {
	ActivityMetaBaseStruct
	DiscussionID uuid.UUID `json:"discussionID"` //TODO: EASI-2395 Note this is somewhat like a discussion relation, but in a different package
	ReplyID      uuid.UUID `json:"replyID"`      //TODO: EASI-2395 Note this is somewhat like a discussion relation, but in a different package
	Content      string    `json:"content"`
}

// newNewPlanDiscussionActivityMeta creates a New NewPlanDiscussionActivityMeta
func newTaggedInDiscussionReplyActivityMeta(discussionID uuid.UUID, replyID uuid.UUID, content string) *TaggedInDiscussionReplyActivityMeta {
	version := 0 //iterate this if this type ever updates
	return &TaggedInDiscussionReplyActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityTaggedInDiscussionReply, version),
		DiscussionID:           discussionID,
		ReplyID:                replyID,
		Content:                content,
	}

}

func newTaggedInDiscussionReplyActivity(actorID uuid.UUID, discussionID uuid.UUID, replyID uuid.UUID, content string) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     discussionID,
		ActivityType: ActivityTaggedInDiscussionReply,
		MetaData:     newTaggedInDiscussionReplyActivityMeta(discussionID, replyID, content),
	}
}

// ActivityTaggedInDiscussionReplyCreate creates an activity for when a User is Tagged in a Discussion Reply.
// It also creates all the relevant notifications for every tag. Currently, only tagged users get a notification
func ActivityTaggedInDiscussionReplyCreate(ctx context.Context, np sqlutils.NamedPreparer, actorID uuid.UUID, discussionID uuid.UUID, replyID uuid.UUID, replyContent models.TaggedHTML) (*Activity, error) {

	activity := newTaggedInDiscussionReplyActivity(actorID, discussionID, replyID, replyContent.RawContent.String())

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
		// entity := *mention.Entity

		switch mention.Type {
		case models.TagTypeUserAccount:

			if mention.EntityUUID == nil {
				err := fmt.Errorf("this html mention entity UUID is nil. Unable to create a notification")
				//TODO: EASI-3925 should we use a logger?
				errs = append(errs, err)
				continue

			}
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

// TODO EASI-3925 --> Refactor these all to have a generic scan / value

// Value allows us to satisfy the valuer interface so we can write to the database
// We need to do a specific implementation instead of relying on the implementation of the embedded struct, as that will only serialize the common data
func (d TaggedInDiscussionReplyActivityMeta) Value() (driver.Value, error) {

	j, err := json.Marshal(d)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *TaggedInDiscussionReplyActivityMeta) Scan(src interface{}) error {
	if src == nil {
		return nil
	}
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}
	err := json.Unmarshal(source, d)
	if err != nil {
		return err
	}

	return nil
}

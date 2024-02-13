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
)

// TaggedInPlanDiscussionActivityMeta represents the notification data that is relevant to being tagged in a new Plan Discussion
type TaggedInPlanDiscussionActivityMeta struct {
	ActivityMetaBaseStruct
	DiscussionID uuid.UUID `json:"discussionID" db:"discussion_id"` //TODO: EASI-2395 Note this is somewhat like a discussion relation, but in a different package
	Content      string
}

// newNewPlanDiscussionActivityMeta creates a New NewPlanDiscussionActivityMeta
func newTaggedInPlanDiscussionActivityMeta(discussionID uuid.UUID, content string) *TaggedInPlanDiscussionActivityMeta {
	version := 0 //iterate this if this type ever updates
	return &TaggedInPlanDiscussionActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityNewPlanDiscussion, version),
		DiscussionID:           discussionID,
		Content:                content,
	}

}

func newTaggedInPlanDiscussionActivity(actorID uuid.UUID, discussionID uuid.UUID, content string) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID), //TODO: EASI-3294 do we want to consider the actor is always the creator the activity?
		ActorID:      actorID,
		EntityID:     discussionID,
		ActivityType: ActivityTaggedInDiscussion,
		MetaData:     newTaggedInPlanDiscussionActivityMeta(discussionID, content),
	}
}

// ActivityTaggedUserInDiscussionCreate creates an activity for when a User is Tagged in a Discussion.
// It also creates all the relevant notifications for every tag. Currently, only tagged users get a notification
// TODO: EASI-3925 Update this so there is only one Activity, and all the notifications are created based on user tags
func ActivityTaggedUserInDiscussionCreate(ctx context.Context, np sqlutils.NamedPreparer, actorID uuid.UUID, discussionID uuid.UUID, discussionContent string, mention *models.HTMLMention) (*Activity, error) {
	if mention == nil {
		return nil, fmt.Errorf("mention is nil, unable to create a notification")
	}
	activity := newTaggedInPlanDiscussionActivity(actorID, discussionID, discussionContent)

	retActivity, err := activityCreate(ctx, np, activity)
	if err != nil {
		return nil, err
	}
	if mention.EntityUUID == nil {
		return nil, fmt.Errorf("this html mention entity UUID is nil. Unable to create a notification")

	}
	// Create a notification for the tagged user
	_, err = userNotificationCreate(ctx, np, activity, *mention.EntityUUID)
	if err != nil {
		return nil, err
	}

	return retActivity, nil

}

// TODO EASI-3925 --> Refactor these all to have a generic scan / value

// Value allows us to satisfy the valuer interface so we can write to the database
// We need to do a specific implementation instead of relying on the implementation of the embedded struct, as that will only serialize the common data
func (d TaggedInPlanDiscussionActivityMeta) Value() (driver.Value, error) {

	j, err := json.Marshal(d)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *TaggedInPlanDiscussionActivityMeta) Scan(src interface{}) error {
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

package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

// TaggedInDiscussionReplyActivityMeta represents the notification data that is relevant to being tagged in a new Plan Discussion
type TaggedInDiscussionReplyActivityMeta struct {
	ActivityMetaBaseStruct
	discussionRelation
	ReplyID uuid.UUID `json:"replyID"`
	Content string    `json:"content"`
}

// newNewPlanDiscussionActivityMeta creates a New NewPlanDiscussionActivityMeta
func newTaggedInDiscussionReplyActivityMeta(discussionID uuid.UUID, replyID uuid.UUID, content string) *TaggedInDiscussionReplyActivityMeta {
	version := 0 //iterate this if this type ever updates
	return &TaggedInDiscussionReplyActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityTaggedInDiscussionReply, version),
		discussionRelation:     NewDiscussionRelation(discussionID),
		ReplyID:                replyID,
		Content:                content,
	}

}

// NewTaggedInDiscussionReplyActivity creates a New Tagged in Plan Discussion Reply type of Activity
func NewTaggedInDiscussionReplyActivity(actorID uuid.UUID, discussionID uuid.UUID, replyID uuid.UUID, content string) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     discussionID,
		ActivityType: ActivityTaggedInDiscussionReply,
		MetaData:     newTaggedInDiscussionReplyActivityMeta(discussionID, replyID, content),
	}
}

// Future Enhancement: --> Refactor these all to have a generic scan / value

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

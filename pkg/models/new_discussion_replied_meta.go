package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

// NewDiscussionRepliedActivityMeta represents the notification data that is relevant to a new Discussion Reply
type NewDiscussionRepliedActivityMeta struct {
	ActivityMetaBaseStruct
	discussionRelation
	modelPlanRelation
	ReplyID uuid.UUID `json:"replyID"`
	Content string    `json:"content"`
}

// newNewDiscussionRepliedActivityMeta creates a New NewDiscussionRepliedActivityMeta
func newNewDiscussionRepliedActivityMeta(modelPlanID uuid.UUID, discussionID uuid.UUID, replyID uuid.UUID, content string) *NewDiscussionRepliedActivityMeta {
	version := 0 //iterate this if this type ever updates
	return &NewDiscussionRepliedActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityNewDiscussionReply, version),
		discussionRelation:     NewDiscussionRelation(discussionID),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
		ReplyID:                replyID,
		Content:                content,
	}

}

// NewNewDiscussionRepliedActivity creates a New New Discussion Replied type of Activity
func NewNewDiscussionRepliedActivity(actorID uuid.UUID, modelPlanID uuid.UUID, discussionID uuid.UUID, replyID uuid.UUID, content string) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     discussionID,
		ActivityType: ActivityNewDiscussionReply,
		MetaData:     newNewDiscussionRepliedActivityMeta(modelPlanID, discussionID, replyID, content),
	}
}

// Future Enhancement: --> Refactor these all to have a generic scan / value

// Value allows us to satisfy the valuer interface so we can write to the database
// We need to do a specific implementation instead of relying on the implementation of the embedded struct, as that will only serialize the common data
func (d NewDiscussionRepliedActivityMeta) Value() (driver.Value, error) {

	j, err := json.Marshal(d)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *NewDiscussionRepliedActivityMeta) Scan(src interface{}) error {
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

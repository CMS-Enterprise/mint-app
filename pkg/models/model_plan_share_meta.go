package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

// ModelPlanShareActivityMeta represents the notification data that is relevant to being tagged in a new Plan Discussion
type ModelPlanShareActivityMeta struct {
	ActivityMetaBaseStruct
	discussionRelation
	modelPlanRelation
	Content string `json:"content"`
}

// newModelPlanShareActivityMeta creates a New ModelPlanShareActivityMeta
func newModelPlanShareActivityMeta(modelPlanID uuid.UUID, discussionID uuid.UUID, content string) *TaggedInPlanDiscussionActivityMeta {
	version := 0 //iterate this if this type ever updates
	return &TaggedInPlanDiscussionActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityTaggedInDiscussion, version),
		discussionRelation:     NewDiscussionRelation(discussionID),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
		Content:                content,
	}

}

// NewTaggedInPlanDiscussionActivity creates a New Tagged in Plan Discussion type of Activity
func NewTaggedInPlanDiscussionActivity(actorID uuid.UUID, modelPlanID uuid.UUID, discussionID uuid.UUID, content string) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     discussionID,
		ActivityType: ActivityTaggedInDiscussion,
		MetaData:     newTaggedInPlanDiscussionActivityMeta(modelPlanID, discussionID, content),
	}
}

// Future Enhancement: --> Refactor these all to have a generic scan / value

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

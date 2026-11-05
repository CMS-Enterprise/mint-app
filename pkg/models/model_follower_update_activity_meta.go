package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// ModelFollowerUpdateActivityMeta represents the notification data for a message sent to everyone following a model plan.
type ModelFollowerUpdateActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
	// Content is the sanitized HTML of the message
	Content string `json:"content"`
}

func newModelFollowerUpdateActivityMeta(
	modelPlanID uuid.UUID,
	content string,
) *ModelFollowerUpdateActivityMeta {
	version := 0 // increment if this type ever updates
	return &ModelFollowerUpdateActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityModelFollowerUpdate, version),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
		Content:                content,
	}
}

// NewModelFollowerUpdateActivity creates a new ActivityModelFollowerUpdate type of Activity.
// The content is expected to be sanitized by the caller.
func NewModelFollowerUpdateActivity(
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	content string,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     modelPlanID,
		ActivityType: ActivityModelFollowerUpdate,
		MetaData:     newModelFollowerUpdateActivityMeta(modelPlanID, content),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database.
func (d ModelFollowerUpdateActivityMeta) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO.
func (d *ModelFollowerUpdateActivityMeta) Scan(src interface{}) error {
	return GenericScan(src, d)
}

// isActivityMetaData allows ModelFollowerUpdateActivityMeta to satisfy the ActivityMetaData interface.
func (ModelFollowerUpdateActivityMeta) isActivityMetaData() {}

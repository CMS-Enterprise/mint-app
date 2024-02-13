package notifications

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

// NewPlanDiscussionActivityMeta represents the notification data that is relevant to a New Plan Discussion activity
type NewPlanDiscussionActivityMeta struct {
	ActivityMetaBaseStruct
	DiscussionID uuid.UUID `json:"discussionID" db:"discussion_id"` //TODO: EASI-2394 Note this is somewhat like a discussion relation, but in a different pacakge
}

// GetDiscussionID returns DiscussionID. It implements the IDiscussionRelation interface
func (d NewPlanDiscussionActivityMeta) GetDiscussionID() uuid.UUID {
	return d.DiscussionID
}

// newNewPlanDiscussionActivityMeta creates a New NewPlanDiscussionActivityMeta
func newNewPlanDiscussionActivityMeta(discussionID uuid.UUID) *NewPlanDiscussionActivityMeta {
	version := 0 //iterate this if this type ever updates
	return &NewPlanDiscussionActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityNewPlanDiscussion, version),
		DiscussionID:           discussionID,
	}

}

// Value allows us to satisfy the valuer interface so we can write to the database
// We need to do a specific implementation instead of relying on the implementation of the embedded struct, as that will only serialize the common data
func (d NewPlanDiscussionActivityMeta) Value() (driver.Value, error) {

	j, err := json.Marshal(d)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *NewPlanDiscussionActivityMeta) Scan(src interface{}) error {
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

package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

// ModelPlanSharedActivityMeta represents the notification data that is relevant to sharing a model plan
type ModelPlanSharedActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
	OptionalMessage *string `json:"optionalMessage"`
}

// newModelPlanSharedActivityMeta creates a New ModelPlanSharedActivityMeta
func newModelPlanSharedActivityMeta(modelPlanID uuid.UUID, optionalMessage *string) *ModelPlanSharedActivityMeta {
	version := 0 //iterate this if this type ever updates
	return &ModelPlanSharedActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityModelPlanShared, version),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
		OptionalMessage:        optionalMessage,
	}

}

// NewModelPlanSharedActivityMeta creates a New Model Plan Shared type of Activity
func NewModelPlanSharedActivityMeta(actorID uuid.UUID, modelPlanID uuid.UUID, optionalMessage *string) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		ActivityType: ActivityModelPlanShared,
		MetaData:     newModelPlanSharedActivityMeta(modelPlanID, optionalMessage),
	}
}

// Future Enhancement: --> Refactor these all to have a generic scan / value

// Value allows us to satisfy the valuer interface so we can write to the database
// We need to do a specific implementation instead of relying on the implementation of the embedded struct, as that will only serialize the common data
func (d ModelPlanSharedActivityMeta) Value() (driver.Value, error) {

	j, err := json.Marshal(d)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *ModelPlanSharedActivityMeta) Scan(src interface{}) error {
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

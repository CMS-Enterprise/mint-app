package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

// AddedAsCollaboratorMeta represents the notification data that is relevant to being added as a collaborator
type AddedAsCollaboratorMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
}

// newNewPlanDiscussionActivityMeta creates a New NewPlanDiscussionActivityMeta
func newAddedAsCollaboratorMeta(modelPlanID uuid.UUID) *AddedAsCollaboratorMeta {
	version := 0 //iterate this if this type ever updates
	return &AddedAsCollaboratorMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityTaggedInDiscussion, version),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
	}

}

// NewAddedAsCollaboratorActivity creates a New Added as Collaborator type of Activity
func NewAddedAsCollaboratorActivity(actorID uuid.UUID, modelPlanID uuid.UUID, collaboratorID uuid.UUID) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     collaboratorID,
		ActivityType: ActivityAddedAsCollaborator,
		MetaData:     newAddedAsCollaboratorMeta(modelPlanID),
	}
}

// Future Enhancement: --> Refactor these all to have a generic scan / value

// Value allows us to satisfy the valuer interface so we can write to the database
// We need to do a specific implementation instead of relying on the implementation of the embedded struct, as that will only serialize the common data
func (d AddedAsCollaboratorMeta) Value() (driver.Value, error) {

	j, err := json.Marshal(d)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *AddedAsCollaboratorMeta) Scan(src interface{}) error {
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

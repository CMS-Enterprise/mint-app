package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

// NewModelPlanActivityMeta represents the notification data that is relevant to creating a new model plan
type NewModelPlanActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
}

// newNewModelPlanMeta creates a New NewModelPlanMeta
func newNewModelPlanMeta(modelPlanID uuid.UUID) *NewModelPlanActivityMeta {
	version := 0 //iterate this if this type ever updates
	return &NewModelPlanActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityNewModelPlan, version),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
	}

}

// NewNewModelPlanMetaActivity creates a New New Model Plan Meta type of Activity
func NewNewModelPlanMetaActivity(actorID uuid.UUID, modelPlanID uuid.UUID) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		ActivityType: ActivityNewModelPlan,
		MetaData:     newNewModelPlanMeta(modelPlanID),
	}
}

// Future Enhancement: --> Refactor these all to have a generic scan / value

// Value allows us to satisfy the valuer interface so we can write to the database
// We need to do a specific implementation instead of relying on the implementation of the embedded struct, as that will only serialize the common data
func (cm NewModelPlanActivityMeta) Value() (driver.Value, error) {

	j, err := json.Marshal(cm)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (cm *NewModelPlanActivityMeta) Scan(src interface{}) error {
	if src == nil {
		return nil
	}
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}
	err := json.Unmarshal(source, cm)
	if err != nil {
		return err
	}

	return nil
}

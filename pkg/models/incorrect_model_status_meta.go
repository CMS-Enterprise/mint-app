package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

// IncorrectModelStatusActivityMeta represents the notification data for an incorrect model status activity
type IncorrectModelStatusActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
	PhaseSuggestion PhaseSuggestion
	CurrentStatus   string
	ModelPlanName   string
}

// newIncorrectModelStatusActivityMeta creates a new IncorrectModelStatusActivityMeta
func newIncorrectModelStatusActivityMeta(
	modelPlanID uuid.UUID,
	CurrentStatus string,
	ModelPlanName string,
	phaseSuggestion *PhaseSuggestion,
) *IncorrectModelStatusActivityMeta {
	version := 0 // increment if this type ever updates
	return &IncorrectModelStatusActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityIncorrectModelStatus, version),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
		PhaseSuggestion:        *phaseSuggestion,
		CurrentStatus:          CurrentStatus,
		ModelPlanName:          ModelPlanName,
	}
}

// NewIncorrectModelStatusActivity creates a new ActivityIncorrectModelStatus type of Activity
func NewIncorrectModelStatusActivity(
	actorID uuid.UUID,
	modelPlan *ModelPlan,
	phaseSuggestion *PhaseSuggestion,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     modelPlan.GetModelPlanID(),
		ActivityType: ActivityIncorrectModelStatus,
		MetaData: newIncorrectModelStatusActivityMeta(
			modelPlan.GetModelPlanID(),
			string(modelPlan.Status),
			modelPlan.ModelName,
			phaseSuggestion,
		),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database
func (d IncorrectModelStatusActivityMeta) Value() (driver.Value, error) {
	return json.Marshal(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *IncorrectModelStatusActivityMeta) Scan(src interface{}) error {
	if src == nil {
		return nil
	}
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}
	return json.Unmarshal(source, d)
}

// isActivityMetaData allows IncorrectModelStatusActivityMeta to satisfy the ActivityMetaData interface
func (IncorrectModelStatusActivityMeta) isActivityMetaData() {}

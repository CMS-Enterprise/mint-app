package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// IDDOCQuestionnaireCompletedActivityMeta represents the notification data for an IDDOC questionnaire completed activity
type IDDOCQuestionnaireCompletedActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
	IDDOCQuestionnaireID uuid.UUID `json:"iddocQuestionnaireID"`
	CompletedBy          uuid.UUID `json:"completedBy"`
}

// newIDDOCQuestionnaireCompletedActivityMeta creates a new IDDOCQuestionnaireCompletedActivityMeta
func newIDDOCQuestionnaireCompletedActivityMeta(
	modelPlanID uuid.UUID,
	iddocQuestionnaireID uuid.UUID,
	completedBy uuid.UUID,
) *IDDOCQuestionnaireCompletedActivityMeta {
	version := 0 // increment if this type ever updates
	return &IDDOCQuestionnaireCompletedActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityIDDOCQuestionnaireCompleted, version),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
		IDDOCQuestionnaireID:   iddocQuestionnaireID,
		CompletedBy:            completedBy,
	}
}

// NewIDDOCQuestionnaireCompletedActivity creates a new ActivityIDDOCQuestionnaireCompleted type of Activity
func NewIDDOCQuestionnaireCompletedActivity(
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	iddocQuestionnaireID uuid.UUID,
	completedBy uuid.UUID,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     iddocQuestionnaireID,
		ActivityType: ActivityIDDOCQuestionnaireCompleted,
		MetaData: newIDDOCQuestionnaireCompletedActivityMeta(
			modelPlanID,
			iddocQuestionnaireID,
			completedBy,
		),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database
func (d IDDOCQuestionnaireCompletedActivityMeta) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *IDDOCQuestionnaireCompletedActivityMeta) Scan(src interface{}) error {
	return GenericScan(src, d)
}

// isActivityMetaData allows IDDOCQuestionnaireCompletedActivityMeta to satisfy the ActivityMetaData interface
func (IDDOCQuestionnaireCompletedActivityMeta) isActivityMetaData() {}

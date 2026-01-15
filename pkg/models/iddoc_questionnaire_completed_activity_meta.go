package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// IddocQuestionnaireCompletedActivityMeta represents the notification data for an IDDOC questionnaire completed activity
type IddocQuestionnaireCompletedActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
	IDDOCQuestionnaireID uuid.UUID `json:"iddocQuestionnaireID"`
	CompletedBy          uuid.UUID `json:"completedBy"`
}

// newIddocQuestionnaireCompletedActivityMeta creates a new IddocQuestionnaireCompletedActivityMeta
func newIddocQuestionnaireCompletedActivityMeta(
	modelPlanID uuid.UUID,
	iddocQuestionnaireID uuid.UUID,
	completedBy uuid.UUID,
) *IddocQuestionnaireCompletedActivityMeta {
	version := 0 // increment if this type ever updates
	return &IddocQuestionnaireCompletedActivityMeta{
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
		MetaData: newIddocQuestionnaireCompletedActivityMeta(
			modelPlanID,
			iddocQuestionnaireID,
			completedBy,
		),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database
func (d IddocQuestionnaireCompletedActivityMeta) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *IddocQuestionnaireCompletedActivityMeta) Scan(src interface{}) error {
	return GenericScan(src, d)
}

// isActivityMetaData allows IddocQuestionnaireCompletedActivityMeta to satisfy the ActivityMetaData interface
func (IddocQuestionnaireCompletedActivityMeta) isActivityMetaData() {}

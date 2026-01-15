package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// IDDOCQuestionnaireCompletedActivityMeta represents the notification data that
// is relevant to completing an IDDOC Questionnaire
type IDDOCQuestionnaireCompletedActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
	IDDOCQuestionnaireID uuid.UUID `json:"iddocQuestionnaireID"`
	MarkedCompleteBy     uuid.UUID `json:"markedCompleteBy"`
}

// newIDDOCQuestionnaireCompletedActivityMeta creates a new IDDOCQuestionnaireCompletedActivityMeta
func newIDDOCQuestionnaireCompletedActivityMeta(
	modelPlanID uuid.UUID,
	iddocQuestionnaireID uuid.UUID,
	markedCompleteBy uuid.UUID,
) *IDDOCQuestionnaireCompletedActivityMeta {
	version := 0 // iterate this if this type ever updates
	return &IDDOCQuestionnaireCompletedActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityIDDOCQuestionnaire, version),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
		IDDOCQuestionnaireID:   iddocQuestionnaireID,
		MarkedCompleteBy:       markedCompleteBy,
	}
}

// NewIDDOCQuestionnaireCompletedActivity creates a new ActivityIDDOCQuestionnaire type of Activity
func NewIDDOCQuestionnaireCompletedActivity(
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	iddocQuestionnaireID uuid.UUID,
	markedCompleteBy uuid.UUID,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     iddocQuestionnaireID,
		ActivityType: ActivityIDDOCQuestionnaire,
		MetaData: newIDDOCQuestionnaireCompletedActivityMeta(
			modelPlanID,
			iddocQuestionnaireID,
			markedCompleteBy,
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

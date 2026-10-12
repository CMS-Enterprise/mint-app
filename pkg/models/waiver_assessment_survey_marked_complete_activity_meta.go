package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// WaiverAssessmentSurveyMarkedCompleteActivityMeta represents the notification data for a waiver assessment survey marked complete activity
type WaiverAssessmentSurveyMarkedCompleteActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
	WaiverAssessmentSurveyID uuid.UUID `json:"waiverAssessmentSurveyID"`
	MarkedCompleteBy         uuid.UUID `json:"markedCompleteBy"`
}

func newWaiverAssessmentSurveyMarkedCompleteActivityMeta(
	modelPlanID uuid.UUID,
	surveyID uuid.UUID,
	markedCompleteBy uuid.UUID,
) *WaiverAssessmentSurveyMarkedCompleteActivityMeta {
	version := 0
	return &WaiverAssessmentSurveyMarkedCompleteActivityMeta{
		ActivityMetaBaseStruct:   NewActivityMetaBaseStruct(ActivityWaiverAssessmentSurveyMarkedComplete, version),
		modelPlanRelation:        NewModelPlanRelation(modelPlanID),
		WaiverAssessmentSurveyID: surveyID,
		MarkedCompleteBy:         markedCompleteBy,
	}
}

// NewWaiverAssessmentSurveyMarkedCompleteActivity creates a new ActivityWaiverAssessmentSurveyMarkedComplete type of Activity
func NewWaiverAssessmentSurveyMarkedCompleteActivity(
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	surveyID uuid.UUID,
	markedCompleteBy uuid.UUID,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     surveyID,
		ActivityType: ActivityWaiverAssessmentSurveyMarkedComplete,
		MetaData: newWaiverAssessmentSurveyMarkedCompleteActivityMeta(
			modelPlanID,
			surveyID,
			markedCompleteBy,
		),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database
func (d WaiverAssessmentSurveyMarkedCompleteActivityMeta) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *WaiverAssessmentSurveyMarkedCompleteActivityMeta) Scan(src interface{}) error {
	return GenericScan(src, d)
}

// isActivityMetaData allows WaiverAssessmentSurveyMarkedCompleteActivityMeta to satisfy the ActivityMetaData interface
func (WaiverAssessmentSurveyMarkedCompleteActivityMeta) isActivityMetaData() {}

package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// MTOReadyForReviewActivityMeta represents the notification data that
// is relevant to an MTO being marked ready for review
type MTOReadyForReviewActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
	MTOInfoID            uuid.UUID `json:"mtoInfoID"`
	MarkedReadyForReview uuid.UUID `json:"markedReadyForReview"`
}

// newMTOReadyForReviewActivityMeta creates a new MTOReadyForReviewActivityMeta
func newMTOReadyForReviewActivityMeta(
	modelPlanID uuid.UUID,
	mtoInfoID uuid.UUID,
	markedReadyForReview uuid.UUID,
) *MTOReadyForReviewActivityMeta {
	version := 0 // iterate this if this type ever updates
	return &MTOReadyForReviewActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityMTOReadyForReview, version),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
		MTOInfoID:              mtoInfoID,
		MarkedReadyForReview:   markedReadyForReview,
	}
}

// NewMTOReadyForReviewActivity creates a new ActivityMTOReadyForReview type of Activity
func NewMTOReadyForReviewActivity(
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	mtoInfoID uuid.UUID,
	markedReadyForReview uuid.UUID,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     mtoInfoID,
		ActivityType: ActivityMTOReadyForReview,
		MetaData: newMTOReadyForReviewActivityMeta(
			modelPlanID,
			mtoInfoID,
			markedReadyForReview,
		),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database
func (d MTOReadyForReviewActivityMeta) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *MTOReadyForReviewActivityMeta) Scan(src interface{}) error {
	return GenericScan(src, d)
}

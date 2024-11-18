package models

import (
	"time"

	"github.com/google/uuid"
)

type MTOInfo struct {
	baseStruct
	modelPlanRelation

	// Note a ready for review by relation could make sense here, and also be embedded for base task list section
	ReadyForReviewBy  *uuid.UUID `json:"readyForReviewBy" db:"ready_for_review_by"`
	ReadyForReviewDts *time.Time `json:"readyForReviewDts" db:"ready_for_review_dts"`
}

func NewMTOInfo(createdBy uuid.UUID, modelPlanID uuid.UUID) *MTOInfo {
	info := MTOInfo{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
	// id should be the same as model plan id
	info.ID = modelPlanID
	return &info
}

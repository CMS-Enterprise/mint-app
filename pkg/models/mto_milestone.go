package models

import (
	"time"

	"github.com/google/uuid"
)

type MTOMilestoneStatus string

const (
	MTMNotStarted MTOMilestoneStatus = "NOT_STARTED"
	MTMInProgress MTOMilestoneStatus = "IN_PROGRESS"
	MTMCompleted  MTOMilestoneStatus = "COMPLETED"
)

type MTOMilestone struct {
	baseStruct
	modelPlanRelation

	Name                 *string            `json:"name" db:"name"`
	MTOCommonMilestoneID *uuid.UUID         `json:"mtoCommonMilestoneID" db:"mto_common_milestone_id"`
	MTOCategoryID        *uuid.UUID         `json:"mtoCategoryID" db:"mto_category_id"`
	FacilitatedBy        *MTOFacilitator    `json:"facilitatedBy" db:"facilitated_by"`
	NeedBy               *time.Time         `json:"needBy" db:"need_by"`
	Status               MTOMilestoneStatus `json:"status" db:"status"`
	RiskIndicator        MTORiskIndicator   `json:"riskIndicator" db:"risk_indicator"`
	IsDraft              bool               `json:"isDraft" db:"is_draft"`

	/*TODO (mto) implement the rest of this based on GQL and database */
}

// NewMTOMilestone returns a new mtoMileMTOMilestone object. A Nil parentID means that this is a top level MileMTOMilestone, and not a subMileMTOMilestone
func NewMTOMilestone(createdBy uuid.UUID, name *string, commonMilestoneID *uuid.UUID, modelPlanID uuid.UUID, mtoCategoryID *uuid.UUID) *MTOMilestone {
	return &MTOMilestone{
		Name:                 name,
		baseStruct:           NewBaseStruct(createdBy),
		modelPlanRelation:    NewModelPlanRelation(modelPlanID),
		MTOCommonMilestoneID: commonMilestoneID,
		MTOCategoryID:        mtoCategoryID,
		IsDraft:              true,
		RiskIndicator:        MTORiskIndicatorOnTrack,
		Status:               MTMNotStarted,
	}
}

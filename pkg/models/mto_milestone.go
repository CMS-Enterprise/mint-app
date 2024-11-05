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

	Name *string                `json:"name" db:"name"` // From Common Milestone Table if linked
	Key  *MTOCommonMilestoneKey `json:"key" db:"key"`   // From Common Milestone Table, db field is for conversation to fk in DB

	MTOCommonMilestoneID *uuid.UUID         `json:"mtoCommonMilestoneID" db:"mto_common_milestone_id"` // TODO (mto) do we want / need this? We could just get by  key if needed
	MTOCategoryID        *uuid.UUID         `json:"mtoCategoryID" db:"mto_category_id"`
	FacilitatedBy        *MTOFacilitator    `json:"facilitatedBy" db:"facilitated_by"`
	NeedBy               *time.Time         `json:"needBy" db:"need_by"`
	Status               MTOMilestoneStatus `json:"status" db:"status"`
	RiskIndicator        MTORiskIndicator   `json:"riskIndicator" db:"risk_indicator"`
	IsDraft              bool               `json:"isDraft" db:"is_draft"`

	/*TODO (mto) implement the rest of this based on GQL and database */
}

// AddedFromMilestoneLibrary returns true or false if this was added from the common milestone library.
// It simply checks if the common  milestone id is populated or not
func (m *MTOMilestone) AddedFromMilestoneLibrary() bool {
	return m.MTOCommonMilestoneID != nil
}

// NewMTOMilestone returns a new mtoMileMTOMilestone object
func NewMTOMilestone(createdBy uuid.UUID, name *string, commonMilestoneKey *MTOCommonMilestoneKey, modelPlanID uuid.UUID, mtoCategoryID *uuid.UUID) *MTOMilestone {
	return &MTOMilestone{
		Name:              name,
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		Key:               commonMilestoneKey,
		MTOCategoryID:     mtoCategoryID,
		IsDraft:           true,
		RiskIndicator:     MTORiskIndicatorOnTrack,
		Status:            MTMNotStarted,
	}
}

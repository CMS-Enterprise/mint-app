package models

import (
	"github.com/google/uuid"
	"github.com/guregu/null"
	"time"
)

type PlanMilestones struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	EnterCMSClearance    *time.Time `json:"enterCMSClearance" db:"enter_cms_clearance"`
	EnterHMSOMBClearance *time.Time `json:"enterHHSOMBClearance" db:"enter_hhs_omb_clearance"`

	Cleared   *time.Time `json:"cleared" db:"cleared"`
	Announced *time.Time `json:"announced" db:"announced"`

	ApplicationsDue       *time.Time `json:"applicationsDue" db:"applications_due"`
	ParticipantsAnnounced *time.Time `json:"participantsAnnounced" db:"participants_announced"`

	PerformancePeriodStarts *time.Time `json:"performancePeriodStarts" db:"performance_period_starts"`
	PerformancePeriodEnds   *time.Time `json:"performancePeriodEnds" db:"performance_period_ends"`

	CreatedBy   null.String `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  null.String `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time  `json:"modifiedDts" db:"modified_dts"`
}

func (p PlanMilestones) GetModelTypeName() string {
	return p.GetModelTypeName()
}

func (p PlanMilestones) GetID() uuid.UUID {
	return p.ID
}

func (p PlanMilestones) GetPlanID() uuid.UUID {
	return p.ModelPlanID
}

func (p PlanMilestones) GetModifiedBy() null.String {
	return p.ModifiedBy
}

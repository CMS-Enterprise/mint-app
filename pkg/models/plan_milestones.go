package models

import (
	"time"

	"github.com/google/uuid"
)

// PlanMilestones represents the "plan milestones" section of a plan
type PlanMilestones struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	CompleteICIP    *time.Time `json:"completeICIP" db:"complete_icip"` //TODO do this
	ClearanceStarts *time.Time `json:"clearanceStarts" db:"clearance_starts"`
	ClearanceEnds   *time.Time `json:"clearanceEnds" db:"clearance_ends"`

	Announced *time.Time `json:"announced" db:"announced"`

	ApplicationsStart *time.Time `json:"applicationsStart" db:"applications_starts"`
	ApplicationsEnd   *time.Time `json:"applicationsEnd" db:"applications_ends"`

	PerformancePeriodStarts *time.Time `json:"performancePeriodStarts" db:"performance_period_starts"`
	PerformancePeriodEnds   *time.Time `json:"performancePeriodEnds" db:"performance_period_ends"`
	WrapUpEnds              *time.Time `json:"wrapUpEnds" db:"wrap_up_ends"`
	HighLevelNote           *string    `json:"highLevelNote" db:"high_level_note"`

	PhasedIn     *bool   `json:"phasedIn" db:"phased_in"` //default to false
	PhasedInNote *string `json:"phasedInNote" db:"phased_in_note"`

	CreatedBy   *string    `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`

	Status TaskStatus `json:"status" db:"status"`
}

// CalcStatus returns a TaskStatus based on how many fields have been entered in the PlanBasics struct
func (p *PlanMilestones) CalcStatus() {

	//TODO look into making a generic function that takes in any parent class object and calcs status
	//TODO update this for specific fields for now
	fieldCount := 5
	filledField := 0
	decidedStat := TaskReady

	// if p.ModelType != nil {
	// 	filledField++
	// }

	// if p.Problem != nil {
	// 	filledField++
	// }
	// if p.Goal != nil {
	// 	filledField++
	// }
	// if p.TestInventions != nil {
	// 	filledField++
	// }
	// if p.Note != nil {
	// 	filledField++
	// }

	if filledField == fieldCount {
		decidedStat = TaskComplete

	} else if filledField > 0 {
		decidedStat = TaskInProgress
	}
	p.Status = decidedStat
}

// GetModelTypeName returns a string name that represents the PlanMilestones struct
func (p PlanMilestones) GetModelTypeName() string {
	return "Plan_Milestones"
}

// GetID returns the GetID property for a PlanMilestones struct
func (p PlanMilestones) GetID() uuid.UUID {
	return p.ID
}

// GetPlanID returns the ModelPlanID property for a PlanMilestones struct
func (p PlanMilestones) GetPlanID() uuid.UUID {
	return p.ModelPlanID
}

// GetModifiedBy returns the ModifiedBy property for a PlanMilestones struct
func (p PlanMilestones) GetModifiedBy() *string {
	return p.ModifiedBy
}

package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// PlanBasics represents the "plan basics" section of a plan
type PlanBasics struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	ModelCategory *ModelCategory `json:"modelCategory" db:"model_category"`
	CMSCenters    pq.StringArray `json:"cmsCenters" db:"cms_centers"`
	CMSOther      *string        `json:"cmsOther" db:"cms_other"`
	CMMIGroups    pq.StringArray `json:"cmmiGroups" db:"cmmi_groups"`

	ModelType *ModelType `json:"modelType" db:"model_type" statusWeight:"1"`

	Problem           *string `json:"problem" db:"problem" statusWeight:"1"`
	Goal              *string `json:"goal" db:"goal" statusWeight:"1"`
	TestInterventions *string `json:"testInterventions" db:"test_interventions" statusWeight:"1"`
	Note              *string `json:"note" db:"note"`

	// PLAN MILESTONES
	CompleteICIP            *time.Time `json:"completeICIP" db:"complete_icip" statusWeight:"1"`
	ClearanceStarts         *time.Time `json:"clearanceStarts" db:"clearance_starts" statusWeight:"1"`
	ClearanceEnds           *time.Time `json:"clearanceEnds" db:"clearance_ends" statusWeight:"1"`
	Announced               *time.Time `json:"announced" db:"announced" statusWeight:"1"`
	ApplicationsStart       *time.Time `json:"applicationsStart" db:"applications_starts" statusWeight:"1"`
	ApplicationsEnd         *time.Time `json:"applicationsEnd" db:"applications_ends" statusWeight:"1"`
	PerformancePeriodStarts *time.Time `json:"performancePeriodStarts" db:"performance_period_starts" statusWeight:"1"`
	PerformancePeriodEnds   *time.Time `json:"performancePeriodEnds" db:"performance_period_ends" statusWeight:"1"`
	WrapUpEnds              *time.Time `json:"wrapUpEnds" db:"wrap_up_ends" statusWeight:"1"`
	HighLevelNote           *string    `json:"highLevelNote" db:"high_level_note"`
	PhasedIn                *bool      `json:"phasedIn" db:"phased_in" statusWeight:"1"` //default to false
	PhasedInNote            *string    `json:"phasedInNote" db:"phased_in_note"`

	CreatedBy   string     `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
	Status      TaskStatus `json:"status" db:"status"`
}

// CalcStatus calculates the status of the Plan Basics and sets the Status field
func (p *PlanBasics) CalcStatus() error {
	status, err := GenericallyCalculateStatus(*p)
	if err != nil {
		return err
	}

	p.Status = status
	return nil
}

// GetModelTypeName returns a string name that represents the PlanBasics struct
func (p PlanBasics) GetModelTypeName() string {
	return "Plan_Basics"
}

// GetID returns the ID property for a PlanBasics struct
func (p PlanBasics) GetID() uuid.UUID {
	return p.ID
}

// GetPlanID returns the ModelPlanID property for a PlanBasics struct
func (p PlanBasics) GetPlanID() uuid.UUID {
	return p.ModelPlanID
}

// GetModifiedBy returns the ModifiedBy property for a PlanBasics struct
func (p PlanBasics) GetModifiedBy() *string {
	return p.ModifiedBy
}

// GetCreatedBy implements the CreatedBy property
func (p PlanBasics) GetCreatedBy() string {
	return p.CreatedBy
}

// ModelType is an enum that represents the basic type of a model
type ModelType string

// These constants represent the different values of ModelType
const (
	MTVoluntary ModelType = "VOLUNTARY"
	MTMandatory ModelType = "MANDATORY"
	MTTBD       ModelType = "TBD"
)

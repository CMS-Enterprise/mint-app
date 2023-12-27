package models

import (
	"time"

	"github.com/lib/pq"
)

// PlanBasics represents the "plan basics" section of a plan
type PlanBasics struct {
	baseTaskListSection

	DemoCode   *string `json:"demoCode" db:"demo_code"`
	AmsModelID *string `json:"amsModelID" db:"ams_model_id"`

	ModelCategory             *ModelCategory `json:"modelCategory" db:"model_category"`
	AdditionalModelCategories pq.StringArray `json:"additionalModelCategories" db:"additional_model_categories"`
	CMSCenters                pq.StringArray `json:"cmsCenters" db:"cms_centers"`
	// CMSOther                  *string        `json:"cmsOther" db:"cms_other"`
	CMMIGroups pq.StringArray `json:"cmmiGroups" db:"cmmi_groups"`

	ModelType      pq.StringArray `json:"modelType" db:"model_type" statusWeight:"1"`
	ModelTypeOther *string        `json:"modelTypeOther" db:"model_type_other"`

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
}

// NewPlanBasics returns a new plan basics object
func NewPlanBasics(tls baseTaskListSection) *PlanBasics {
	return &PlanBasics{
		baseTaskListSection: tls,
	}
}

// ModelType is an enum that represents the basic type of a model
type ModelType string

// These constants represent the different values of ModelType
const (
	MTVoluntary                ModelType = "VOLUNTARY"
	MTMandatoryRegionalOrState ModelType = "MANDATORY_REGIONAL_OR_STATE"
	MTMandatoryNational        ModelType = "MANDATORY_NATIONAL"
	MTOther                    ModelType = "OTHER"
)

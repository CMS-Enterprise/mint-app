package models

import (
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

	PhasedIn     *bool   `json:"phasedIn" db:"phased_in" statusWeight:"1"` //default to false
	PhasedInNote *string `json:"phasedInNote" db:"phased_in_note"`
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

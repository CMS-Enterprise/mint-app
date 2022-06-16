package models

import (
	"time"

	"github.com/google/uuid"
)

// PlanBasics represents the "plan basics" section of a plan
type PlanBasics struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	ModelType *ModelType `json:"modelType" db:"model_type" statusWeight:"1"`

	Problem           *string `json:"problem" db:"problem" statusWeight:"1"`
	Goal              *string `json:"goal" db:"goal" statusWeight:"1"`
	TestInterventions *string `json:"testInterventions" db:"test_interventions" statusWeight:"1"`
	Note              *string `json:"note" db:"note"`

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

package models

import (
	"github.com/google/uuid"
)

// PlanBasics represents the "plan basics" section of a plan
type PlanBasics struct {
	BaseTaskListSection

	ModelType *ModelType `json:"modelType" db:"model_type" statusWeight:"1"`

	Problem           *string `json:"problem" db:"problem" statusWeight:"1"`
	Goal              *string `json:"goal" db:"goal" statusWeight:"1"`
	TestInterventions *string `json:"testInterventions" db:"test_interventions" statusWeight:"1"`
	Note              *string `json:"note" db:"note"`
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

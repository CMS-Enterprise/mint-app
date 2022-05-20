package models

import (
	"time"

	"github.com/google/uuid"
)

// PlanBasics represents the "plan basics" section of a plan
type PlanBasics struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	ModelType *ModelType `json:"modelType" db:"model_type"`

	Problem        *string `json:"problem" db:"problem"`
	Goal           *string `json:"goal" db:"goal"`
	TestInventions *string `json:"testInventions" db:"test_inventions"`
	Note           *string `json:"note" db:"note"`

	CreatedBy   *string    `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
	Status      TaskStatus `json:"status" db:"status"`
}

// CalcStatus returns a TaskStatus based on how many fields have been entered in the PlanBasics struct
func (p *PlanBasics) CalcStatus() {

	//TODO look into making a generic function that takes in any parent class object and calcs status
	fieldCount := 5
	filledField := 0
	decidedStat := TaskReady

	if p.ModelType != nil {
		filledField++
	}

	if p.Problem != nil {
		filledField++
	}
	if p.Goal != nil {
		filledField++
	}
	if p.TestInventions != nil {
		filledField++
	}
	if p.Note != nil {
		filledField++
	}

	if filledField == fieldCount {
		decidedStat = TaskComplete

	} else if filledField > 0 {
		decidedStat = TaskInProgress
	}
	p.Status = decidedStat
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
func (p PlanBasics) GetCreatedBy() *string {
	return p.CreatedBy
}

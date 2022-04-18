package models

import (
	"time"

	"github.com/google/uuid"
)

type PlanBasics struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	ModelType *ModelType `json:"modelType" db:"model_type"`

	Problem        *string `json:"problem" db:"problem"`
	Goal           *string `json:"goal" db:"goal"`
	TestInventions *string `json:"testInventions" db:"test_inventions"`
	Note           *string `json:"note" db:"note"`

	CreatedBy   *string     `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string     `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time  `json:"modifiedDts" db:"modified_dts"`
	Status      *TaskStatus `json:"status" db:"status"`
}

func (p PlanBasics) GetModelTypeName() string {
	return "Plan_Basics"
}

func (p PlanBasics) GetID() uuid.UUID {
	return p.ModelPlanID
}

func (p PlanBasics) GetPlanID() uuid.UUID {
	return p.ModelPlanID
}

func (p PlanBasics) GetModifiedBy() *string {
	return p.ModifiedBy
}

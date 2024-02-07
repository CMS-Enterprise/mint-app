package models

import (
	"time"

	"github.com/google/uuid"
)

// PlanCR represents CRs (Change Requests) related to a model plan
type PlanCR struct {
	BaseStruct
	modelPlanRelation
	IDNumber        string     `json:"idNumber" db:"id_number"`
	DateInitiated   *time.Time `json:"dateInitiated" db:"date_initiated"`
	DateImplemented *time.Time `json:"dateImplemented" db:"date_implemented"`
	Title           string     `json:"title" db:"title"`
	Note            *string    `json:"note" db:"note"`
}

// NewPlanCR returns a New PlanCR
func NewPlanCR(createdBy uuid.UUID, modelPlanID uuid.UUID) *PlanCR {
	return &PlanCR{
		BaseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}

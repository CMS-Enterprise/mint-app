package models

import (
	"time"

	"github.com/google/uuid"
)

// PlanCR represents CRs (Change Requests) related to a model plan
type PlanCR struct {
	baseStruct
	modelPlanRelation
	IDNumber        string     `json:"idNumber" db:"id_number"`
	DateInitiated   *time.Time `json:"dateInitiated" db:"date_initiated"`
	DateImplemented *time.Time `json:"dateImplemented" db:"date_implemented"`
	Title           string     `json:"title" db:"title"`
	Note            *string    `json:"note" db:"note"`
}

func (PlanCR) IsPlanCrTdl() {}

// NewPlanCR returns a New PlanCR
func NewPlanCR(createdBy uuid.UUID, modelPlanID uuid.UUID) *PlanCR {
	return &PlanCR{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}

// PlanTDL represents TDLs (Technical Direction Letters) related to a model plan
type PlanTDL struct {
	baseStruct
	modelPlanRelation
	IDNumber      string     `json:"idNumber" db:"id_number"`
	DateInitiated *time.Time `json:"dateInitiated" db:"date_initiated"`
	Title         string     `json:"title" db:"title"`
	Note          *string    `json:"note" db:"note"`
}

func (PlanTDL) IsPlanCrTdl() {}

// NewPlanTDL returns a New PlanTDL
func NewPlanTDL(createdBy uuid.UUID, modelPlanID uuid.UUID) *PlanTDL {
	return &PlanTDL{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}

type PlanCrTdl interface {
	IsPlanCrTdl()
}

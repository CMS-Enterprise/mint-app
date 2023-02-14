package models

import (
	"time"

	"github.com/google/uuid"
)

// PlanCrTdl represents CRs and TDLs related to a model plan
type PlanCrTdl struct {
	baseStructUserTable
	modelPlanRelation
	IDNumber      string     `json:"idNumber" db:"id_number"`
	DateInitiated *time.Time `json:"dateInitiated" db:"date_initiated"`
	Title         string     `json:"title" db:"title"`
	Note          *string    `json:"note" db:"note"`
}

// NewPlanCrTdl returns a New PlanCrTdl
func NewPlanCrTdl(createdBy uuid.UUID, modelPlanID uuid.UUID) *PlanCrTdl {
	return &PlanCrTdl{
		baseStructUserTable: NewBaseStructUser(createdBy),
		modelPlanRelation:   NewModelPlanRelation(modelPlanID),
	}
}

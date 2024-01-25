package models

import (
	"time"

	"github.com/google/uuid"
)

// PlanTDL represents TDLs (Technical Direction Letters) related to a model plan
type PlanTDL struct {
	baseStruct
	modelPlanRelation
	IDNumber      string     `json:"idNumber" db:"id_number"`
	DateInitiated *time.Time `json:"dateInitiated" db:"date_initiated"`
	Title         string     `json:"title" db:"title"`
	Note          *string    `json:"note" db:"note"`
}

// NewPlanTDL returns a New PlanTDL
func NewPlanTDL(createdBy uuid.UUID, modelPlanID uuid.UUID) *PlanTDL {
	return &PlanTDL{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}

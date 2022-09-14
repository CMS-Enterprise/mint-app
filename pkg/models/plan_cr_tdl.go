package models

import (
	"time"
)

// PlanCrTdl represents CRs and TDLs related to a model plan
type PlanCrTdl struct {
	BaseStruct
	ModelPlanRelation
	IDNumber      string     `json:"idNumber" db:"id_number"`
	DateInitiated *time.Time `json:"dateInitiated" db:"date_initiated"`
	Title         string     `json:"title" db:"title"`
	Note          string     `json:"note" db:"note"`
}

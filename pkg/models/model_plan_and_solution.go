package models

import (
	"github.com/google/uuid"
)

// ModelPlanAndPossibleOperationalSolution represents the combined data from the SQL query with unique field names.
// NOTE, this type is not meant to return all operational solutions for a model plan, but rather just the type (possible solution)
type ModelPlanAndPossibleOperationalSolution struct {
	PossibleOperationalSolutionID int                    `json:"possibleOperationalSolutionId" db:"possible_operational_solution_id"`
	Key                           OperationalSolutionKey `json:"key" db:"sol_key"`
	ModelPlanID                   uuid.UUID              `json:"modelPlanId" db:"model_plan_id"`
}

type ModelBySolutionStatus string

const (
	MbSSPlanned ModelBySolutionStatus = "PLANNED"
	MbSSActive  ModelBySolutionStatus = "ACTIVE"
	MbSSEnded   ModelBySolutionStatus = "ENDED"
	MbSSOther   ModelBySolutionStatus = "OTHER"
)

type ModelPlanAndMTOCommonSolution struct {
	ModelPlanID uuid.UUID            `json:"modelPlanId" db:"model_plan_id"`
	Key         MTOCommonSolutionKey `json:"key" db:"mto_common_solution_key"`
}

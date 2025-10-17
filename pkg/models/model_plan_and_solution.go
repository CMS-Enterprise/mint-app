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

type GeneralStatus string

const (
	MbSSPlanned GeneralStatus = "PLANNED"
	MbSSActive  GeneralStatus = "ACTIVE"
	MbSSEnded   GeneralStatus = "ENDED"
	MbSSOther   GeneralStatus = "OTHER"
)

type ModelPlanAndMTOCommonSolution struct {
	ModelPlanID uuid.UUID            `json:"modelPlanId" db:"model_plan_id"`
	ModelName   string               `json:"modelName" db:"model_name"`
	ModelStatus ModelStatus          `json:"modelStatus" db:"model_status"`
	ModelID     *string              `json:"modelId" db:"model_id"`
	Key         MTOCommonSolutionKey `json:"key" db:"mto_common_solution_key"`
}

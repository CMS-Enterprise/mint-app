package models

import "github.com/google/uuid"

type MTOCommonSolution struct {
	Name        string               `json:"name" db:"name"`
	Key         MTOCommonSolutionKey `json:"key" db:"key"`
	Description string               `json:"description" db:"description"`
	Role        MTOFacilitator       `json:"role" db:"role"`
	ModelPlanID *uuid.UUID           `json:"modelPlanID" db:"model_plan_id"` //TODO (mto) verify this, this would facilitate queries and is_added. This is not an actual database column
}

type MTOCommonSolutionKey string

const (
	MTOCommonSolutionKeySolutionA MTOCommonSolutionKey = "SOLUTION_A"
	MTOCommonSolutionKeySolutionB MTOCommonSolutionKey = "SOLUTION_B"
)

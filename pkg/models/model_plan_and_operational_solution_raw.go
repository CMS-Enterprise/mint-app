package models

import (
	"github.com/google/uuid"
)

// ModelPlanAndOperationalSolution represents the combined data from the SQL query with unique field names
type ModelPlanAndOperationalSolution struct {
	OperationalSolutionID uuid.UUID `json:"operationalSolutionId" db:"operational_solution_id"`
	ModelPlanID           uuid.UUID `json:"modelPlanId" db:"model_plan_id"`
}

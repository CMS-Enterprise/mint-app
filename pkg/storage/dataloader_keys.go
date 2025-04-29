package storage

import (
	"github.com/google/uuid"
)

// SolutionAndPossibleKey is a key to get a operational solution and possible operational solution
type SolutionAndPossibleKey struct {
	// OperationalNeedID is the ID of the need that a solution is associated with
	OperationalNeedID uuid.UUID `json:"operational_need_id"`
	// IncludeNotNeeded specifies if the query should return solutions with a status of not needed, or if possible solutions (not discrete records) should be included
	IncludeNotNeeded bool `json:"include_not_needed"`
}

// MostRecentByModelPlanIDAndTableFilters is a key to get the most recent record by model plan ID and table filters
type MostRecentByModelPlanIDAndTableFilters struct {
	// ModelPlanID is the ID of the model plan
	ModelPlanID uuid.UUID `json:"model_plan_id"`

	// IsAdmin specifies if the user is an admin
	// this controls if sensitive data is shown, admins can see everything as well as collaborators.
	IsAdmin bool `json:"is_admin"`

	// TableFilters is the list of tableNames that are used to find a result.
	// It really uses  models.TableName as the type, but must be comparable to work with a dataloader
	// We make a compromise here to fit the dataloader interface
	TableNames string `json:"table_names"`
}

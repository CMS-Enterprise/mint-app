package storage

import "github.com/google/uuid"

// SolutionAndPossibleKey is a key to get a operational solution and possible operational solution
type SolutionAndPossibleKey struct {
	// OperationalNeedID is the ID of the need that a solution is associated with
	OperationalNeedID uuid.UUID `json:"operational_need_id"`
	// IncludeNotNeeded specifies if the query should return solutions with a status of not needed, or if possible solutions (not discrete records) should be included
	IncludeNotNeeded bool `json:"include_not_needed"`
}

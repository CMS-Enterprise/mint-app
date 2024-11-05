package models

type MTOCommonSolution struct {
	Name        string               `json:"name" db:"name"`
	Key         MTOCommonSolutionKey `json:"key" db:"key"`
	Description string               `json:"description" db:"description"`
	Role        MTOFacilitator       `json:"role" db:"role"`
}

type MTOCommonSolutionKey string

const (
	MTOCommonSolutionKeySolutionA MTOCommonSolutionKey = "SOLUTION_A"
	MTOCommonSolutionKeySolutionB MTOCommonSolutionKey = "SOLUTION_B"
)

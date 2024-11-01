package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_solution/get_by_id.sql
var mtoCommonSolutionGetByIDSQL string

type mtoCommonSolutionScripts struct {
	GetByID string
}

// MTOCommonSolution contains all the SQL queries for the MTO common solution
var MTOCommonSolution = mtoCommonSolutionScripts{
	GetByID: mtoCommonMilestoneGetByIDSQL,
}

package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_milestone_solution_link/get_common_solutions_by_milestone.sql
var mtoCommonLinkGetCommonSolutionsByMilestoneSQL string

type mtoCommonLinkScripts struct {
	GetCommonSolutionsByMilestone string
}

// MTOCommonLink contains all the SQL queries for the MTO common milestone solution link
var MTOCommonLink = mtoCommonLinkScripts{
	GetCommonSolutionsByMilestone: mtoCommonLinkGetCommonSolutionsByMilestoneSQL,
}

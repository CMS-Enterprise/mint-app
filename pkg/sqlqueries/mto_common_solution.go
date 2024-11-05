package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_solution/get_by_key.sql
var mtoCommonSolutionGetByKeySQL string

type mtoCommonSolutionScripts struct {
	GetByKey string
}

// MTOCommonSolution contains all the SQL queries for the MTO common solution
var MTOCommonSolution = mtoCommonSolutionScripts{
	GetByKey: mtoCommonSolutionGetByKeySQL,
}

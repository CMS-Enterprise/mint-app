package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_solution_model_usage/get_by_common_solution_key.sql
var MTOCommonSolutionModelUsageGetByCommonSolutionKey string

type MTOCommonSolutionModelUsageScripts struct {
	GetByCommonSolutionKey string
}

// MTOCommonSolutionModelUsage houses all the sql for getting data for common solution model usage from the database
var MTOCommonSolutionModelUsage = MTOCommonSolutionModelUsageScripts{
	GetByCommonSolutionKey: MTOCommonSolutionModelUsageGetByCommonSolutionKey,
}

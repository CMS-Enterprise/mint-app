package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_solution/get_by_key_LOADER.sql
var mtoCommonSolutionGetByKeyLoaderSQL string

//go:embed SQL/mto/common_solution/get_by_milestone_key_LOADER.sql
var mtoCommonSolutionGetByMilestoneKeyLoaderSQL string

//go:embed SQL/mto/common_solution/get_by_model_plan_id_LOADER.sql
var mtoCommonSolutionGetByModelPlanIDLoaderSQL string

type mtoCommonSolutionScripts struct {
	GetByKeyLoader                string
	GetByCommonMilestoneKeyLoader string
	GetByModelPlanIDLoader        string
}

// MTOCommonSolution contains all the SQL queries for the MTO common solution
var MTOCommonSolution = mtoCommonSolutionScripts{
	GetByKeyLoader:                mtoCommonSolutionGetByKeyLoaderSQL,
	GetByCommonMilestoneKeyLoader: mtoCommonSolutionGetByMilestoneKeyLoaderSQL,
	GetByModelPlanIDLoader:        mtoCommonSolutionGetByModelPlanIDLoaderSQL,
}

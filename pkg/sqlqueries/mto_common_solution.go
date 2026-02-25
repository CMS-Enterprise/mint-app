package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_solution/get_by_key_LOADER.sql
var mtoCommonSolutionGetByKeyLoaderSQL string

//go:embed SQL/mto/common_solution/get_by_milestone_id_LOADER.sql
var mtoCommonSolutionGetByMilestoneIDLoaderSQL string

//go:embed SQL/mto/common_solution/get_by_model_plan_id_LOADER.sql
var mtoCommonSolutionGetByModelPlanIDLoaderSQL string

//go:embed SQL/mto/common_solution/get_by_id_LOADER.sql
var mtoCommonSolutionGetByIDLoaderSQL string

type mtoCommonSolutionScripts struct {
	GetByKeyLoader               string
	GetByCommonMilestoneIDLoader string
	GetByModelPlanIDLoader       string
	GetByIDLoader                string
}

// MTOCommonSolution contains all the SQL queries for the MTO common solution
var MTOCommonSolution = mtoCommonSolutionScripts{
	GetByKeyLoader:               mtoCommonSolutionGetByKeyLoaderSQL,
	GetByCommonMilestoneIDLoader: mtoCommonSolutionGetByMilestoneIDLoaderSQL,
	GetByModelPlanIDLoader:       mtoCommonSolutionGetByModelPlanIDLoaderSQL,
	GetByIDLoader:                mtoCommonSolutionGetByIDLoaderSQL,
}

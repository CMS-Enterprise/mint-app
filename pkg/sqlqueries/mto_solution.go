package sqlqueries

import _ "embed"

//go:embed SQL/mto/solution/create.sql
var mtoSolutionCreateSQL string

//go:embed SQL/mto/solution/update.sql
var mtoSolutionUpdateSQL string

//go:embed SQL/mto/solution/get_by_id_LOADER.sql
var mtoSolutionGetByIDLoaderSQL string

//go:embed SQL/mto/solution/get_by_model_plan_id_LOADER.sql
var mtoSolutionGetByModelPlanIDLoaderSQL string

type mtoSolutionScripts struct {
	Create                 string
	Update                 string
	GetByIDLoader          string
	GetByModelPlanIDLoader string
}

var MTOSolution = mtoSolutionScripts{
	Create:                 mtoSolutionCreateSQL,
	Update:                 mtoSolutionUpdateSQL,
	GetByIDLoader:          mtoSolutionGetByIDLoaderSQL,
	GetByModelPlanIDLoader: mtoSolutionGetByModelPlanIDLoaderSQL,
}

package sqlqueries

import _ "embed"

//go:embed SQL/mto/solution/create.sql
var mtoSolutionCreateSQL string

//go:embed SQL/mto/solution/create_allow_conflicts.sql
var mtoSolutionCreateAllowConflictsSQL string

//go:embed SQL/mto/solution/update.sql
var mtoSolutionUpdateSQL string

//go:embed SQL/mto/solution/get_by_id_LOADER.sql
var mtoSolutionGetByIDLoaderSQL string

//go:embed SQL/mto/solution/get_by_model_plan_id_LOADER.sql
var mtoSolutionGetByModelPlanIDLoaderSQL string

//go:embed SQL/mto/solution/get_by_milestone_id_LOADER.sql
var mtoSolutionGetByMilestoneIDLoaderSQL string

type mtoSolutionScripts struct {
	Create                 string
	CreateAllowConflicts   string
	Update                 string
	GetByIDLoader          string
	GetByModelPlanIDLoader string
	GetByMilestoneIDLoader string
}

var MTOSolution = mtoSolutionScripts{
	Create:                 mtoSolutionCreateSQL,
	CreateAllowConflicts:   mtoSolutionCreateAllowConflictsSQL,
	Update:                 mtoSolutionUpdateSQL,
	GetByIDLoader:          mtoSolutionGetByIDLoaderSQL,
	GetByModelPlanIDLoader: mtoSolutionGetByModelPlanIDLoaderSQL,
	GetByMilestoneIDLoader: mtoSolutionGetByMilestoneIDLoaderSQL,
}

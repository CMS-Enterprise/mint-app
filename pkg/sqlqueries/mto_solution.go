package sqlqueries

import _ "embed"

//go:embed SQL/mto/solution/create.sql
var mtoSolutionCreateSQL string

//go:embed SQL/mto/solution/create_allow_conflicts.sql
var mtoSolutionCreateAllowConflictsSQL string

//go:embed SQL/mto/solution/create_common_solutions_allow_conflicts.sql
var mtoSolutionCreateCommonSolutionsAllowConflictsSQL string

//go:embed SQL/mto/solution/update.sql
var mtoSolutionUpdateSQL string

//go:embed SQL/mto/solution/delete.sql
var mtoSolutionDeleteSQL string

//go:embed SQL/mto/solution/get_by_id_LOADER.sql
var mtoSolutionGetByIDLoaderSQL string

//go:embed SQL/mto/solution/get_by_model_plan_id_LOADER.sql
var mtoSolutionGetByModelPlanIDLoaderSQL string

//go:embed SQL/mto/solution/get_by_model_plan_id_and_filter_view_LOADER.sql
var mtoSolutionGetByModelPlanIDAndFilterViewLoaderSQL string

//go:embed SQL/mto/solution/get_by_milestone_id_LOADER.sql
var mtoSolutionGetByMilestoneIDLoaderSQL string

type mtoSolutionScripts struct {
	Create                              string
	CreateAllowConflicts                string
	CreateCommonSolutionsAllowConflicts string
	Update                              string
	Delete                              string
	GetByIDLoader                       string
	GetByModelPlanIDLoader              string
	GetByModelPlanIDAndFilterViewLoader string
	GetByMilestoneIDLoader              string
}

var MTOSolution = mtoSolutionScripts{
	Create:                              mtoSolutionCreateSQL,
	CreateAllowConflicts:                mtoSolutionCreateAllowConflictsSQL,
	CreateCommonSolutionsAllowConflicts: mtoSolutionCreateCommonSolutionsAllowConflictsSQL,
	Update:                              mtoSolutionUpdateSQL,
	Delete:                              mtoSolutionDeleteSQL,
	GetByIDLoader:                       mtoSolutionGetByIDLoaderSQL,
	GetByModelPlanIDLoader:              mtoSolutionGetByModelPlanIDLoaderSQL,
	GetByModelPlanIDAndFilterViewLoader: mtoSolutionGetByModelPlanIDAndFilterViewLoaderSQL,
	GetByMilestoneIDLoader:              mtoSolutionGetByMilestoneIDLoaderSQL,
}

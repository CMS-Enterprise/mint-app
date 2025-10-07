package sqlqueries

import _ "embed"

//go:embed SQL/mto/milestone/create.sql
var mtoMilestoneCreateSQL string

//go:embed SQL/mto/milestone/update.sql
var mtoMilestoneUpdateSQL string

//go:embed SQL/mto/milestone/delete.sql
var mtoMilestoneDeleteSQL string

//go:embed SQL/mto/milestone/delete_assigned_to.sql
var mtoMilestoneDeleteAssignedToSQL string

//go:embed SQL/mto/milestone/get_by_id.sql
var mtoMilestoneGetByIDSQL string

//go:embed SQL/mto/milestone/get_by_id_loader.sql
var mtoMilestoneGetByIDLoaderSQL string

//go:embed SQL/mto/milestone/get_by_model_plan_id_LOADER.sql
var mtoMilestoneGetByModelPlanIDLoaderSQL string

//go:embed SQL/mto/milestone/get_by_model_plan_id_and_category_id_LOADER.sql
var mtoMilestoneGetByModelPlanIDAndCategoryIDLoaderSQL string

//go:embed SQL/mto/milestone/get_by_solution_id_LOADER.sql
var mtoMilestoneGetBySolutionIDLoaderSQL string

//go:embed SQL/mto/milestone/get_by_model_plan_id_no_linked_solution_LOADER.sql
var mtoMilestoneGetByModelPlanIDNoLinkedSolutionLoaderSQL string

type mtoMilestoneScripts struct {
	Create           string
	Update           string
	Delete           string
	DeleteAssignedTo string
	GetByID          string
	GetByIDLoader    string
	// returns all Milestones by a model plan ID
	GetByModelPlanIDLoader string
	// returns all Milestones by a model plan and category
	GetByModelPlanIDAndCategoryIDLoader string
	// returns all Milestones by a solution ID
	GetBySolutionIDLoader string
	// returns all Milestones by a model plan ID that are not linked to a solution
	GetByModelPlanIDNoLinkedSolutionLoader string
}

var MTOMilestone = mtoMilestoneScripts{
	Create:                                 mtoMilestoneCreateSQL,
	Update:                                 mtoMilestoneUpdateSQL,
	Delete:                                 mtoMilestoneDeleteSQL,
	DeleteAssignedTo:                       mtoMilestoneDeleteAssignedToSQL,
	GetByID:                                mtoMilestoneGetByIDSQL,
	GetByIDLoader:                          mtoMilestoneGetByIDLoaderSQL,
	GetByModelPlanIDLoader:                 mtoMilestoneGetByModelPlanIDLoaderSQL,
	GetByModelPlanIDAndCategoryIDLoader:    mtoMilestoneGetByModelPlanIDAndCategoryIDLoaderSQL,
	GetBySolutionIDLoader:                  mtoMilestoneGetBySolutionIDLoaderSQL,
	GetByModelPlanIDNoLinkedSolutionLoader: mtoMilestoneGetByModelPlanIDNoLinkedSolutionLoaderSQL,
}

package sqlqueries

import _ "embed"

//go:embed SQL/mto/milestone/create.sql
var mtoMilestoneCreateSQL string

//go:embed SQL/mto/milestone/update.sql
var mtoMilestoneUpdateSQL string

//go:embed SQL/mto/milestone/get_by_id.sql
var mtoMilestoneGetByIDSQL string

//go:embed SQL/mto/milestone/get_by_model_plan_id_LOADER.sql
var mtoMilestoneGetByModelPlanIDLoaderSQL string

//go:embed SQL/mto/milestone/get_by_model_plan_id_and_category_id_LOADER.sql
var mtoMilestoneGetByModelPlanIDAndCategoryIDLoaderSQL string

//go:embed SQL/mto/milestone/create_milestone_solution_link.sql
var mtoMilestoneCreateMilestoneSolutionLinkSQL string

type mtoMilestoneScripts struct {
	Create  string
	Update  string
	GetByID string
	// returns all Milestones by a model plan ID
	GetByModelPlanIDLoader string
	// returns all Milestones by a model plan and category
	GetByModelPlanIDAndCategoryIDLoader string
	// creates a link between a milestone and a solution and returns the link ID
	CreateMilestoneSolutionLink string
}

var MTOMilestone = mtoMilestoneScripts{
	Create:                              mtoMilestoneCreateSQL,
	Update:                              mtoMilestoneUpdateSQL,
	GetByID:                             mtoMilestoneGetByIDSQL,
	GetByModelPlanIDLoader:              mtoMilestoneGetByModelPlanIDLoaderSQL,
	GetByModelPlanIDAndCategoryIDLoader: mtoMilestoneGetByModelPlanIDAndCategoryIDLoaderSQL,
	CreateMilestoneSolutionLink:         mtoMilestoneCreateMilestoneSolutionLinkSQL,
}

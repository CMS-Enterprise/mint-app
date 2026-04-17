package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_milestone/get_by_model_plan_id_LOADER.sql
var mtoCommonMilestoneGetByModelPlanIDLoaderSQL string

//go:embed SQL/mto/common_milestone/get_by_id_LOADER.sql
var mtoCommonMilestoneGetByIDLoaderSQL string

//go:embed SQL/mto/common_milestone/create.sql
var mtoCommonMilestoneCreateSQL string

//go:embed SQL/mto/common_milestone/create_solution_links.sql
var mtoCommonMilestoneCreateSolutionLinksSQL string

//go:embed SQL/mto/common_milestone/archive.sql
var mtoCommonMilestoneArchiveSQL string

//go:embed SQL/mto/common_milestone/delete_template_milestones.sql
var mtoCommonMilestoneDeleteTemplateMilestonesSQL string

//go:embed SQL/mto/common_milestone/delete_solution_links.sql
var mtoCommonMilestoneDeleteSolutionLinksSQL string

//go:embed SQL/mto/common_milestone/get_common_categories.sql
var mtoCommonMilestoneGetCommonCategoriesSQL string

type mtoCommonMilestoneScripts struct {
	GetByModelPlanIDLoader   string
	GetByIDLoader            string
	Create                   string
	CreateSolutionLinks      string
	Archive                  string
	DeleteTemplateMilestones string
	DeleteSolutionLinks      string
	GetCommonCategories      string
}

// MTOCommonMilestone contains all the SQL queries for the MTO common milestone
var MTOCommonMilestone = mtoCommonMilestoneScripts{
	GetByModelPlanIDLoader:   mtoCommonMilestoneGetByModelPlanIDLoaderSQL,
	GetByIDLoader:            mtoCommonMilestoneGetByIDLoaderSQL,
	Create:                   mtoCommonMilestoneCreateSQL,
	CreateSolutionLinks:      mtoCommonMilestoneCreateSolutionLinksSQL,
	Archive:                  mtoCommonMilestoneArchiveSQL,
	DeleteTemplateMilestones: mtoCommonMilestoneDeleteTemplateMilestonesSQL,
	DeleteSolutionLinks:      mtoCommonMilestoneDeleteSolutionLinksSQL,
	GetCommonCategories:      mtoCommonMilestoneGetCommonCategoriesSQL,
}

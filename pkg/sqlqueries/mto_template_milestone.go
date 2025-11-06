package sqlqueries

import _ "embed"

//go:embed SQL/mto/template/milestone/get_by_id_LOADER.sql
var mtoTemplateMilestoneGetByIDLoaderSQL string

//go:embed SQL/mto/template/milestone/get_by_template_id_LOADER.sql
var mtoTemplateMilestoneGetByTemplateIDLoaderSQL string

//go:embed SQL/mto/template/milestone/get_by_category_id_LOADER.sql
var mtoTemplateMilestoneGetByCategoryIDLoaderSQL string

//go:embed SQL/mto/template/milestone/get_by_solution_id_LOADER.sql
var mtoTemplateMilestoneGetBySolutionIDLoaderSQL string

type mtoTemplateMilestoneScripts struct {
	GetByIDLoader         string
	GetByTemplateIDLoader string
	GetByCategoryIDLoader string
	GetBySolutionIDLoader string
}

var MTOTemplateMilestone = mtoTemplateMilestoneScripts{
	GetByIDLoader:         mtoTemplateMilestoneGetByIDLoaderSQL,
	GetByTemplateIDLoader: mtoTemplateMilestoneGetByTemplateIDLoaderSQL,
	GetByCategoryIDLoader: mtoTemplateMilestoneGetByCategoryIDLoaderSQL,
	GetBySolutionIDLoader: mtoTemplateMilestoneGetBySolutionIDLoaderSQL,
}

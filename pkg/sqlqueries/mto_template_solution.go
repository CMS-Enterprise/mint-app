package sqlqueries

import _ "embed"

//go:embed SQL/mto/template/solution/get_by_id_LOADER.sql
var mtoTemplateSolutionGetByIDLoaderSQL string

//go:embed SQL/mto/template/solution/get_by_template_id_LOADER.sql
var mtoTemplateSolutionGetByTemplateIDLoaderSQL string

//go:embed SQL/mto/template/solution/get_by_milestone_id_LOADER.sql
var mtoTemplateSolutionGetByMilestoneIDLoaderSQL string

type mtoTemplateSolutionScripts struct {
	GetByIDLoader          string
	GetByTemplateIDLoader  string
	GetByMilestoneIDLoader string
}

var MTOTemplateSolution = mtoTemplateSolutionScripts{
	GetByIDLoader:          mtoTemplateSolutionGetByIDLoaderSQL,
	GetByTemplateIDLoader:  mtoTemplateSolutionGetByTemplateIDLoaderSQL,
	GetByMilestoneIDLoader: mtoTemplateSolutionGetByMilestoneIDLoaderSQL,
}

package sqlqueries

import _ "embed"

//go:embed SQL/mto/template/milestone_solution_link/get_by_template_id_LOADER.sql
var mtoTemplateMilestoneSolutionLinkGetByTemplateIDLoader string

type mtoTemplateMilestoneSolutionLinkScripts struct {
	GetByTemplateIDLoader string
}

// MTOTemplateMilestoneSolutionLink houses all the sql for getting milestone-solution links from the database
var MTOTemplateMilestoneSolutionLink = mtoTemplateMilestoneSolutionLinkScripts{
	GetByTemplateIDLoader: mtoTemplateMilestoneSolutionLinkGetByTemplateIDLoader,
}

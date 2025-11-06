package sqlqueries

import _ "embed"

//go:embed SQL/mto/template/milestone_solution_link/get_by_template_id_LOADER.sql
var MTOTemplateMilestoneSolutionLinkGetByTemplateIDLoader string

type MTOTemplateMilestoneSolutionLinkScripts struct {
	GetByTemplateIDLoader string
}

// MTOTemplateMilestoneSolutionLink houses all the sql for getting milestone-solution links from the database
var MTOTemplateMilestoneSolutionLink = MTOTemplateMilestoneSolutionLinkScripts{
	GetByTemplateIDLoader: MTOTemplateMilestoneSolutionLinkGetByTemplateIDLoader,
}

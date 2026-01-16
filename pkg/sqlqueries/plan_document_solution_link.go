package sqlqueries

import _ "embed"

//go:embed SQL/plan_document_solution_link/get_by_solution_id.sql
var planDocumentSolutionLinksGetBySolutionIDSQL string

//go:embed SQL/plan_document_solution_link/get_by_ids.sql
var planDocumentSolutionLinkGetByIDsSQL string

//go:embed SQL/plan_document_solution_link/num_links_by_document_id.sql
var planDocumentNumLinkedSolutionsSQL string

type planDocumentSolutionLinkScripts struct {
	GetBySolutionID      string
	GetByIDs             string
	NumLinksByDocumentID string
}

// PlanDocumentSolutionLink houses all the sql for getting data for plan document solution link from the database
var PlanDocumentSolutionLink = planDocumentSolutionLinkScripts{

	GetBySolutionID:      planDocumentSolutionLinksGetBySolutionIDSQL,
	GetByIDs:             planDocumentSolutionLinkGetByIDsSQL,
	NumLinksByDocumentID: planDocumentNumLinkedSolutionsSQL,
}

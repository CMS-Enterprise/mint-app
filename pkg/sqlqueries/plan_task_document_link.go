package sqlqueries

import _ "embed"

//go:embed SQL/plan_task_document_link/create.sql
var planTaskDocumentLinkCreateSQL string

type planTaskDocumentLinkScripts struct {
	Create string
}

// PlanTaskDocumentLink houses all SQL for plan task document links.
var PlanTaskDocumentLink = planTaskDocumentLinkScripts{
	Create: planTaskDocumentLinkCreateSQL,
}

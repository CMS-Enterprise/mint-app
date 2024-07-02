package sqlqueries

import _ "embed"

//go:embed SQL/plan_document/create.sql
var planDocumentCreateSQL string

//go:embed SQL/plan_document/update.sql
var planDocumentUpdateSQL string

//go:embed SQL/plan_document/read_by_id.sql
var planDocumentGetByIDSQL string

//go:embed SQL/plan_document/read_by_model_plan_id.sql
var planDocumentGetByModelPlanIDSQL string

//go:embed SQL/plan_document/read_by_solution_id.sql
var planDocumentsGetBySolutionIDSQL string

//go:embed SQL/plan_document/read_by_model_plan_id_not_restricted.sql
var planDocumentGetByModelPlanIDNotRestrictedSQL string

//go:embed SQL/plan_document/read_by_solution_id_not_restricted.sql
var planDocumentGetBySolutionIDNotRestrictedSQL string

//go:embed SQL/plan_document/delete_by_id.sql
var planDocumentDeleteByIDSQL string

type planDocumentScripts struct {
	Create                        string
	Update                        string
	GetByID                       string
	GetByModelPlanID              string
	GetBySolutionID               string
	GetByModelPlanIDNotRestricted string
	GetBySolutionIDNotRestricted  string
	DeleteByID                    string
}

// PlanDocument houses all the sql for getting data for plan document from the database
var PlanDocument = planDocumentScripts{
	Create:                        planDocumentCreateSQL,
	Update:                        planDocumentUpdateSQL,
	GetByID:                       planDocumentGetByIDSQL,
	GetByModelPlanID:              planDocumentGetByModelPlanIDSQL,
	GetBySolutionID:               planDocumentsGetBySolutionIDSQL,
	GetByModelPlanIDNotRestricted: planDocumentGetByModelPlanIDNotRestrictedSQL,
	GetBySolutionIDNotRestricted:  planDocumentGetBySolutionIDNotRestrictedSQL,
	DeleteByID:                    planDocumentDeleteByIDSQL,
}

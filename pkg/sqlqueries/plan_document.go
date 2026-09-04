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

//go:embed SQL/plan_document/read_by_model_plan_id_not_restricted.sql
var planDocumentGetByModelPlanIDNotRestrictedSQL string

//go:embed SQL/plan_document/read_by_plan_task_id.sql
var planDocumentGetByPlanTaskIDSQL string

//go:embed SQL/plan_document/read_by_plan_task_id_not_restricted.sql
var planDocumentGetByPlanTaskIDNotRestrictedSQL string

//go:embed SQL/plan_document/delete_by_id.sql
var planDocumentDeleteByIDSQL string

type planDocumentScripts struct {
	Create                        string
	Update                        string
	GetByID                       string
	GetByModelPlanID              string
	GetByModelPlanIDNotRestricted string
	GetByPlanTaskID               string
	GetByPlanTaskIDNotRestricted  string
	DeleteByID                    string
}

// PlanDocument houses all the sql for getting data for plan document from the database
var PlanDocument = planDocumentScripts{
	Create:                        planDocumentCreateSQL,
	Update:                        planDocumentUpdateSQL,
	GetByID:                       planDocumentGetByIDSQL,
	GetByModelPlanID:              planDocumentGetByModelPlanIDSQL,
	GetByModelPlanIDNotRestricted: planDocumentGetByModelPlanIDNotRestrictedSQL,
	GetByPlanTaskID:               planDocumentGetByPlanTaskIDSQL,
	GetByPlanTaskIDNotRestricted:  planDocumentGetByPlanTaskIDNotRestrictedSQL,
	DeleteByID:                    planDocumentDeleteByIDSQL,
}

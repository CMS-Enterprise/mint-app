package sqlqueries

import _ "embed"

//go:embed SQL/plan_cr/create.sql
var planCRCreateSQL string

//go:embed SQL/plan_cr/update.sql
var planCRUpdateSQL string

//go:embed SQL/plan_cr/delete.sql
var planCRDeleteSQL string

//go:embed SQL/plan_cr/get.sql
var planCRGetSQL string

//go:embed SQL/plan_cr/collection_by_model_plan_id.sql
var planCRCollectionByModelPlanIDSQL string

type planCRScripts struct {
	Create                  string
	Update                  string
	Delete                  string
	Get                     string
	CollectionByModelPlanID string
}

// PlanCR houses all the sql for getting data for plan cr from the database
var PlanCR = planCRScripts{
	Create:                  planCRCreateSQL,
	Update:                  planCRUpdateSQL,
	Delete:                  planCRDeleteSQL,
	Get:                     planCRGetSQL,
	CollectionByModelPlanID: planCRCollectionByModelPlanIDSQL,
}

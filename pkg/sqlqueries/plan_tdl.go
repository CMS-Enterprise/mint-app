package sqlqueries

import _ "embed"

//go:embed SQL/plan_tdl/create.sql
var planTDLCreateSQL string

//go:embed SQL/plan_tdl/update.sql
var planTDLUpdateSQL string

//go:embed SQL/plan_tdl/delete.sql
var planTDLDeleteSQL string

//go:embed SQL/plan_tdl/get.sql
var planTDLGetSQL string

//go:embed SQL/plan_tdl/collection_by_model_plan_id.sql
var planTDLCollectionByModelPlanIDSQL string

type planTDLScripts struct {
	Create                  string
	Update                  string
	Delete                  string
	Get                     string
	CollectionByModelPlanID string
}

// PlanTDL houses all the sql for getting data for plan tdl from the database
var PlanTDL = planTDLScripts{
	Create:                  planTDLCreateSQL,
	Update:                  planTDLUpdateSQL,
	Delete:                  planTDLDeleteSQL,
	Get:                     planTDLGetSQL,
	CollectionByModelPlanID: planTDLCollectionByModelPlanIDSQL,
}

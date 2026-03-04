package sqlqueries

import _ "embed"

//go:embed SQL/plan_task/get_by_model_plan_id_LOADER.sql
var planTaskGetByModelPlanIDLoaderSQL string

//go:embed SQL/plan_task/get_by_id.sql
var planTaskGetByIDSQL string

//go:embed SQL/plan_task/update.sql
var planTaskUpdateSQL string

//go:embed SQL/plan_task/create.sql
var planTaskCreateSQL string

type planTaskScripts struct {
	GetByModelPlanIDLoader string
	GetByID                string
	Update                 string
	Create                 string
}

var PlanTask = planTaskScripts{
	GetByModelPlanIDLoader: planTaskGetByModelPlanIDLoaderSQL,
	GetByID:                planTaskGetByIDSQL,
	Update:                 planTaskUpdateSQL,
	Create:                 planTaskCreateSQL,
}

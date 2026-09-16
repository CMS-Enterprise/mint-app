package sqlqueries

import _ "embed"

//go:embed SQL/plan_task/get_by_model_plan_id_LOADER.sql
var planTaskGetByModelPlanIDLoaderSQL string

//go:embed SQL/plan_task/get_by_id_loader.sql
var planTaskGetByIDLoaderSQL string

//go:embed SQL/plan_task/update_state_by_key.sql
var planTaskUpdateStateByKeySQL string

//go:embed SQL/plan_task/create.sql
var planTaskCreateSQL string

//go:embed SQL/plan_task/activate_upcoming.sql
var planTaskActivateUpcomingSQL string

type planTaskScripts struct {
	GetByModelPlanIDLoader string
	GetByIDLoader          string
	UpdateStateByKey       string
	Create                 string
	ActivateUpcoming       string
}

var PlanTask = planTaskScripts{
	GetByModelPlanIDLoader: planTaskGetByModelPlanIDLoaderSQL,
	GetByIDLoader:          planTaskGetByIDLoaderSQL,
	UpdateStateByKey:       planTaskUpdateStateByKeySQL,
	Create:                 planTaskCreateSQL,
	ActivateUpcoming:       planTaskActivateUpcomingSQL,
}

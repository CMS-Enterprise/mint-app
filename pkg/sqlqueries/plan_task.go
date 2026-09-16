package sqlqueries

import _ "embed"

//go:embed SQL/plan_task/get_by_model_plan_id_LOADER.sql
var planTaskGetByModelPlanIDLoaderSQL string

//go:embed SQL/plan_task/get_by_id_loader.sql
var planTaskGetByIDLoaderSQL string

//go:embed SQL/plan_task/update.sql
var planTaskUpdateSQL string

//go:embed SQL/plan_task/create.sql
var planTaskCreateSQL string

//go:embed SQL/plan_task/get_model_plan_ids_due_for_prepare_for_clearance.sql
var planTaskGetModelPlanIDsDueForPrepareForClearanceSQL string

type planTaskScripts struct {
	GetByModelPlanIDLoader                   string
	GetByIDLoader                            string
	Update                                   string
	Create                                   string
	GetModelPlanIDsDueForPrepareForClearance string
}

var PlanTask = planTaskScripts{
	GetByModelPlanIDLoader:                   planTaskGetByModelPlanIDLoaderSQL,
	GetByIDLoader:                            planTaskGetByIDLoaderSQL,
	Update:                                   planTaskUpdateSQL,
	Create:                                   planTaskCreateSQL,
	GetModelPlanIDsDueForPrepareForClearance: planTaskGetModelPlanIDsDueForPrepareForClearanceSQL,
}

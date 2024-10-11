package sqlqueries

import _ "embed"

//go:embed SQL/plan_data_exchange_approach/create.sql
var planDataExchangeApproachCreateSQL string

//go:embed SQL/plan_data_exchange_approach/update.sql
var planDataExchangeApproachUpdateSQL string

//go:embed SQL/plan_data_exchange_approach/get_by_id.sql
var planDataExchangeApproachGetByIDSQL string

//go:embed SQL/plan_data_exchange_approach/get_by_model_plan_id.sql
var planDataExchangeApproachGetByModelPlanIDSQL string

//go:embed SQL/plan_data_exchange_approach/get_by_model_plan_id_LOADER.sql
var planDataExchangeApproachGetByModelPlanIDLoaderSQL string

type planDataExchangeApproachScripts struct {
	Create           string
	Update           string
	GetByID          string
	GetByModelPlanID string
	//Uses a list of model_plan_ids to return a corresponding list of data exchange approach objects
	GetByModelPlanIDLoader string
}

// PlanDataExchangeApproach houses all the SQL scripts for the plan_data_exchange_approach table
var PlanDataExchangeApproach = planDataExchangeApproachScripts{
	Create:                 planDataExchangeApproachCreateSQL,
	Update:                 planDataExchangeApproachUpdateSQL,
	GetByID:                planDataExchangeApproachGetByIDSQL,
	GetByModelPlanID:       planDataExchangeApproachGetByModelPlanIDSQL,
	GetByModelPlanIDLoader: planDataExchangeApproachGetByModelPlanIDLoaderSQL,
}

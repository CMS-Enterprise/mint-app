package sqlqueries

import _ "embed"

//go:embed SQL/plan_basics/create.sql
var planBasicsCreateSQL string

//go:embed SQL/plan_basics/update.sql
var planBasicsUpdateSQL string

//go:embed SQL/plan_basics/get_by_id.sql
var planBasicsGetByIDSQL string

//go:embed SQL/plan_basics/get_by_model_plan_id_LOADER.sql
var planBasicsGetByModelPlanIDLoaderSQL string

//go:embed SQL/plan_basics/get_by_model_plan_id.sql
var planBasicsGetByModelPlanIDSQL string

type planBasicsScripts struct {
	Create                 string
	Update                 string
	GetByID                string
	GetByModelPlanIDLoader string
	GetByModelPlanID       string
}

// PlanBasics houses all the sql for getting data for plan basics from the database
var PlanBasics = planBasicsScripts{
	Create:                 planBasicsCreateSQL,
	Update:                 planBasicsUpdateSQL,
	GetByID:                planBasicsGetByIDSQL,
	GetByModelPlanIDLoader: planBasicsGetByModelPlanIDLoaderSQL,
	GetByModelPlanID:       planBasicsGetByModelPlanIDSQL,
}

package sqlqueries

import _ "embed"

//go:embed SQL/plan_payments/create.sql
var planPaymentsCreateSQL string

//go:embed SQL/plan_payments/update.sql
var planPaymentsUpdateSQL string

//go:embed SQL/plan_payments/get_by_id.sql
var planPaymentsGetByIDSQL string

//go:embed SQL/plan_payments/get_by_model_plan_id_LOADER.sql
var planPaymentsGetByModelPlanIDLoaderSQL string

type planPaymentsScripts struct {
	Create                 string
	Update                 string
	GetByID                string
	GetByModelPlanIDLoader string
}

// PlanPayments houses all the sql for getting data for plan payments from the database
var PlanPayments = planPaymentsScripts{
	Create:                 planPaymentsCreateSQL,
	Update:                 planPaymentsUpdateSQL,
	GetByID:                planPaymentsGetByIDSQL,
	GetByModelPlanIDLoader: planPaymentsGetByModelPlanIDLoaderSQL,
}

package sqlqueries

import _ "embed"

//go:embed SQL/plan_beneficiaries/create.sql
var planBeneficiariesCreateSQL string

//go:embed SQL/plan_beneficiaries/update.sql
var planBeneficiariesUpdateSQL string

//go:embed SQL/plan_beneficiaries/get_by_id.sql
var planBeneficiariesGetByIDSQL string

//go:embed SQL/plan_beneficiaries/get_by_model_plan_id_LOADER.sql
var planBeneficiariesGetByModelPlanIDLoaderSQL string

type planBeneficiariesScripts struct {
	Create                 string
	Update                 string
	GetByID                string
	GetByModelPlanIDLoader string
}

// PlanBeneficiaries houses all the sql for getting data for plan beneficiaries from the database
var PlanBeneficiaries = planBeneficiariesScripts{
	Create:                 planBeneficiariesCreateSQL,
	Update:                 planBeneficiariesUpdateSQL,
	GetByID:                planBeneficiariesGetByIDSQL,
	GetByModelPlanIDLoader: planBeneficiariesGetByModelPlanIDLoaderSQL,
}

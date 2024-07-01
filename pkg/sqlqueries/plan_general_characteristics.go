package sqlqueries

import _ "embed"

//go:embed SQL/plan_general_characteristics/create.sql
var planGeneralCharacteristicsCreateSQL string

//go:embed SQL/plan_general_characteristics/update.sql
var planGeneralCharacteristicsUpdateSQL string

//go:embed SQL/plan_general_characteristics/get_by_id.sql
var planGeneralCharacteristicsGetByIDSQL string

//go:embed SQL/plan_general_characteristics/get_by_model_plan_id_LOADER.sql
var planGeneralCharacteristicsGetByModelPlanIDLoaderSQL string

type planGeneralCharacteristicsScripts struct {
	Create                 string
	Update                 string
	GetByID                string
	GetByModelPlanIDLoader string
}

// PlanGeneralCharacteristics houses all the sql for getting data for plan general characteristics from the database
var PlanGeneralCharacteristics = planGeneralCharacteristicsScripts{
	Create:                 planGeneralCharacteristicsCreateSQL,
	Update:                 planGeneralCharacteristicsUpdateSQL,
	GetByID:                planGeneralCharacteristicsGetByIDSQL,
	GetByModelPlanIDLoader: planGeneralCharacteristicsGetByModelPlanIDLoaderSQL,
}

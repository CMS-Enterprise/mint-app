package sqlqueries

import _ "embed"

//go:embed SQL/operational_need/collection_get_by_model_plan_id.sql
var operationalNeedCollectionByModelPlanIDSQL string

//go:embed SQL/operational_need/collection_get_by_model_plan_id_LOADER.sql
var operationalNeedCollectionByModelPlanIDLOADERSQL string

//go:embed SQL/operational_need/get_by_model_plan_id_and_type.sql
var operationalNeedGetByModelPlanIDAndTypeSQL string

//go:embed SQL/operational_need/get_by_model_plan_id_and_other_type.sql
var operationalNeedGetByModelPlanIDAndOtherTypeSQL string

//go:embed SQL/operational_need/get_by_id.sql
var operationalNeedGetByIDSQL string

type operationalNeedScripts struct {
	CollectionByModelPlanID       string
	CollectionByModelPlanIDLoader string
	GetByModelPlanIDAndType       string
	GetByModelPlanIDAndOtherType  string
	GetByID                       string
}

// OperationalNeed houses all the sql for getting data for operational need from the database
var OperationalNeed = operationalNeedScripts{
	CollectionByModelPlanID:       operationalNeedCollectionByModelPlanIDSQL,
	CollectionByModelPlanIDLoader: operationalNeedCollectionByModelPlanIDLOADERSQL,
	GetByModelPlanIDAndType:       operationalNeedGetByModelPlanIDAndTypeSQL,
	GetByModelPlanIDAndOtherType:  operationalNeedGetByModelPlanIDAndOtherTypeSQL,
	GetByID:                       operationalNeedGetByIDSQL,
}

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

//go:embed SQL/operational_need/update_by_id.sql
var operationalNeedUpdateByIDSQL string

//go:embed SQL/operational_need/insert_or_update.sql
var operationalNeedInsertOrUpdateSQL string

//go:embed SQL/operational_need/insert_all_possible.sql
var operationalNeedInsertAllPossibleSQL string

//go:embed SQL/operational_need/insert_or_update_other.sql
var operationalNeedInsertOrUpdateOtherSQL string

type operationalNeedScripts struct {
	CollectionByModelPlanID       string
	CollectionByModelPlanIDLoader string
	GetByModelPlanIDAndType       string
	GetByModelPlanIDAndOtherType  string
	GetByID                       string
	UpdateByID                    string
	InsertOrUpdate                string
	InsertAllPossible             string
	InsertOrUpdateOther           string
}

// OperationalNeed houses all the sql for getting data for operational need from the database
var OperationalNeed = operationalNeedScripts{
	CollectionByModelPlanID:       operationalNeedCollectionByModelPlanIDSQL,
	CollectionByModelPlanIDLoader: operationalNeedCollectionByModelPlanIDLOADERSQL,
	GetByModelPlanIDAndType:       operationalNeedGetByModelPlanIDAndTypeSQL,
	GetByModelPlanIDAndOtherType:  operationalNeedGetByModelPlanIDAndOtherTypeSQL,
	GetByID:                       operationalNeedGetByIDSQL,
	UpdateByID:                    operationalNeedUpdateByIDSQL,
	InsertOrUpdate:                operationalNeedInsertOrUpdateSQL,
	InsertAllPossible:             operationalNeedInsertAllPossibleSQL,
	InsertOrUpdateOther:           operationalNeedInsertOrUpdateOtherSQL,
}

package sqlqueries

import _ "embed"

//go:embed SQL/possible_operational_need/collection_get_by_model_plan_id.sql
var possibleOperationalNeedCollectionByModelPlanIDSQL string

type possibleOperationalNeedScripts struct {
	CollectionByModelPlanID string
}

// PossibleOperationalNeed houses all the sql for getting data for possible operational need from the database
var PossibleOperationalNeed = possibleOperationalNeedScripts{
	CollectionByModelPlanID: possibleOperationalNeedCollectionByModelPlanIDSQL,
}

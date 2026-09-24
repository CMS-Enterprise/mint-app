package sqlqueries

import _ "embed"

//go:embed SQL/prepare_for_clearance/get_by_model_plan_id.sql
var prepareForClearanceGetByModelPlanID string

//go:embed SQL/prepare_for_clearance/clear_ready_for_clearance_by_model_plan_id.sql
var prepareForClearanceClearReadyForClearanceByModelPlanID string

type prepareForClearanceScripts struct {
	GetByModelPlanID                    string
	ClearReadyForClearanceByModelPlanID string
}

// PrepareForClearance houses all the sql for getting data for prepare for clearance from the database
var PrepareForClearance = prepareForClearanceScripts{
	GetByModelPlanID:                    prepareForClearanceGetByModelPlanID,
	ClearReadyForClearanceByModelPlanID: prepareForClearanceClearReadyForClearanceByModelPlanID,
}

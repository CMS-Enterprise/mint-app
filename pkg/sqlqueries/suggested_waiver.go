package sqlqueries

import _ "embed"

//go:embed SQL/suggested_waiver/create.sql
var suggestedWaiverCreateSQL string

//go:embed SQL/suggested_waiver/get_by_id.sql
var suggestedWaiverGetByIDSQL string

//go:embed SQL/suggested_waiver/get_by_model_plan_id_LOADER.sql
var suggestedWaiverGetByModelPlanIDLoaderSQL string

//go:embed SQL/suggested_waiver/delete_by_model_plan_id.sql
var suggestedWaiverDeleteByModelPlanIDSQL string

//go:embed SQL/suggested_waiver/insert_for_model_plan.sql
var suggestedWaiverInsertForModelPlanSQL string

type suggestedWaiverScripts struct {
	Create  string
	GetByID string
	// Uses a list of model_plan_ids to return all suggested waivers for those model plans (one-to-many)
	GetByModelPlanIDLoader string
	// Deletes all suggested waivers for a model plan (used when recalculating suggestions)
	DeleteByModelPlanID string
	// Inserts suggested waivers for a model plan based on current survey answers (DB-level logic)
	InsertForModelPlan string
}

// SuggestedWaiver houses all the SQL scripts for the suggested_waiver table
var SuggestedWaiver = suggestedWaiverScripts{
	Create:                 suggestedWaiverCreateSQL,
	GetByID:                suggestedWaiverGetByIDSQL,
	GetByModelPlanIDLoader: suggestedWaiverGetByModelPlanIDLoaderSQL,
	DeleteByModelPlanID:    suggestedWaiverDeleteByModelPlanIDSQL,
	InsertForModelPlan:     suggestedWaiverInsertForModelPlanSQL,
}

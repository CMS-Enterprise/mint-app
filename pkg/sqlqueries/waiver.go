package sqlqueries

import _ "embed"

//go:embed SQL/waiver/get_by_model_plan_id_LOADER.sql
var waiverGetByModelPlanIDLoaderSQL string

//go:embed SQL/waiver/upsert.sql
var waiverUpsertSQL string

//go:embed SQL/waiver/upsert_collection.sql
var waiverUpsertCollectionSQL string

type waiverScripts struct {
	// Uses a list of model_plan_ids to return all waivers for those model plans (one-to-many)
	GetByModelPlanIDLoader string
	// Creates the row if it does not exist, otherwise updates will_use_waiver and not_using_reason
	Upsert string
	// Bulk version of Upsert — accepts a JSON array and inserts or updates all rows in one statement
	UpsertCollection string
}

// Waiver houses all the SQL scripts for the waiver table
var Waiver = waiverScripts{
	GetByModelPlanIDLoader: waiverGetByModelPlanIDLoaderSQL,
	Upsert:                 waiverUpsertSQL,
	UpsertCollection:       waiverUpsertCollectionSQL,
}

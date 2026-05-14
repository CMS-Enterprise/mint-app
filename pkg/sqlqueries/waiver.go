package sqlqueries

import _ "embed"

//go:embed SQL/waiver/create.sql
var waiverCreateSQL string

//go:embed SQL/waiver/get_by_id.sql
var waiverGetByIDSQL string

//go:embed SQL/waiver/get_by_model_plan_id_LOADER.sql
var waiverGetByModelPlanIDLoaderSQL string

//go:embed SQL/waiver/update.sql
var waiverUpdateSQL string

type waiverScripts struct {
	Create  string
	GetByID string
	// Uses a list of model_plan_ids to return all waivers for those model plans (one-to-many)
	GetByModelPlanIDLoader string
	Update                 string
}

// Waiver houses all the SQL scripts for the waiver table
var Waiver = waiverScripts{
	Create:                 waiverCreateSQL,
	GetByID:                waiverGetByIDSQL,
	GetByModelPlanIDLoader: waiverGetByModelPlanIDLoaderSQL,
	Update:                 waiverUpdateSQL,
}

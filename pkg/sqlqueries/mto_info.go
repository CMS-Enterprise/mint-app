package sqlqueries

import _ "embed"

//go:embed SQL/mto/info/create.sql
var mtoInfoCreateSQL string

//go:embed SQL/mto/info/update.sql
var mtoInfoUpdateSQL string

//go:embed SQL/mto/info/get_by_model_plan_id_loader.sql
var mtoInfoGetByModelPlanIDLoaderSQL string

type mtoInfoScripts struct {
	Create string
	Update string
	// Holds the SQL to get a mto information by model plan id
	GetByModelPlanIDLoader string
}

// MTOInfo houses all the sql for getting data for mto info objects from the database
var MTOInfo = mtoInfoScripts{
	Create:                 mtoInfoCreateSQL,
	Update:                 mtoInfoUpdateSQL,
	GetByModelPlanIDLoader: mtoInfoGetByModelPlanIDLoaderSQL,
}

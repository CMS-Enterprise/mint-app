package sqlqueries

import _ "embed"

//go:embed SQL/common_waiver/get_by_id_LOADER.sql
var commonWaiverGetByIDLoaderSQL string

//go:embed SQL/common_waiver/get_by_model_plan_id_LOADER.sql
var commonWaiverGetByModelPlanIDSQL string

type commonWaiverScripts struct {
	GetByIDLoader          string
	GetByModelPlanIDLoader string
}

// CommonWaiver houses all the SQL scripts for the common_waiver table
var CommonWaiver = commonWaiverScripts{
	GetByIDLoader:          commonWaiverGetByIDLoaderSQL,
	GetByModelPlanIDLoader: commonWaiverGetByModelPlanIDSQL,
}

package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_milestone/get_by_key_LOADER.sql
var mtoCommonMilestoneGetByKeyLoaderSQL string

//go:embed SQL/mto/common_milestone/get_by_model_plan_id_LOADER.sql
var mtoCommonMilestoneGetByModelPlanIDLoaderSQL string

type mtoCommonMilestoneScripts struct {
	GetByKeyLoader         string
	GetByModelPlanIDLoader string
}

// MTOCommonMilestone contains all the SQL queries for the MTO common milestone
var MTOCommonMilestone = mtoCommonMilestoneScripts{
	GetByKeyLoader:         mtoCommonMilestoneGetByKeyLoaderSQL,
	GetByModelPlanIDLoader: mtoCommonMilestoneGetByModelPlanIDLoaderSQL,
}

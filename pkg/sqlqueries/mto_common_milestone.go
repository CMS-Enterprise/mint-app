package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_milestone/get_by_model_plan_id_LOADER.sql
var mtoCommonMilestoneGetByModelPlanIDLoaderSQL string

//go:embed SQL/mto/common_milestone/get_by_id_LOADER.sql
var mtoCommonMilestoneGetByIDLoaderSQL string

type mtoCommonMilestoneScripts struct {
	GetByModelPlanIDLoader string
	GetByIDLoader          string
}

// MTOCommonMilestone contains all the SQL queries for the MTO common milestone
var MTOCommonMilestone = mtoCommonMilestoneScripts{
	GetByModelPlanIDLoader: mtoCommonMilestoneGetByModelPlanIDLoaderSQL,
	GetByIDLoader:          mtoCommonMilestoneGetByIDLoaderSQL,
}

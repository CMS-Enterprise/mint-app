package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_milestone/get_by_model_plan_id_LOADER.sql
var mtoCommonMilestoneGetByModelPlanIDLoaderSQL string

//go:embed SQL/mto/common_milestone/get_by_id_LOADER.sql
var mtoCommonMilestoneGetByIDLoaderSQL string

//go:embed SQL/mto/common_milestone/archive.sql
var mtoCommonMilestoneArchiveSQL string

type mtoCommonMilestoneScripts struct {
	GetByModelPlanIDLoader string
	GetByIDLoader          string
	Archive                string
}

// MTOCommonMilestone contains all the SQL queries for the MTO common milestone
var MTOCommonMilestone = mtoCommonMilestoneScripts{
	GetByModelPlanIDLoader: mtoCommonMilestoneGetByModelPlanIDLoaderSQL,
	GetByIDLoader:          mtoCommonMilestoneGetByIDLoaderSQL,
	Archive:                mtoCommonMilestoneArchiveSQL,
}

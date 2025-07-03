package sqlqueries

import _ "embed"

//go:embed SQL/plan_timeline/create.sql
var planTimelineCreateSQL string

//go:embed SQL/plan_timeline/update.sql
var planTimelineUpdateSQL string

//go:embed SQL/plan_timeline/get_by_id.sql
var planTimelineGetByIDSQL string

//go:embed SQL/plan_timeline/get_by_model_plan_id_LOADER.sql
var planTimelineGetByModelPlanIDLoaderSQL string

//go:embed SQL/plan_timeline/get_by_model_plan_id.sql
var planTimelineGetByModelPlanIDSQL string

type planTimelineScripts struct {
	Create                 string
	Update                 string
	GetByID                string
	GetByModelPlanIDLoader string
	GetByModelPlanID       string
}

// PlanTimeline houses all the sql for getting data for planTimeline from the database
var PlanTimeline = planTimelineScripts{
	Create:                 planTimelineCreateSQL,
	Update:                 planTimelineUpdateSQL,
	GetByID:                planTimelineGetByIDSQL,
	GetByModelPlanIDLoader: planTimelineGetByModelPlanIDLoaderSQL,

	GetByModelPlanID: planTimelineGetByModelPlanIDSQL,
}

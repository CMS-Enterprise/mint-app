package sqlqueries

import _ "embed"

//go:embed SQL/timeline/create.sql
var timelineCreateSQL string

//go:embed SQL/timeline/update.sql
var timelineUpdateSQL string

//go:embed SQL/timeline/get_by_id.sql
var timelineGetByIDSQL string

//go:embed SQL/timeline/get_by_model_plan_id_LOADER.sql
var timelineGetByModelPlanIDLoaderSQL string

//go:embed SQL/timeline/get_by_model_plan_id.sql
var timelineGetByModelPlanIDSQL string

type timelineScripts struct {
	Create                 string
	Update                 string
	GetByID                string
	GetByModelPlanIDLoader string
	GetByModelPlanID       string
}

// PlanBasics houses all the sql for getting data for plan basics from the database
var Timeline = timelineScripts{
	Create:                 timelineCreateSQL,
	Update:                 timelineUpdateSQL,
	GetByID:                timelineGetByIDSQL,
	GetByModelPlanIDLoader: timelineGetByModelPlanIDLoaderSQL,

	GetByModelPlanID: timelineGetByModelPlanIDSQL,
}

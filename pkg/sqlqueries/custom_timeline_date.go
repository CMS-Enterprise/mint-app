package sqlqueries

import _ "embed"

//go:embed SQL/custom_timeline_date/get_by_id.sql
var customTimelineDateGetByIDSQL string

//go:embed SQL/custom_timeline_date/get_by_model_plan_id_LOADER.sql
var customTimelineDateGetByModelPlanIDLoaderSQL string

//go:embed SQL/custom_timeline_date/delete.sql
var customTimelineDateDeleteSQL string

type customTimelineDateScripts struct {
	GetByID                string
	GetByModelPlanIDLoader string
	Delete                 string
}

// CustomTimelineDate houses all the SQL scripts for the custom_timeline_dates table.
var CustomTimelineDate = customTimelineDateScripts{
	GetByID:                customTimelineDateGetByIDSQL,
	GetByModelPlanIDLoader: customTimelineDateGetByModelPlanIDLoaderSQL,
	Delete:                 customTimelineDateDeleteSQL,
}

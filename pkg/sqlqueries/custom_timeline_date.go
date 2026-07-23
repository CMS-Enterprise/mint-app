package sqlqueries

import _ "embed"

//go:embed SQL/custom_timeline_date/create.sql
var customTimelineDateCreateSQL string

//go:embed SQL/custom_timeline_date/get_by_id_LOADER.sql
var customTimelineDateGetByIDLoaderSQL string

//go:embed SQL/custom_timeline_date/get_by_model_plan_id_LOADER.sql
var customTimelineDateGetByModelPlanIDLoaderSQL string

//go:embed SQL/custom_timeline_date/update.sql
var customTimelineDateUpdateSQL string

//go:embed SQL/custom_timeline_date/update_dates_by_ids.sql
var customTimelineDateUpdateDatesByIDsSQL string

//go:embed SQL/custom_timeline_date/delete.sql
var customTimelineDateDeleteSQL string

type customTimelineDateScripts struct {
	Create                 string
	GetByIDLoader          string
	GetByModelPlanIDLoader string
	Update                 string
	UpdateDatesByIDs       string
	Delete                 string
}

// CustomTimelineDate houses all the SQL scripts for the custom_timeline_dates table.
var CustomTimelineDate = customTimelineDateScripts{
	Create:                 customTimelineDateCreateSQL,
	GetByIDLoader:          customTimelineDateGetByIDLoaderSQL,
	GetByModelPlanIDLoader: customTimelineDateGetByModelPlanIDLoaderSQL,
	Update:                 customTimelineDateUpdateSQL,
	UpdateDatesByIDs:       customTimelineDateUpdateDatesByIDsSQL,
	Delete:                 customTimelineDateDeleteSQL,
}

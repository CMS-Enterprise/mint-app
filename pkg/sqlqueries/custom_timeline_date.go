package sqlqueries

import _ "embed"

//go:embed SQL/custom_timeline_date/get_by_id.sql
var customTimelineDateGetByIDSQL string

type customTimelineDateScripts struct {
	GetByID string
}

// CustomTimelineDate houses all the SQL scripts for the custom_timeline_dates table.
var CustomTimelineDate = customTimelineDateScripts{
	GetByID: customTimelineDateGetByIDSQL,
}

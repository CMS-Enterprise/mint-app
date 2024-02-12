package sqlqueries

import _ "embed"

// activityCreateSQL creates an activity object in the database
//
//go:embed SQL/activity/create.sql
var activityCreateSQL string

// activityGetByIDSQL Gets an activity object in the database
//
//go:embed SQL/activity/get_by_id.sql
var activityGetByIDSQL string

type activityScripts struct {
	// Holds the SQL query to create an Activity
	Create string

	// Holds the SQL for returning an Activity by a specific ID
	GetByID string
}

// Activity holds all the SQL scrips related to the Activity Entity
var Activity = activityScripts{
	Create:  activityCreateSQL,
	GetByID: activityGetByIDSQL,
}

package sqlqueries

import _ "embed"

// activityCreateSQL creates an activity object in the database
//
//go:embed SQL/activity/create.sql
var activityCreateSQL string

type activityScripts struct {
	// Holds the SQL query to create an Activity
	Create string
}

// Activity holds all the SQL scrips related to the Activity Entity
var Activity = activityScripts{
	Create: activityCreateSQL,
}

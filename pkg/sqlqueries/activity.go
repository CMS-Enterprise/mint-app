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

// activityGetByIDLoaderSQL Gets an activity object in the database
//
//go:embed SQL/activity/get_by_id_loader.sql
var activityGetByIDLoaderSQL string

// activityCountByMetadataSQL counts activities with the same metadata
//
//go:embed SQL/activity/metadata_count.sql
var activityCountByMetadataSQL string

type activityScripts struct {
	// Holds the SQL query to create an Activity
	Create string

	// Holds the SQL for returning an Activity by a specific ID
	GetByID string

	// Holds the SQL for returning an Activity by a specific ID, utilizing a serialized JSON array and a data Loader
	// it expects that the array have a field named id in it
	GetByIDLoader string

	// Holds the SQL for counting activities by metadata
	CountByMetadata string
}

// Activity holds all the SQL scrips related to the Activity Entity
var Activity = activityScripts{
	Create:          activityCreateSQL,
	GetByID:         activityGetByIDSQL,
	GetByIDLoader:   activityGetByIDLoaderSQL,
	CountByMetadata: activityCountByMetadataSQL,
}

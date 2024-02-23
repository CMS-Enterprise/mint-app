package sqlqueries

import _ "embed"

// userNotificationPreferencesCreateSQL creates a new UserNotificationPreferences object
//
//go:embed SQL/user_notification_preferences/create.sql
var userNotificationPreferencesCreateSQL string

// userNotificationPreferencesGetByUserIDSQL returns a corresponding UserNotificationPreferences object by it's ID
//
//go:embed SQL/user_notification_preferences/get_by_user_id.sql
var userNotificationPreferencesGetByUserIDSQL string

// userNotificationPreferencesGetByUserIDLoaderSQL returns a corresponding UserNotificationPreferences object by it's ID
//
//go:embed SQL/user_notification_preferences/get_by_user_id_loader.sql
var userNotificationPreferencesGetByUserIDLoaderSQL string

// userNotificationPreferencesUpdateSQL updates UserNotificationPreferences object
//
//go:embed SQL/user_notification_preferences/update.sql
var userNotificationPreferencesUpdateSQL string

type userNotificationPreferencesScripts struct {
	// Holds the SQL query to create a UserNotificationPreferences
	Create string

	// Holds the SQL query for returning a UserNotificationPreferences object by User ID
	GetByUserID string
	// Holds the SQL for returning a UserNotificationPreferences by a specific user_id, utilizing a serialized JSON array and a data Loader
	// it expects that the array have a field named user_id in it
	GetByUserIDLoader string

	// Holds the SQL query for updating a User NotificationPreferences object
	Update string
}

// UserNotificationPreferences holds all the SQL scrips related to the userNotificationPreferences Entity
var UserNotificationPreferences = userNotificationPreferencesScripts{
	Create:            userNotificationPreferencesCreateSQL,
	GetByUserID:       userNotificationPreferencesGetByUserIDSQL,
	GetByUserIDLoader: userNotificationPreferencesGetByUserIDLoaderSQL,
	Update:            userNotificationPreferencesUpdateSQL,
}

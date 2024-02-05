package sqlqueries

import _ "embed"

// userNotificationCreateSQL creates an userNotification object in the database
//
//go:embed SQL/user_notification/create.sql
var userNotificationCreateSQL string

// userNotificationCollectionGetByUserIDSQL returns all userNotification objects in the database for a given userID
//
//go:embed SQL/user_notification/collection_get_by_user_id.sql
var userNotificationCollectionGetByUserIDSQL string

type userNotificationScripts struct {
	// Holds the SQL query to create an UserNotification
	Create string
	// Holds the SQL query to return all UserNotifications for a given UserID
	CollectionGetByUserID string
}

// UserNotification holds all the SQL scrips related to the userNotification Entity
var UserNotification = userNotificationScripts{
	Create:                userNotificationCreateSQL,
	CollectionGetByUserID: userNotificationCollectionGetByUserIDSQL,
}

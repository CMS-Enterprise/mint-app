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

// userNotificationMarkAsReadByIDSQL marks a userNotification object in the database as read. It requires that the user who owns the notification be the user who is modifiying the entry
//
//go:embed SQL/user_notification/mark_as_read_by_id.sql
var userNotificationMarkAsReadByIDSQL string

// userNotificationMarkAsReadByUserIDSQL marks all userNotification object in the database as read for a given user_id
//
//go:embed SQL/user_notification/mark_as_read_by_user_id.sql
var userNotificationMarkAsReadByUserIDSQL string

type userNotificationScripts struct {
	// Holds the SQL query to create an UserNotification
	Create string
	// Holds the SQL query to return all UserNotifications for a given UserID
	CollectionGetByUserID string
	// Holds the SQL to update a entry to mark that it has been read.
	MarksAsReadByID string
	// Holds the SQL to update all userNotification object in the database as read for a given user_id
	MarkCollectionAsReadByUserID string
}

// UserNotification holds all the SQL scrips related to the userNotification Entity
var UserNotification = userNotificationScripts{
	Create:                       userNotificationCreateSQL,
	CollectionGetByUserID:        userNotificationCollectionGetByUserIDSQL,
	MarksAsReadByID:              userNotificationMarkAsReadByIDSQL,
	MarkCollectionAsReadByUserID: userNotificationMarkAsReadByUserIDSQL,
}

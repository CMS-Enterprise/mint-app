package models

// UserNotificationContent is an interface which is used to return a Union type for graphql.
// Specifically, it allows us to return data that a notification is about
type UserNotificationContent interface {
	isUserNotificationContent()
}

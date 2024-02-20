// Package notifications is a package that holds all the logic to
//  1. Record an app activity
//     a. Write a record of a user level notification
//  2. Act on the notification
package notifications

// dbStore exists so we can organize database calls. We don't want to export the database calls outside of the package, but it is needlessly complicated to create a separate package
type dbStoreMethods struct {
	// holds all activity related store methods
	activity activityStore
	// holds all notification related store methods
	notification notificationStore
}

// a wrapper to organize activity store methods
type activityStore struct{}

// a wrapper to organize notification store methods
type notificationStore struct{}

// dbStore is a convenience instance of the databaseCalls empty struct. This allows us to more easily organize store methods in the notifications package without relying on another separate package
var dbStore = dbStoreMethods{
	activity:     activityStore{},
	notification: notificationStore{},
}

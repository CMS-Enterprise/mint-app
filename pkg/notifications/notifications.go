// Package notifications is a package that holds all the logic to
//  1. Record an app activity
//     a. Write a record of a user level notification
//  2. Act on the notification
package notifications

// dataBaseCalls exists so we can organize database calls. We don't want to export the database calls outside of the package, but it is needlessly complicated to create a separate package
type dataBaseCalls struct{}

// TODO EASI-3925  consider renaming this to be a store method (or call it activity store or notification store)

// dbCall is a convenience instance of the databaseCalls empty struct. This allows us to more easily organize store methods in the notifications package without relying on another separate package
var dbCall dataBaseCalls

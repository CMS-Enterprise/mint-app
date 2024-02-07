package models

import (
	"github.com/google/uuid"
	"github.com/samber/lo"
)

// UserNotification represents a discrete event that has happened in the application that might be notifiable.
type UserNotification struct {
	baseStruct
	// The id of the user this notification is for
	UserID uuid.UUID `json:"userID" db:"user_id"`
	// The if of the entity this notification is about
	ActivityID uuid.UUID `json:"activityID" db:"activity_id"`
	IsRead     bool      `json:"isRead" db:"is_read"`
}

// UserNotificationContent is an interface which is used to return a Union type for graphql.
// Specifically, it allows us to return data that a notification is about
type UserNotificationContent interface {
	isUserNotificationContent()
}

// NewUserNotification returns a New UserNotification
func NewUserNotification(userID uuid.UUID, activityID uuid.UUID) *UserNotification {
	return &UserNotification{
		baseStruct: NewBaseStruct(userID),
		ActivityID: activityID,
		IsRead:     false,
	}
}

// UserNotifications is a collection of User Notification Objects.
type UserNotifications struct {
	Notifications []*UserNotification
}

// NumUnreadNotifications returns the number of UnreadNotifications
func (un *UserNotifications) NumUnreadNotifications() int {
	return len(un.Notifications)
}

// UnreadNotifications returns the subset of Notifications with a status of IsRead = false
func (un *UserNotifications) UnreadNotifications() []*UserNotification {
	return lo.Filter(un.Notifications, func(notification *UserNotification, index int) bool {
		return !notification.IsRead
	})

}

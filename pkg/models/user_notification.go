package models

import (
	"github.com/google/uuid"
	"github.com/samber/lo"
)

// UserNotification represents a discrete event that has happened in the application that might be notifiable.
type UserNotification struct {
	baseStruct
	// The id of the user this notification is for
	userIDRelation
	// The if of the entity this notification is about
	ActivityID uuid.UUID `json:"activityID" db:"activity_id"`
	IsRead     bool      `json:"isRead" db:"is_read"`
	InAppSent  bool      `json:"inAppSent" db:"in_app_sent"`
	EmailSent  bool      `json:"emailSent" db:"email_sent"`
}

// NewUserNotification returns a New UserNotification
func NewUserNotification(
	userID uuid.UUID,
	activityID uuid.UUID,
	// whether or not a user set a preference to send in app notifications
	inAppNotification bool,
	// whether or not a user set a preference to receive an email notification
	emailNotification bool,
) *UserNotification {
	return &UserNotification{
		baseStruct:     NewBaseStruct(userID),
		userIDRelation: NewUserIDRelation(userID),
		ActivityID:     activityID,
		IsRead:         !inAppNotification, // set to read if user doesn't want notifications
		InAppSent:      inAppNotification,  // set to archived if user doesn't want notifications
		EmailSent:      emailNotification,  // set that an email should be sent for this
	}
}

// UserNotifications is a collection of User Notification Objects.
type UserNotifications struct {
	Notifications []*UserNotification
}

// NumUnreadNotifications returns the number of UnreadNotifications
func (un *UserNotifications) NumUnreadNotifications() int {
	return len(un.UnreadNotifications())
}

// UnreadNotifications returns the subset of Notifications with a status of IsRead = false
func (un *UserNotifications) UnreadNotifications() []*UserNotification {
	return lo.Filter(un.Notifications, func(notification *UserNotification, index int) bool {
		return !notification.IsRead
	})

}

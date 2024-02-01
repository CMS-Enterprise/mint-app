package models

import (
	"github.com/google/uuid"
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

// NewUserNotification returns a New UserNotification
func NewUserNotification(userID uuid.UUID, activityID uuid.UUID) *UserNotification {
	return &UserNotification{
		baseStruct: NewBaseStruct(userID),
		ActivityID: activityID,
		IsRead:     false,
	}
}

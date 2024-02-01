package models

import (
	"github.com/google/uuid"
)

// UserNotificationPreferences represents a discrete event that has happened in the application that might be notifiable.
type UserNotificationPreferences struct {
	baseStruct
	// The id of the user this preferences object is for
	UserID uuid.UUID `json:"userID" db:"user_id"`

	DailyDigestEmail        bool `json:"dailyDigestEmail" db:"daily_digest_email"`
	DailyDigestInApp        bool `json:"dailyDigestInApp" db:"daily_digest_in_app"`
	NewPlanDiscussionEmail  bool `json:"newPlanDiscussionEmail" db:"new_plan_discussion_email"`
	NewPlanDiscussionInApp  bool `json:"newPlanDiscussionInApp" db:"new_plan_discussion_in_app"`
	NewDiscussionReplyEmail bool `json:"newDiscussionReplyEmail" db:"new_discussion_reply_email"`
	NewDiscussionReplyInApp bool `json:"newDiscussionReplyInApp" db:"new_discussion_reply_in_app"`
}

// NewUserNotificationPreferences returns a New UserNotificationPreferences
func NewUserNotificationPreferences(userID uuid.UUID) *UserNotificationPreferences {
	return &UserNotificationPreferences{
		baseStruct:              NewBaseStruct(userID),
		DailyDigestEmail:        true,
		DailyDigestInApp:        true,
		NewPlanDiscussionEmail:  true,
		NewPlanDiscussionInApp:  true,
		NewDiscussionReplyEmail: true,
		NewDiscussionReplyInApp: true,
	}
}

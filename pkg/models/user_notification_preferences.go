package models

import (
	"github.com/google/uuid"
)

// UserNotificationPreferences represents a discrete event that has happened in the application that might be notifiable.
type UserNotificationPreferences struct {
	baseStruct
	// The id of the user this preferences object is for
	UserID uuid.UUID `json:"userID" db:"user_id"`

	DailyDigestCompleteEmail bool `json:"dailyDigestCompleteEmail" db:"daily_digest_complete_email"`
	DailyDigestCompleteInApp bool `json:"dailyDigestCompleteInApp" db:"daily_digest_complete_in_app"`

	AddedAsCollaboratorEmail bool `json:"addedAsCollaboratorEmail" db:"added_as_collaborator_email"`
	AddedAsCollaboratorInApp bool `json:"addedAsCollaboratorInApp" db:"added_as_collaborator_in_app"`

	TaggedInDiscussionEmail bool `json:"taggedInDiscussionEmail" db:"tagged_in_discussion_email"`
	TaggedInDiscussionInApp bool `json:"taggedInDiscussionInApp" db:"tagged_in_discussion_in_app"`

	TaggedInDiscussionReplyEmail bool `json:"taggedInDiscussionReplyEmail" db:"tagged_in_discussion_reply_email"`
	TaggedInDiscussionReplyInApp bool `json:"taggedInDiscussionReplyInApp" db:"tagged_in_discussion_reply_in_app"`

	NewDiscussionReplyEmail bool `json:"newDiscussionReplyEmail" db:"new_discussion_reply_email"`
	NewDiscussionReplyInApp bool `json:"newDiscussionReplyInApp" db:"new_discussion_reply_in_app"`

	ModelPlanSharedEmail bool `json:"modelPlanSharedEmail" db:"model_plan_shared_email"`
	ModelPlanSharedInApp bool `json:"modelPlanSharedInApp" db:"model_plan_shared_in_app"`

	NewPlanDiscussionEmail bool `json:"newPlanDiscussionEmail" db:"new_plan_discussion_email"`
	NewPlanDiscussionInApp bool `json:"newPlanDiscussionInApp" db:"new_plan_discussion_in_app"`
}

// NewUserNotificationPreferences returns a New UserNotificationPreferences
func NewUserNotificationPreferences(userID uuid.UUID) *UserNotificationPreferences {
	return &UserNotificationPreferences{
		baseStruct:               NewBaseStruct(userID),
		DailyDigestCompleteEmail: true,
		DailyDigestCompleteInApp: true,
		NewPlanDiscussionEmail:   true,
		NewPlanDiscussionInApp:   true,
		NewDiscussionReplyEmail:  true,
		NewDiscussionReplyInApp:  true,
	}
}

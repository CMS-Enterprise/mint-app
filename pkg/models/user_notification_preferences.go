package models

import (
	"github.com/google/uuid"
)

// UserNotificationPreferences represents a discrete event that has happened in the application that might be notifiable.
type UserNotificationPreferences struct {
	baseStruct
	// The id of the user this preferences object is for
	UserID uuid.UUID `json:"userID" db:"user_id"`

	DailyDigestComplete     UserNotificationPreferenceFlag `json:"dailyDigestComplete" db:"daily_digest_complete"`
	AddedAsCollaborator     UserNotificationPreferenceFlag `json:"addedAsCollaborator" db:"added_as_collaborator"`
	TaggedInDiscussion      UserNotificationPreferenceFlag `json:"taggedInDiscussion" db:"tagged_in_discussion"`
	TaggedInDiscussionReply UserNotificationPreferenceFlag `json:"taggedInDiscussionReply" db:"tagged_in_discussion_reply"`
	NewDiscussionReply      UserNotificationPreferenceFlag `json:"newDiscussionReply" db:"new_discussion_reply"`
	ModelPlanShared         UserNotificationPreferenceFlag `json:"modelPlanShared" db:"model_plan_shared"`
	NewPlanDiscussion       UserNotificationPreferenceFlag `json:"newPlanDiscussion" db:"new_plan_discussion"`
}

// NewUserNotificationPreferences returns a New UserNotificationPreferences
func NewUserNotificationPreferences(userID uuid.UUID) *UserNotificationPreferences {
	return &UserNotificationPreferences{
		baseStruct: NewBaseStruct(userID),
		UserID:     userID,

		DailyDigestComplete:     UserNotificationPreferenceAll,
		AddedAsCollaborator:     UserNotificationPreferenceAll,
		TaggedInDiscussion:      UserNotificationPreferenceAll,
		TaggedInDiscussionReply: UserNotificationPreferenceAll,
		NewDiscussionReply:      UserNotificationPreferenceAll,
		ModelPlanShared:         UserNotificationPreferenceAll,
		NewPlanDiscussion:       UserNotificationPreferenceAll,
	}
}

// UserNotificationPreferenceFlag is an enum that represents the role of a user in a Discussion
type UserNotificationPreferenceFlag string

// These constants represent the possible values of a DiscussionUserRole
const (
	UserNotificationPreferenceAll       UserNotificationPreferenceFlag = "ALL"
	UserNotificationPreferenceInAppOnly UserNotificationPreferenceFlag = "IN_APP_ONLY"
	UserNotificationPreferenceEmailOnly UserNotificationPreferenceFlag = "EMAIL_ONLY"
	UserNotificationPreferenceNone      UserNotificationPreferenceFlag = "NONE"
)

// InApp translates notification preferences to a bool. True means the user desires an in app notification for this notification type
func (unp UserNotificationPreferenceFlag) InApp() bool {
	return unp == UserNotificationPreferenceAll || unp == UserNotificationPreferenceInAppOnly
}

// SendEmail translates notification preferences to a bool. True means the user desires an email for this notification type
func (unp UserNotificationPreferenceFlag) SendEmail() bool {
	return unp == UserNotificationPreferenceAll || unp == UserNotificationPreferenceEmailOnly
}

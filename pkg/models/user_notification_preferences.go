package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/serialization"
)

// UserNotificationPreferences represents a discrete event that has happened in the application that might be notifiable.
type UserNotificationPreferences struct {
	baseStruct
	// The id of the user this preferences object is for
	UserID uuid.UUID `json:"userID" db:"user_id"`

	DailyDigestComplete     UserNotificationPreferenceFlags `json:"dailyDigestComplete" db:"daily_digest_complete"`
	AddedAsCollaborator     UserNotificationPreferenceFlags `json:"addedAsCollaborator" db:"added_as_collaborator"`
	TaggedInDiscussion      UserNotificationPreferenceFlags `json:"taggedInDiscussion" db:"tagged_in_discussion"`
	TaggedInDiscussionReply UserNotificationPreferenceFlags `json:"taggedInDiscussionReply" db:"tagged_in_discussion_reply"`
	NewDiscussionReply      UserNotificationPreferenceFlags `json:"newDiscussionReply" db:"new_discussion_reply"`
	ModelPlanShared         UserNotificationPreferenceFlags `json:"modelPlanShared" db:"model_plan_shared"`
	DatesChanged            UserNotificationPreferenceFlags `json:"datesChanged" db:"dates_changed"`
}

// NewUserNotificationPreferences returns a New UserNotificationPreferences
func NewUserNotificationPreferences(userID uuid.UUID) *UserNotificationPreferences {
	return &UserNotificationPreferences{
		baseStruct: NewBaseStruct(userID),
		UserID:     userID,

		DailyDigestComplete:     DefaultUserNotificationPreferencesFlags(),
		AddedAsCollaborator:     DefaultUserNotificationPreferencesFlags(),
		TaggedInDiscussion:      DefaultUserNotificationPreferencesFlags(),
		TaggedInDiscussionReply: DefaultUserNotificationPreferencesFlags(),
		NewDiscussionReply:      DefaultUserNotificationPreferencesFlags(),
		ModelPlanShared:         DefaultUserNotificationPreferencesFlags(),
		DatesChanged:            DefaultUserNotificationPreferencesFlags(),
	}
}

// DefaultUserNotificationPreferencesFlags returns the default Preferences flag for any user, defaulting to all turned on.
func DefaultUserNotificationPreferencesFlags() []UserNotificationPreferenceFlag {
	return []UserNotificationPreferenceFlag{UserNotificationPreferenceInApp, UserNotificationPreferenceEmail}
}

// UserNotificationPreferenceFlags represents an array or User Notification Preference flags
// Note, this typically would just be represented as a pq.StringArray, however, it is important to write receiver methods on the type
// As such, we implement the sqlx Valuer and Scanner interfaces so we can serialize and deserialize directly to and from the database.
type UserNotificationPreferenceFlags []UserNotificationPreferenceFlag

// UserNotificationPreferenceFlag is an enum that represents the role of a user in a Discussion
type UserNotificationPreferenceFlag string

// These constants represent the possible values of a DiscussionUserRole
const (
	UserNotificationPreferenceInApp UserNotificationPreferenceFlag = "IN_APP"
	UserNotificationPreferenceEmail UserNotificationPreferenceFlag = "EMAIL"
)

// InApp translates notification preferences to a bool. True means the user desires an in app notification for this notification type
func (unp UserNotificationPreferenceFlags) InApp() bool {
	return lo.Contains(unp, UserNotificationPreferenceInApp)
}

// SendEmail translates notification preferences to a bool. True means the user desires an email for this notification type
func (unp UserNotificationPreferenceFlags) SendEmail() bool {
	return lo.Contains(unp, UserNotificationPreferenceEmail)
}

// Scan is used by sql.scan to read the values from the DB
func (unp *UserNotificationPreferenceFlags) Scan(src interface{}) error {
	return serialization.GenericStringArrayScan(src, unp)
}

// Value implements the driver.Valuer interface.
func (unp UserNotificationPreferenceFlags) Value() (driver.Value, error) {
	return serialization.GenericStringArrayValue(unp)

}

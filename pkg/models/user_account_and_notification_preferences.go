package models

import (
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

type UserAccountAndNotificationPreferences struct {
	authentication.UserAccount
	PreferenceFlags UserNotificationPreferenceFlags `json:"preferenceFlags" db:"preference_flags"`
}

func FilterNotificationPreferences(notifPreferences []*UserAccountAndNotificationPreferences) (
	emailPreferences []*UserAccountAndNotificationPreferences,
	inAppPreferences []*UserAccountAndNotificationPreferences,
) {
	emailPreferences = lo.Filter(notifPreferences, func(uan *UserAccountAndNotificationPreferences, _ int) bool {
		return lo.Contains(uan.PreferenceFlags, "EMAIL")
	})

	inAppPreferences = lo.Filter(notifPreferences, func(uan *UserAccountAndNotificationPreferences, _ int) bool {
		return lo.Contains(uan.PreferenceFlags, "IN_APP")
	})

	return emailPreferences, inAppPreferences
}

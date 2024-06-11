package models

import "github.com/cmsgov/mint-app/pkg/authentication"

type UserAccountAndNotifPreferences struct {
	authentication.UserAccount
	UserNotificationPreferenceFlags
}

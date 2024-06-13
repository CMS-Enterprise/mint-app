package models

import (
	"github.com/google/uuid"
	"github.com/samber/lo"
)

type UserAccountNotificationPreferences struct {
	UserID                   uuid.UUID                       `db:"id"`
	Username                 string                          `db:"username"`
	Email                    string                          `db:"email"`
	NewModelPlanNotification UserNotificationPreferenceFlags `db:"new_model_plan"`
}

func FilterNotificationPreferences(notifPreferences []*UserAccountNotificationPreferences) (
	emailPreferences []*UserAccountNotificationPreferences,
	inAppPreferences []*UserAccountNotificationPreferences,
) {
	emailPreferences = lo.Filter(notifPreferences, func(pref *UserAccountNotificationPreferences, _ int) bool {
		return lo.Contains(pref.NewModelPlanNotification, "EMAIL")
	})

	inAppPreferences = lo.Filter(notifPreferences, func(pref *UserAccountNotificationPreferences, _ int) bool {
		return lo.Contains(pref.NewModelPlanNotification, "IN_APP")
	})

	return emailPreferences, inAppPreferences
}

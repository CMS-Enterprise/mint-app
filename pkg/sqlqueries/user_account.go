package sqlqueries

import _ "embed"

//go:embed SQL/user_account/get_by_username.sql
var userAccountGetByUsername string

//go:embed SQL/user_account/get_by_id.sql
var userAccountGetByID string

//go:embed SQL/user_account/get_by_id_LOADER.sql
var userAccountGetByIDLOADER string

//go:embed SQL/user_account/insert_by_username.sql
var userAccountInsertByUsername string

//go:embed SQL/user_account/update_by_username.sql
var userAccountUpdateByUsername string

//go:embed SQL/user_account/get_notification_preferences_new_model_plan.sql
var userNotificationPreferencesNewModelPlan string

//go:embed SQL/user_account/get_notification_recipients_dates_changed.sql
var userAccountGetNotificationRecipientsDatesChanged string

//go:embed SQL/user_account/get_notification_preferences_data_exchange_approach_marked_complete.sql
var userAccountGetNotificationPreferencesDataExchangeApproachMarkedComplete string

type userAccountScripts struct {
	GetByUsername                                                string
	GetByID                                                      string
	GetByIDLOADER                                                string
	InsertByUsername                                             string
	UpdateByUsername                                             string
	GetNotificationPreferencesNewModelPlan                       string
	GetNotificationRecipientsDatesChanged                        string
	GetNotificationPreferencesDataExchangeApproachMarkedComplete string
}

// UserAccount houses all the sql for getting data for user account from the database
var UserAccount = userAccountScripts{
	GetByUsername:                          userAccountGetByUsername,
	GetByID:                                userAccountGetByID,
	GetByIDLOADER:                          userAccountGetByIDLOADER,
	InsertByUsername:                       userAccountInsertByUsername,
	UpdateByUsername:                       userAccountUpdateByUsername,
	GetNotificationPreferencesNewModelPlan: userNotificationPreferencesNewModelPlan,
	GetNotificationRecipientsDatesChanged:  userAccountGetNotificationRecipientsDatesChanged,
	GetNotificationPreferencesDataExchangeApproachMarkedComplete: userAccountGetNotificationPreferencesDataExchangeApproachMarkedComplete,
}

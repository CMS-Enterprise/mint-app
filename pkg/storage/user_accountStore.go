package storage

import (
	_ "embed"

	"github.com/cmsgov/mint-app/pkg/models"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

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

// UserAccountGetByUsername gets a user account by a give username
func UserAccountGetByUsername(np sqlutils.NamedPreparer, username string) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	stmt, err := np.PrepareNamed(userAccountGetByUsername)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"username": username,
	}

	err = stmt.Get(user, arg)
	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}

// UserAccountGetByID gets a User account from the database by its internal id.
func UserAccountGetByID(np sqlutils.NamedPreparer, id uuid.UUID) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	stmt, err := np.PrepareNamed(userAccountGetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"id": id,
	}

	err = stmt.Get(user, arg)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UserAccountGetByIDLOADER gets multiple User account from the database by its internal id.
func (s *Store) UserAccountGetByIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*authentication.UserAccount, error) {

	var userSlice []*authentication.UserAccount

	stmt, err := s.db.PrepareNamed(userAccountGetByIDLOADER)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&userSlice, arg)
	if err != nil {
		return nil, err
	}

	return userSlice, nil
}

// UserAccountNotificationPreferencesNewModelPlan gets the notification
// preferences for a new model plan for a slice of users who have at least one
// enabled preference
func (s *Store) UserAccountNotificationPreferencesNewModelPlan(np sqlutils.NamedPreparer) (
	[]*models.UserAccountNotificationPreferences,
	error,
) {

	var userNotificationPreferences []*models.UserAccountNotificationPreferences

	stmt, err := np.PrepareNamed(userNotificationPreferencesNewModelPlan)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Select(&userNotificationPreferences, map[string]interface{}{})
	if err != nil {
		return nil, err
	}

	return userNotificationPreferences, nil
}

// UserAccountInsertByUsername creates a new user account for a given username
func UserAccountInsertByUsername(np sqlutils.NamedPreparer, userAccount *authentication.UserAccount) (*authentication.UserAccount, error) {

	user := &authentication.UserAccount{}
	if userAccount.ID == uuid.Nil {
		userAccount.ID = uuid.New()
	}

	stmt, err := np.PrepareNamed(userAccountInsertByUsername)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(user, userAccount)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UserAccountUpdateByUserName updates an existing user account for a given username
func UserAccountUpdateByUserName(np sqlutils.NamedPreparer, userAccount *authentication.UserAccount) (
	*authentication.UserAccount,
	error,
) {

	user := &authentication.UserAccount{}
	if userAccount.ID == uuid.Nil {
		userAccount.ID = uuid.New()
	}

	stmt, err := np.PrepareNamed(userAccountUpdateByUsername)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(user, userAccount)
	if err != nil {
		return nil, err
	}

	return user, nil
}

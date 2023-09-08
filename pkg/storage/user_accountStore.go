package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
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

// UserAccountGetByUsername gets a user account by a give username
func (s *Store) UserAccountGetByUsername(username string) (*authentication.UserAccount, error) {

	user := &authentication.UserAccount{}
	arg := map[string]interface{}{
		"username": username,
	}

	err := s.db.Get(user, userAccountGetByUsername, arg)
	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}

// UserAccountGetByID gets a User account from the database by it's internal id.
func (s *Store) UserAccountGetByID(id uuid.UUID) (*authentication.UserAccount, error) {

	user := &authentication.UserAccount{}
	arg := map[string]interface{}{
		"id": id,
	}

	err := s.db.Get(user, userAccountGetByID, arg)
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
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err := s.db.Select(&userSlice, userAccountGetByIDLOADER, arg)
	if err != nil {
		return nil, err
	}

	return userSlice, nil
}

// UserAccountInsertByUsername creates a new user account for a given EUAID
func (s *Store) UserAccountInsertByUsername(userAccount *authentication.UserAccount) (
	*authentication.UserAccount,
	error,
) {

	user := &authentication.UserAccount{}
	if userAccount.ID == uuid.Nil {
		userAccount.ID = uuid.New()
	}

	err := s.db.Get(user, userAccountInsertByUsername, userAccount)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UserAccountUpdateByUserName updates an existing user account for a given username
func (s *Store) UserAccountUpdateByUserName(userAccount *authentication.UserAccount) (
	*authentication.UserAccount,
	error,
) {

	user := &authentication.UserAccount{}
	if userAccount.ID == uuid.Nil {
		userAccount.ID = uuid.New()
	}

	err := s.db.Get(user, userAccountUpdateByUsername, userAccount)
	if err != nil {
		return nil, err
	}

	return user, nil
}

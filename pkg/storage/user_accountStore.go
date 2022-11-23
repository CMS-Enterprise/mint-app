package storage

import (
	_ "embed"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

//go:embed SQL/user_account_get_by_username.sql
var userAccountGetByUsername string

//go:embed SQL/user_account_insert_by_username.sql
var userAccountInsertByUsername string

// UserAccountGetByUsername reads information about a model plan's clearance
func (s *Store) UserAccountGetByUsername(username string) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	statement, err := s.db.PrepareNamed(userAccountGetByUsername)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"username": username,
	}

	err = statement.Get(user, arg)

	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return user, nil
	// TODO work in progress
}

// UserAccountInsertByUsername creates a new user account for a given EUAID
func (s *Store) UserAccountInsertByUsername(userAccount *authentication.UserAccount) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	if userAccount.ID == uuid.Nil {
		userAccount.ID = uuid.New()
	}

	statement, err := s.db.PrepareNamed(userAccountInsertByUsername)
	if err != nil {
		return nil, err
	}

	err = statement.Get(user, userAccount)

	if err != nil {
		return nil, err
	}

	return user, nil
	// TODO work in progress
}

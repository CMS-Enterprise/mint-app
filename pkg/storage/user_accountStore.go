package storage

import (
	_ "embed"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

//go:embed SQL/user_account_get_by_euaid.sql
var userAccountGetByEUAID string

//go:embed SQL/user_account_insert_by_euaid.sql
var userAccountInsertByEUAID string

// UserAccountGetByEUAID reads information about a model plan's clearance
func (s *Store) UserAccountGetByEUAID(euaID string) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	statement, err := s.db.PrepareNamed(userAccountGetByEUAID)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"eua_id": euaID,
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

// UserAccountInsertByEUAID creates a new user account for a given EUAID
func (s *Store) UserAccountInsertByEUAID(userAccount *authentication.UserAccount) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	if userAccount.ID == uuid.Nil {
		userAccount.ID = uuid.New()
	}

	statement, err := s.db.PrepareNamed(userAccountInsertByEUAID)
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

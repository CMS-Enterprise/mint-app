package storage

import (
	_ "embed"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

//go:embed SQL/user_account_get_by_euaid.sql
var userAccountGetByEUAID string

// UserAccountGetByEUAID reads information about a model plan's clearance
func (s *Store) UserAccountGetByEUAID(logger *zap.Logger, euaID string) (*models.UserAccount, error) {
	user := &models.UserAccount{}

	statement, err := s.db.PrepareNamed(userAccountGetByEUAID)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"eua_id": euaID,
	}

	err = statement.Get(user, arg)

	if err != nil {
		return nil, err
	}

	return user, nil
	// TODO work in progress
}

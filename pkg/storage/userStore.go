package storage

import (
	_ "embed"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

//go:embed SQL/user_get_by_euaid.sql
var userGetByEUAID string

// ReadyForClearanceGetByModelPlanID reads information about a model plan's clearance
func (s *Store) UserGetByEUAID(logger *zap.Logger, euaID string) (*models.User, error) {
	user := &models.User{}

	statement, err := s.db.PrepareNamed(userGetByEUAID)
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

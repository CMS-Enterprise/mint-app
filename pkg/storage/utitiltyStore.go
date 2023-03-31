package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

//go:embed SQL/utility/set_session_current_user.sql
var setSessionCurrentUserSQL string

// setCurrentSessionUserVariable sets the userID for
func setCurrentSessionUserVariable(tx *sqlx.Tx, userID uuid.UUID) error {
	argsUser := map[string]interface{}{
		"user_id": userID.String(),
	}

	_, err := tx.NamedExec(setSessionCurrentUserSQL, argsUser)
	if err != nil {
		return err
	}
	return nil
}

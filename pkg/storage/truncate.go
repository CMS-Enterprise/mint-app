package storage

import (
	"go.uber.org/zap"
)

// TruncateAllTablesDANGEROUS is a function to reset all tables in the DB. It should only be called within test code.
func (s *Store) TruncateAllTablesDANGEROUS(logger *zap.Logger) error {
	tables := `
    model_plan,
    plan_collaborator,
    plan_discussion,
	discussion_reply,
    plan_basics,
    plan_milestones,
    plan_document
	`

	_, err := s.db.Exec("TRUNCATE " + tables)
	if err != nil {
		return err
	}

	return nil
}

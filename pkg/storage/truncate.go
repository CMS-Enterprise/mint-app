package storage

import (
	"go.uber.org/zap"
)

// TruncateAllTablesDANGEROUS is a function to reset all tables in the DB. It should only be called within test code.
func (s *Store) TruncateAllTablesDANGEROUS(logger *zap.Logger) error {
	tables := `
    discussion_reply,
    plan_basics,
    plan_collaborator,
    plan_discussion,
    plan_document,
    plan_milestones,
    plan_general_characteristics,
	plan_beneficiaries,
	plan_participants_and_providers,
    model_plan
	`

	_, err := s.db.Exec("TRUNCATE " + tables)
	if err != nil {
		return err
	}

	return nil
}

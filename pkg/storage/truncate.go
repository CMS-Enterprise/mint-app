package storage

import (
	"go.uber.org/zap"
)

// TruncateAllTablesDANGEROUS is a function to reset all tables in the DB. It should only be called within test code.
func (s *Store) TruncateAllTablesDANGEROUS(logger *zap.Logger) error {
	tables := `
	nda_agreement,
    discussion_reply,
    plan_basics,
    plan_collaborator,
    plan_discussion,
    plan_document,
    plan_general_characteristics,
	plan_beneficiaries,
	plan_participants_and_providers,
	plan_ops_eval_and_learning,
	plan_payments,
	plan_it_tools,
	plan_favorite,
	plan_cr_tdl,
    operational_solution,
    operational_need,
    model_plan
	`

	_, err := s.db.Exec("TRUNCATE " + tables)
	if err != nil {
		return err
	}

	return nil
}

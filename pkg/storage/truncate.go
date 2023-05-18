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
    plan_document_solution_link,
    plan_document,
    plan_general_characteristics,
    plan_beneficiaries,
    plan_participants_and_providers,
    plan_ops_eval_and_learning,
    plan_payments,
    plan_favorite,
    plan_cr_tdl,
	operational_solution_subtask,
    operational_solution,
    operational_need,
    analyzed_audit,
	existing_model_link,
    model_plan,
    audit.change
	,

	analyzed_audit_history,
	discussion_reply_history,
	existing_model_history,
	model_plan_history,
	nda_agreement_history,
	operational_need_history,
	operational_solution_history,
	operational_solution_subtask_history,
	plan_basics_history,
	plan_beneficiaries_history,
	plan_collaborator_history,
	plan_cr_tdl_history,
	plan_discussion_history,
	plan_document_history,
	plan_document_solution_link_history,
	plan_favorite_history,
	plan_general_characteristics_history,
	plan_ops_eval_and_learning_history,
	plan_participants_and_providers_history,
	plan_payments_history,
	possible_need_solution_link_history,
	possible_operational_need_history,
	possible_operational_solution_history,
	user_account_history


	`

	_, err := s.db.Exec("TRUNCATE " + tables)
	if err != nil {
		return err
	}
	err = removeNonSystemAccounts(s)
	if err != nil {
		return err
	}

	return nil
}

func removeNonSystemAccounts(s *Store) error {

	script := `DELETE FROM user_account
    WHERE username NOT IN
    `
	systemAccounts := "( 'UNKNOWN_USER','MINT_SYSTEM')"
	_, err := s.db.Exec(script + systemAccounts)
	if err != nil {
		return err
	}
	return nil

}

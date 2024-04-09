package storage

import (
	"fmt"

	"go.uber.org/zap"
)

// TruncateAllTablesDANGEROUS is a function to reset all tables in the DB. It should only be called within test code.
func (s *Store) TruncateAllTablesDANGEROUS(logger *zap.Logger) error {
	tables := `
	tag,
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
    plan_cr,
    plan_tdl,
	operational_solution_subtask,
    operational_solution,
    operational_need,
    analyzed_audit,
	existing_model_link,
    model_plan,
	user_notification,
	activity,
	translated_audit_field,
	translated_audit_change,
	audit.change
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

	scriptPreferences := `DELETE FROM user_notification_preferences
               WHERE user_id IN (
                   SELECT id
                   FROM user_account
                   WHERE username NOT IN %s
               );`

	scriptUser := `DELETE FROM user_account 
					WHERE username NOT IN %s;`

	systemAccounts := "( 'UNKNOWN_USER','MINT_SYSTEM')"

	_, err := s.db.Exec(fmt.Sprintf(scriptPreferences, systemAccounts))
	if err != nil {
		return err
	}
	_, err = s.db.Exec(fmt.Sprintf(scriptUser, systemAccounts))
	if err != nil {
		return err
	}

	return nil

}

package storage

import (
	"fmt"
	"strings"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TruncateAllTablesDANGEROUS is a function to reset all tables in the DB. It should only be called within test code.
func (s *Store) TruncateAllTablesDANGEROUS(logger *zap.Logger) error {
	// Using table names as constants defined in this file for better maintainability
	tables := []string{
		string(models.TNMTOCommonSolutionSystemOwner),
		string(models.TNMTOCommonSolutionContact),
		string(models.TNMTOCommonSolutionContractor),
		string(models.TNTag),
		string(models.TNNdaAgreement),
		string(models.TNDiscussionReply),
		string(models.TNPlanBasics),
		string(models.TNPlanCollaborator),
		string(models.TNPlanDataExchangeApproach),
		string(models.TNPlanDiscussion),
		string(models.TNPlanDocumentSolutionLink),
		string(models.TNPlanDocument),
		string(models.TNPlanGeneralCharacteristics),
		string(models.TNPlanBeneficiaries),
		string(models.TNPlanParticipantsAndProviders),
		string(models.TNPlanOpsEvalAndLearning),
		string(models.TNPlanPayments),
		string(models.TNPlanTimeline),
		string(models.TNPlanFavorite),
		string(models.TNPlanCr),
		string(models.TNPlanTdl),
		string(models.TNOperationalSolutionSubtask),
		string(models.TNOperationalSolution),
		string(models.TNOperationalNeed),
		string(models.TNAnalyzedAudit),
		string(models.TNExistingModelLink),
		string(models.TNMTOCategory),
		string(models.TNMTOSuggestedMilestone),
		string(models.TNMTOMilestoneNote),
		string(models.TNMTOMilestone),
		string(models.TNMTOSolution),
		string(models.TNMTOMilestoneSolutionLink),
		string(models.TNMTOInfo),
		string(models.TNModelPlanMTOTemplateLink),
		string(models.TNModelPlan),
		string(models.TNUserNotification),
		string(models.TNActivity),
		string(models.TNUserViewCustomization),
		string(models.TNTranslatedAuditField),
		string(models.TNTranslatedAuditQueue),
		string(models.TNTranslatedAudit),
		"audit.change",
	}

	// Join table names for the TRUNCATE statement
	tablesStr := strings.Join(tables, ", ")

	_, err := s.db.Exec("TRUNCATE " + tablesStr)
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

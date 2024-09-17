package resolvers

import (
	"context"
	"log"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/constants"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// AnalyzeModelPlanForAnalyzedAudit analyzes a model plan based on a specific day.
// it analyzes all desired sections and stores the result to the database
func AnalyzeModelPlanForAnalyzedAudit(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	dayToAnalyze time.Time,
	modelPlanID uuid.UUID,
) (*models.AnalyzedAudit, error) {

	logger.Info("fetching model plan")
	mp, err := store.ModelPlanGetByID(store, logger, modelPlanID)
	if err != nil {
		return nil, err
	}

	logger.Info("returning audit change collection")
	audits, err := store.AuditChangeCollectionByPrimaryKeyOrForeignKeyAndDate(logger, mp.ID, mp.ID, dayToAnalyze, models.SortDesc)
	if err != nil {
		return nil, err
	}

	logger.Info("generating changes from returned audits")
	analyzedAuditChange, err := generateChanges(audits, store)
	if err != nil {
		return nil, err
	}

	// Don't create if there are no changes
	if analyzedAuditChange.IsEmpty() {
		logger.Info("model has no changes, not generating an analyzed audit")
		return nil, nil
	}

	logger.Info("constructing analyzed audit struct")
	analyzedAudit, err := models.NewAnalyzedAudit(constants.GetSystemAccountUUID(), mp.ID, mp.ModelName, dayToAnalyze, *analyzedAuditChange)
	if err != nil {
		return nil, err
	}

	logger.Info("saving analyzed audit to the database")
	retAnalyzedAudit, err := store.AnalyzedAuditCreate(logger, analyzedAudit)

	if err != nil {
		return nil, err
	}
	return retAnalyzedAudit, nil

}

/*
##############################
# AnalyzedAudit Jobs Helpers #
##############################
*/

// generateChanges gets all the audit changes for the specified tables
func generateChanges(audits []*models.AuditChange, store *storage.Store) (*models.AnalyzedAuditChange, error) {

	modelPlanAudits, err := analyzeModelPlanAudits(audits)
	if err != nil {
		return nil, err
	}

	documentsAudits, err := analyzeDocumentsAudits(audits)
	if err != nil {
		return nil, err
	}

	crTdlAudits, err := analyzeCrTdlAudits(audits)
	if err != nil {
		return nil, err
	}

	modelLeadAudits, err := analyzeModelLeads(audits, store)
	if err != nil {
		return nil, err
	}

	discussionAudits, err := analyzeDiscussionAudits(audits)
	if err != nil {
		return nil, err
	}

	sectionsAudits, err := analyzeSectionsAudits(audits)
	if err != nil {
		return nil, err
	}

	analyzedModelPlan := models.AnalyzedAuditChange{
		ModelPlan:       modelPlanAudits,
		Documents:       documentsAudits,
		CrTdls:          crTdlAudits,
		PlanSections:    sectionsAudits,
		ModelLeads:      modelLeadAudits,
		PlanDiscussions: discussionAudits,
	}

	return &analyzedModelPlan, nil
}

// analyzeModelPlanAudits analyzes all the model plan name changes and status changes
func analyzeModelPlanAudits(audits []*models.AuditChange) (*models.AnalyzedModelPlan, error) {

	filteredAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "model_plan"
	})

	nameChangeAudits := lo.Filter(filteredAudits, func(m *models.AuditChange, index int) bool {
		keys := lo.Keys(m.Fields)
		return lo.Contains(keys, "model_name")
	})

	var oldNameAuditField string

	if len(nameChangeAudits) > 0 && nameChangeAudits[0].Fields["model_name"].Old != nil {
		oldNameAuditField = nameChangeAudits[0].Fields["model_name"].Old.(string)
	}

	statuses := []string{
		string(models.ModelStatusPlanComplete),
		string(models.ModelStatusIcipComplete),
		string(models.ModelStatusInternalCmmiClearance),
		string(models.ModelStatusCmsClearance),
		string(models.ModelStatusHhsClearance),
		string(models.ModelStatusOmbAsrfClearance),
		string(models.ModelStatusCleared),
		string(models.ModelStatusAnnounced),
	}

	statusChangeAudits := lo.FilterMap(filteredAudits, func(m *models.AuditChange, index int) (string, bool) {
		keys := lo.Keys(m.Fields)
		if lo.Contains(keys, "status") {
			status := m.Fields["status"].New.(string)
			if lo.Contains(statuses, status) {
				return status, true
			}
		}
		return "", false
	})

	analyzedModelPlan := models.AnalyzedModelPlan{
		OldName:       oldNameAuditField,
		StatusChanges: statusChangeAudits,
	}

	if analyzedModelPlan.IsEmpty() {
		return nil, nil
	}

	return &analyzedModelPlan, nil
}

// analyzeCrTdlAudits analyzes if there were any CrTdl changes
func analyzeCrTdlAudits(audits []*models.AuditChange) (*models.AnalyzedCrTdls, error) {
	filteredAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_tdl" || m.TableName == "plan_cr"
	})

	if len(filteredAudits) > 0 {
		return &models.AnalyzedCrTdls{
			Activity: true,
		}, nil
	}
	return nil, nil
}

// analyzeModelLeads analyzes new collaborators to a model plan
func analyzeModelLeads(audits []*models.AuditChange, store *storage.Store) (*models.AnalyzedModelLeads, error) {
	filteredAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_collaborator"
	})
	var parseError error

	addedCollaborators := lo.FilterMap(filteredAudits, func(m *models.AuditChange, index int) (models.AnalyzedModelLeadInfo, bool) {
		keys := lo.Keys(m.Fields)

		teamRolesRaw, ok := m.Fields["team_roles"].New.(string)
		teamRolesRaw = strings.TrimPrefix(teamRolesRaw, "{")
		teamRolesRaw = strings.TrimSuffix(teamRolesRaw, "}")

		teamRoles := strings.Split(teamRolesRaw, ",")

		if !ok {
			log.Printf("Warning: team_roles is not of type string in audit entry number %d. It is of type %T", index, m.Fields["team_roles"].New)
			return models.AnalyzedModelLeadInfo{}, false
		}

		if lo.Contains(keys, "user_id") && lo.Contains(keys, "team_roles") && lo.Contains(teamRoles, "MODEL_LEAD") {
			idString := m.Fields["user_id"].New.(string)
			var id uuid.UUID
			id, parseError = uuid.Parse(idString)
			if parseError != nil {
				log.Printf("Error: Failed to parse UUID in audit entry number %d with error: %v", index, parseError)
				return models.AnalyzedModelLeadInfo{}, false
			}

			account, _ := storage.UserAccountGetByID(store, id) //TODO should we handle the error? I think null is ok if can't get the account

			return models.AnalyzedModelLeadInfo{
				ID:         id,
				CommonName: account.CommonName,
			}, true
		}
		return models.AnalyzedModelLeadInfo{}, false
	})
	if parseError != nil {
		return nil, parseError
	}

	if len(addedCollaborators) > 0 {
		return &models.AnalyzedModelLeads{
			Added: addedCollaborators,
		}, nil
	}

	return nil, nil
}

// analyzeDiscussionAudits analyzes if there was discussion activity on a model plan
func analyzeDiscussionAudits(audits []*models.AuditChange) (*models.AnalyzedPlanDiscussions, error) {
	filteredAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_discussion"
	})

	if len(filteredAudits) > 0 {
		return &models.AnalyzedPlanDiscussions{
			Activity: true,
		}, nil
	}
	return nil, nil

}

// analyzeDocumentsAudits analyzes how many documents had activity
func analyzeDocumentsAudits(audits []*models.AuditChange) (*models.AnalyzedDocuments, error) {
	filteredAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_document"
	})

	if len(filteredAudits) > 0 {
		return &models.AnalyzedDocuments{
			Count: len(filteredAudits),
		}, nil
	}

	return nil, nil
}

// analyzeSectionsAudits analyzes which sections had updates and status changes to READY_FOR_REVIEW or READY_FOR_CLEARANCE
func analyzeSectionsAudits(audits []*models.AuditChange) (*models.AnalyzedPlanSections, error) {
	sections := []models.TableName{
		models.TNPlanBasics,
		models.TNPlanGeneralCharacteristics,
		models.TNPlanParticipantsAndProviders,
		models.TNPlanBeneficiaries,
		models.TNPlanOpsEvalAndLearning,
		models.TNPlanPayments,
	}
	filteredAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return lo.Contains(sections, m.TableName)
	})

	updatedSections := lo.Uniq(lo.Map(filteredAudits, func(m *models.AuditChange, index int) models.TableName {
		return m.TableName
	}))

	readyForReview := lo.Uniq(lo.FilterMap(filteredAudits, func(m *models.AuditChange, index int) (models.TableName, bool) {
		keys := lo.Keys(m.Fields)
		if lo.Contains(keys, "status") {
			if m.Fields["status"].New.(string) == "READY_FOR_REVIEW" {
				return m.TableName, true
			}
		}
		return "", false
	}))

	readyForClearance := lo.Uniq(lo.FilterMap(filteredAudits, func(m *models.AuditChange, index int) (models.TableName, bool) {
		keys := lo.Keys(m.Fields)
		if lo.Contains(keys, "status") {
			if m.Fields["status"].New.(string) == "READY_FOR_CLEARANCE" {
				return m.TableName, true
			}
		}
		return "", false
	}))

	analyzedPlanSections := models.AnalyzedPlanSections{
		Updated:           updatedSections,
		ReadyForReview:    readyForReview,
		ReadyForClearance: readyForClearance,
	}

	if analyzedPlanSections.IsEmpty() {
		return nil, nil
	}

	return &analyzedPlanSections, nil
}

// AnalyzedAuditGetByModelPlanIDsAndDate returns all AnalyzedAudits for a specific date and collection of model plan ids.
// When possible, the data loader version of this script should be favored.
func AnalyzedAuditGetByModelPlanIDsAndDate(
	_ context.Context,
	store *storage.Store,
	logger *zap.Logger,

	modelPlanIDs []uuid.UUID,
	date time.Time,
) ([]*models.AnalyzedAudit, error) {

	return storage.AnalyzedAuditGetByModelPlanIDsAndDate(store, logger, modelPlanIDs, date)

}

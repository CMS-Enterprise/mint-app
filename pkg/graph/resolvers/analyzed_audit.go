package resolvers

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/constants"
	"github.com/cms-enterprise/mint-app/pkg/logging"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// AnalyzeModelPlanForAnalyzedAudit analyzes a model plan based on a specific day.
// it analyzes all desired sections and stores the result to the database
func AnalyzeModelPlanForAnalyzedAudit[T logging.ChainableErrorOrWarnLogger[T]](
	ctx context.Context,
	store *storage.Store,
	logger T,
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
	analyzedAuditChange, err := generateChanges(audits, store, logger)
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
func generateChanges[T logging.ChainableErrorOrWarnLogger[T]](audits []*models.AuditChange, store *storage.Store, logger T) (*models.AnalyzedAuditChange, error) {

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

	modelLeadAudits, err := analyzeModelLeads(audits, store, logger)
	if err != nil {
		return nil, err
	}

	discussionAudits, err := analyzeDiscussionAudits(audits)
	if err != nil {
		return nil, err
	}

	sectionsAudits, err := analyzeSectionsAudits(audits, logger)
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

	filteredAudits := lo.Filter(audits, func(audit *models.AuditChange, index int) bool {
		return audit.TableName == "model_plan"
	})

	nameChangeAudits := lo.Filter(filteredAudits, func(audit *models.AuditChange, index int) bool {
		keys := lo.Keys(audit.Fields)
		return lo.Contains(keys, "model_name")
	})

	var oldNameAuditField string

	if len(nameChangeAudits) > 0 {
		if modelNameField, hasModelName := nameChangeAudits[0].Fields["model_name"]; hasModelName && modelNameField.Old != nil {
			if oldName, ok := modelNameField.Old.(string); ok {
				oldNameAuditField = oldName
			}
		}
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
		string(models.ModelStatusActive),
		string(models.ModelStatusEnded),
		string(models.ModelStatusPaused),
		string(models.ModelStatusCanceled),
	}

	statusChangeAudits := lo.FilterMap(filteredAudits, func(audit *models.AuditChange, index int) (string, bool) {
		keys := lo.Keys(audit.Fields)
		if lo.Contains(keys, "status") {
			statusField, hasStatus := audit.Fields["status"]
			if hasStatus && statusField.New != nil {
				status, ok := statusField.New.(string)
				if ok && lo.Contains(statuses, status) {
					return status, true
				}
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
	filteredAudits := lo.Filter(audits, func(audit *models.AuditChange, index int) bool {
		return audit.TableName == "plan_tdl" || audit.TableName == "plan_cr"
	})

	if len(filteredAudits) > 0 {
		return &models.AnalyzedCrTdls{
			Activity: true,
		}, nil
	}
	return nil, nil
}

// analyzeModelLeads analyzes new collaborators to a model plan
func analyzeModelLeads[T logging.ChainableErrorOrWarnLogger[T]](audits []*models.AuditChange, store *storage.Store, logger T) (*models.AnalyzedModelLeads, error) {
	filteredAudits := lo.Filter(audits, func(audit *models.AuditChange, index int) bool {
		return audit.TableName == "plan_collaborator"
	})
	var parseError error

	addedCollaborators := lo.FilterMap(filteredAudits, func(audit *models.AuditChange, index int) (models.AnalyzedModelLeadInfo, bool) {
		keys := lo.Keys(audit.Fields)

		teamRolesField, hasTeamRoles := audit.Fields["team_roles"]
		if !hasTeamRoles || teamRolesField.New == nil {
			logger.Warn("team_roles field is missing or nil in audit entry", zap.Int("index", index))
			return models.AnalyzedModelLeadInfo{}, false
		}

		teamRolesRaw, ok := teamRolesField.New.(string)
		if !ok {
			logger.Warn("team_roles is not of type string in audit entry", zap.Int("index", index), zap.String("type", fmt.Sprintf("%T", teamRolesField.New)))
			return models.AnalyzedModelLeadInfo{}, false
		}

		teamRolesRaw = strings.TrimPrefix(teamRolesRaw, "{")
		teamRolesRaw = strings.TrimSuffix(teamRolesRaw, "}")

		teamRoles := strings.Split(teamRolesRaw, ",")

		if lo.Contains(keys, "user_id") && lo.Contains(keys, "team_roles") && lo.Contains(teamRoles, "MODEL_LEAD") {
			userIDField, hasUserID := audit.Fields["user_id"]
			if !hasUserID || userIDField.New == nil {
				logger.Warn("user_id field is missing or nil in audit entry", zap.Int("index", index))
				return models.AnalyzedModelLeadInfo{}, false
			}

			idString, ok := userIDField.New.(string)
			if !ok {
				logger.Warn("user_id is not of type string in audit entry", zap.Int("index", index), zap.String("type", fmt.Sprintf("%T", userIDField.New)))
				return models.AnalyzedModelLeadInfo{}, false
			}

			var id uuid.UUID
			id, parseError = uuid.Parse(idString)
			if parseError != nil {
				logger.Error("Failed to parse UUID in audit entry", zap.Int("index", index), zap.Error(parseError))
				return models.AnalyzedModelLeadInfo{}, false
			}

			account, err := storage.UserAccountGetByID(store, id)
			if err != nil {
				logger.Warn("Failed to get user account", zap.String("userID", id.String()), zap.Int("index", index), zap.Error(err))
			}

			var commonName string
			if account != nil {
				commonName = account.CommonName
			}

			return models.AnalyzedModelLeadInfo{
				ID:         id,
				CommonName: commonName,
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
	filteredAudits := lo.Filter(audits, func(audit *models.AuditChange, index int) bool {
		return audit.TableName == "plan_discussion"
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
	filteredAudits := lo.Filter(audits, func(audit *models.AuditChange, index int) bool {
		return audit.TableName == "plan_document"
	})

	if len(filteredAudits) > 0 {
		return &models.AnalyzedDocuments{
			Count: len(filteredAudits),
		}, nil
	}

	return nil, nil
}

// analyzeSectionsAudits analyzes which sections had updates and status changes to READY_FOR_REVIEW or READY_FOR_CLEARANCE
func analyzeSectionsAudits[T logging.ChainableErrorOrWarnLogger[T]](audits []*models.AuditChange, logger T) (*models.AnalyzedPlanSections, error) {
	if audits == nil {
		// We expect that this can get called with nil audits, so we return nil to indicate no changes.
		return nil, nil
	}

	sections := []models.TableName{
		models.TNPlanBasics,
		models.TNPlanGeneralCharacteristics,
		models.TNPlanParticipantsAndProviders,
		models.TNPlanBeneficiaries,
		models.TNPlanOpsEvalAndLearning,
		models.TNPlanPayments,
		models.TNPlanDataExchangeApproach,
		models.TNPlanTimeline,
	}

	sections = append(sections, models.MTOTables...)

	filteredAudits := lo.Filter(audits, func(audit *models.AuditChange, index int) bool {
		return lo.Contains(sections, audit.TableName)
	})

	updatedSections := lo.Uniq(lo.Map(filteredAudits, func(audit *models.AuditChange, index int) models.TableName {
		return audit.TableName
	}))

	readyForReview := lo.Uniq(lo.FilterMap(filteredAudits, func(audit *models.AuditChange, index int) (models.TableName, bool) {
		if audit == nil || audit.Fields == nil {
			logger.Warn("audit or audit.Fields is nil in audit entry", zap.Int("index", index))
			return "", false
		}

		keys := lo.Keys(audit.Fields)
		if lo.Contains(keys, "status") {
			statusField, hasStatus := audit.Fields["status"]
			if hasStatus && statusField.New != nil {
				if statusStr, ok := statusField.New.(string); ok && statusStr == "READY_FOR_REVIEW" {
					return audit.TableName, true
				}
			}
		}
		return "", false
	}))

	readyForClearance := lo.Uniq(lo.FilterMap(filteredAudits, func(auditChange *models.AuditChange, index int) (models.TableName, bool) {
		if auditChange == nil || auditChange.Fields == nil {
			logger.Warn("auditChange or auditChange.Fields is nil in audit entry", zap.Int("index", index))
			return "", false
		}

		keys := lo.Keys(auditChange.Fields)
		if lo.Contains(keys, "status") {
			statusField, hasStatus := auditChange.Fields["status"]
			if hasStatus && statusField.New != nil {
				if statusStr, ok := statusField.New.(string); ok && statusStr == "READY_FOR_CLEARANCE" {
					return auditChange.TableName, true
				}
			}
		}
		return "", false
	}))

	dataExchangeApproachMarkedComplete := lo.FilterMap(filteredAudits, func(audit *models.AuditChange, index int) (models.TableName, bool) {
		if audit == nil || audit.Fields == nil {
			logger.Warn("audit or audit.Fields is nil in audit entry", zap.Int("index", index))
			return "", false
		}

		keys := lo.Keys(audit.Fields)
		if lo.Contains(keys, "status") {
			statusField, hasStatus := audit.Fields["status"]
			if hasStatus && statusField.New != nil {
				if statusStr, ok := statusField.New.(string); ok && statusStr == string(models.DataExchangeApproachStatusComplete) {
					return audit.TableName, true
				}
			}
		}
		return "", false
	})

	iddocQuestionnaireMarkedComplete := lo.FilterMap(filteredAudits, func(audit *models.AuditChange, index int) (models.TableName, bool) {
		if audit == nil || audit.Fields == nil {
			logger.Warn("audit or audit.Fields is nil in audit entry", zap.Int("index", index))
			return "", false
		}

		keys := lo.Keys(audit.Fields)
		if lo.Contains(keys, "status") {
			statusField, hasStatus := audit.Fields["status"]
			if hasStatus && statusField.New != nil {
				if statusStr, ok := statusField.New.(string); ok && statusStr == string(models.DataExchangeApproachStatusComplete) {
					return audit.TableName, true
				}
			}
		}
		return "", false
	})

	analyzedPlanSections := models.AnalyzedPlanSections{
		Updated:                            updatedSections,
		ReadyForReview:                     readyForReview,
		ReadyForClearance:                  readyForClearance,
		DataExchangeApproachMarkedComplete: len(dataExchangeApproachMarkedComplete) > 0,
		IDDOCQuestionnaireMarkedComplete:   len(iddocQuestionnaireMarkedComplete) > 0,
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

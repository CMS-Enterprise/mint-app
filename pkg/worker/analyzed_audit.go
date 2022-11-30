package worker

import (
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// AnalyzedAuditJob analyzes the given model and model relations on the specified date
func AnalyzedAuditJob(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) (*models.AnalyzedAudit, error) {
	audits, err := store.AuditChangeCollectionByPrimaryKeyOrForeignKeyAndDate(logger, modelPlanID, modelPlanID, date, models.SortDesc)
	if err != nil {
		return nil, err
	}

	changes, err := GenerateChanges(audits)
	if err != nil {
		return nil, err
	}

	analyzedAudit, err := models.NewAnalyzedAudit("WRKR", modelPlanID, date, *changes)
	if err != nil {
		return nil, err
	}

	_, err = store.AnalyzedAuditCreate(logger, analyzedAudit)
	if err != nil {
		return nil, err
	}
	return analyzedAudit, nil
}

// GenerateChanges gets all the audit changes for the specified tables
func GenerateChanges(audits []*models.AuditChange) (*models.AnalyzedAuditChange, error) {

	modelPlanAudits, err := AnalyzeModelPlanAudits(audits)
	if err != nil {
		return nil, err
	}

	documentsAudits, err := AnalyzeDocumentsAudits(audits)
	if err != nil {
		return nil, err
	}

	crTdlAudits, err := AnalyzeCrTdlAudits(audits)
	if err != nil {
		return nil, err
	}

	colaboratorAudits, err := AnalyzeColaboratorAudits(audits)
	if err != nil {
		return nil, err
	}

	discussionAudits, err := AnalyzeDiscussionAudits(audits)
	if err != nil {
		return nil, err
	}

	sectionsAudits, err := AnalyzeSectionsAudits(audits)
	if err != nil {
		return nil, err
	}

	analyzedModelPlan := models.AnalyzedAuditChange{
		ModelPlan:         modelPlanAudits,
		Documents:         documentsAudits,
		CrTdls:            crTdlAudits,
		PlanSections:      sectionsAudits,
		PlanCollaborators: colaboratorAudits,
		PlanDiscussions:   discussionAudits,
	}

	return &analyzedModelPlan, nil
}

// AnalyzeModelPlanAudits analyzes all the model plan name changes and status changes
func AnalyzeModelPlanAudits(audits []*models.AuditChange) (*models.AnalyzedModelPlan, error) {

	filteredAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "model_plan"
	})

	nameChangeAudits := lo.Filter(filteredAudits, func(m *models.AuditChange, index int) bool {
		keys := lo.Keys(m.Fields)
		return lo.Contains(keys, "model_name")

	})

	var nameChangeAuditField models.AuditField

	if len(nameChangeAudits) > 0 {
		nameChangeAuditField = models.AuditField{
			Old: nameChangeAudits[0].Fields["model_name"].Old,
			New: nameChangeAudits[0].Fields["model_name"].New,
		}
	}

	statusChangeAudits := lo.FilterMap(filteredAudits, func(m *models.AuditChange, index int) (string, bool) {
		keys := lo.Keys(m.Fields)
		if lo.Contains(keys, "status") {
			return m.Fields["status"].New.(string), true
		}
		return "", false
	})

	analyzedModelPlan := models.AnalyzedModelPlan{
		NameChange:    nameChangeAuditField,
		StatusChanges: statusChangeAudits,
	}

	return &analyzedModelPlan, nil
}

// AnalyzeCrTdlAudits analyzes if there were any CrTdl changes
func AnalyzeCrTdlAudits(audits []*models.AuditChange) (*models.AnalyzedCrTdls, error) {
	filteredAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_cr_tdl"
	})

	if len(filteredAudits) > 0 {
		return &models.AnalyzedCrTdls{
			Activity: true,
		}, nil
	}
	return nil, nil
}

// AnalyzeColaboratorAudits analyzes new collaborators to a model plan
func AnalyzeColaboratorAudits(audits []*models.AuditChange) (*models.AnalyzedPlanCollaborators, error) {
	filteredAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_collaborator"
	})

	addedCollaborators := lo.FilterMap(filteredAudits, func(m *models.AuditChange, index int) (string, bool) {
		keys := lo.Keys(m.Fields)
		if lo.Contains(keys, "full_name") {
			return m.Fields["full_name"].New.(string), true
		}
		return "", false
	})

	analyzedPlanColaborators := models.AnalyzedPlanCollaborators{
		Added: addedCollaborators,
	}

	return &analyzedPlanColaborators, nil

}

// AnalyzeDiscussionAudits analyzes if there was discussion activity on a model plan
func AnalyzeDiscussionAudits(audits []*models.AuditChange) (*models.AnalyzedPlanDiscussions, error) {
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

// AnalyzeDocumentsAudits analyzes how many documents had activity
func AnalyzeDocumentsAudits(audits []*models.AuditChange) (*models.AnalyzedDocuments, error) {
	filteredAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_document"
	})

	analyzedDocuments := models.AnalyzedDocuments{
		Count: len(filteredAudits),
	}

	return &analyzedDocuments, nil
}

// AnalyzeSectionsAudits analyzes which sections had updates and status changes to READY_FOR_REVIEW or READY_FOR_CLEARANCE
func AnalyzeSectionsAudits(audits []*models.AuditChange) (*models.AnalyzedPlanSections, error) {
	sections := []string{
		"plan_basics",
		"plan_general_characteristics",
		"plan_participants_and_providers",
		"plan_beneficiaries",
		"plan_ops_eval_and_learning",
		"plan_payments",
	}
	filteredAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return lo.Contains(sections, m.TableName)
	})

	updatedSections := lo.Uniq(lo.Map(filteredAudits, func(m *models.AuditChange, index int) string {
		return m.TableName
	}))

	readyForReview := lo.Uniq(lo.FilterMap(filteredAudits, func(m *models.AuditChange, index int) (string, bool) {
		keys := lo.Keys(m.Fields)
		if lo.Contains(keys, "status") {
			if m.Fields["status"].New.(string) == "READY_FOR_REVIEW" {
				return m.TableName, true
			}
		}
		return "", false
	}))

	readyForClearance := lo.Uniq(lo.FilterMap(filteredAudits, func(m *models.AuditChange, index int) (string, bool) {
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

	return &analyzedPlanSections, nil
}

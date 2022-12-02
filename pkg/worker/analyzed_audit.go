package worker

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
)

// AnalyzedAuditJob analyzes the given model and model relations on the specified date
// args[0] modelPlanID, args[1] date
func (w *Worker) AnalyzedAuditJob(ctx context.Context, args ...interface{}) error {
	audits, err := w.Store.AuditChangeCollectionByPrimaryKeyOrForeignKeyAndDate(w.Logger, args[0].(uuid.UUID), args[0].(uuid.UUID), args[1].(time.Time), models.SortDesc)
	if err != nil {
		return err
	}

	changes, err := GenerateChanges(audits)
	if err != nil {
		return err
	}

	analyzedAudit, err := models.NewAnalyzedAudit("WRKR", args[0].(uuid.UUID), args[1].(time.Time), *changes)
	if err != nil {
		return err
	}

	_, err = w.Store.AnalyzedAuditCreate(w.Logger, analyzedAudit)

	if err != nil {
		return err
	}
	return nil
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

	modelLeadAudits, err := AnalyzeModelLeads(audits)
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
		ModelPlan:       modelPlanAudits,
		Documents:       documentsAudits,
		CrTdls:          crTdlAudits,
		PlanSections:    sectionsAudits,
		ModelLeads:      modelLeadAudits,
		PlanDiscussions: discussionAudits,
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

// AnalyzeModelLeads analyzes new collaborators to a model plan
func AnalyzeModelLeads(audits []*models.AuditChange) (*models.AnalyzedModelLeads, error) {
	filteredAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_collaborator"
	})

	addedCollaborators := lo.FilterMap(filteredAudits, func(m *models.AuditChange, index int) (string, bool) {
		keys := lo.Keys(m.Fields)
		if lo.Contains(keys, "full_name") && lo.Contains(keys, "team_role") && m.Fields["team_role"].New == "MODEL_LEAD" {
			return m.Fields["full_name"].New.(string), true
		}
		return "", false
	})

	analyzedModelLeads := models.AnalyzedModelLeads{
		Added: addedCollaborators,
	}

	return &analyzedModelLeads, nil

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

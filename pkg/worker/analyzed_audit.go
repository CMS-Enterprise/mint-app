package worker

import (
	"context"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"

	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
)

// AnalyzedAuditJob analyzes the given model and model relations on the specified date
// args[0] modelPlanID, args[1] date
func (w *Worker) AnalyzedAuditJob(ctx context.Context, args ...interface{}) error {
	date := args[1].(time.Time)
	modelPlanID := args[0].(uuid.UUID)

	mp, err := w.Store.ModelPlanGetByID(w.Logger, modelPlanID)
	if err != nil {
		return err
	}

	audits, err := w.Store.AuditChangeCollectionByPrimaryKeyOrForeignKeyAndDate(w.Logger, mp.ID, mp.ID, date, models.SortDesc)
	if err != nil {
		return err
	}

	analyzedAuditChange, err := generateChanges(audits)
	if err != nil {
		return err
	}

	// Don't create if there are no changes
	if analyzedAuditChange.IsEmpty() {
		return nil
	}

	analyzedAudit, err := models.NewAnalyzedAudit("WRKR", mp.ID, mp.ModelName, date, *analyzedAuditChange)
	if err != nil {
		return err
	}

	_, err = w.Store.AnalyzedAuditCreate(w.Logger, analyzedAudit)

	if err != nil {
		return err
	}
	return nil
}

// AnalyzedAuditBatchJob batches all the daily AnalyzedAuditJobs. When all are complete it will fire a callback
// args[0] date
func (w *Worker) AnalyzedAuditBatchJob(ctx context.Context, args ...interface{}) error {
	date := args[1].(time.Time)
	helper := faktory_worker.HelperFor(ctx)

	return helper.With(func(cl *faktory.Client) error {
		batch := faktory.NewBatch(cl)
		batch.Description = "Analyze models audits by date"
		batch.Success = faktory.NewJob("AnalyzedAuditBatchJobSuccess", date)

		return nil

	})
}

// AnalyzedAuditBatchJobSuccess is the callback function for AnalyzedAuditBatchJob
// args[0] date
func (w *Worker) AnalyzedAuditBatchJobSuccess(ctx context.Context, args ...interface{}) error {
	return nil
}

// generateChanges gets all the audit changes for the specified tables
func generateChanges(audits []*models.AuditChange) (*models.AnalyzedAuditChange, error) {

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

	modelLeadAudits, err := analyzeModelLeads(audits)
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
		return m.TableName == "plan_cr_tdl"
	})

	if len(filteredAudits) > 0 {
		return &models.AnalyzedCrTdls{
			Activity: true,
		}, nil
	}
	return nil, nil
}

// analyzeModelLeads analyzes new collaborators to a model plan
func analyzeModelLeads(audits []*models.AuditChange) (*models.AnalyzedModelLeads, error) {
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

	if analyzedPlanSections.IsEmpty() {
		return nil, nil
	}

	return &analyzedPlanSections, nil
}

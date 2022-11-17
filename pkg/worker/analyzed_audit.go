package worker

import (
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// NewAnalyzedAuditJob analyzes the given model and model relations on the specified date
func NewAnalyzedAuditJob(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) error {
	audits, err := store.AuditChangeCollectionByForeignKeyAndDate(logger, modelPlanID, date, models.SortDesc)
	if err != nil {
		return err
	}

	changes, err := GenerateChanges(audits, store, date, logger)
	if err != nil {
		return err
	}

	AnalyzedAudit, err := models.NewAnalyzedAudit("Faktory", modelPlanID, date, changes)
	if err != nil {
		return err
	}
	_, err = store.AnalyzedAuditCreate(logger, AnalyzedAudit)
	if err != nil {
		return err
	}
	return nil
}

// GenerateChanges gets all the audit changes for the specified tables
func GenerateChanges(audits []*models.AuditChange, store *storage.Store, date time.Time, logger *zap.Logger) ([]*models.AuditChange, error) {

	tableNames := []string{
		"model_plan",
		"plan_cr_tdl",
		"plan_colaborator",
		"plan_discussion",
		"plan_basics",
		"plan_general_characteristics",
		"plan_participants_and_providers",
		"plan_beneficiaries",
		"plan_ops_eval_and_learning",
		"plan_documents",
		"plan_payments",
	}
	auditChanges := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return lo.Contains(tableNames, m.TableName)
	})

	var allDiscussionReplyAuditChanges []*models.AuditChange
	discussionAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_discussion"
	})

	lo.ForEach(discussionAudits, func(m *models.AuditChange, _ int) {
		replyAuditChanges, err := store.AuditChangeCollectionByForeignKeyAndTableAndDate(logger, "discussion_reply", m.PrimaryKey, date, models.SortDesc)
		if err != nil {
			return
		}
		allDiscussionReplyAuditChanges = append(allDiscussionReplyAuditChanges, replyAuditChanges...)
	})

	return append(auditChanges, allDiscussionReplyAuditChanges...), nil
}

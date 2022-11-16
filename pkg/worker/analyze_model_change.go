package worker

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func NewAnalyzedModelChangeJob(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) {
	changes, err := GenerateChanges(modelPlanID, date, store, logger)
	if err != nil {
		return
	}

	analyzedModelChange, err := models.NewAnalyzedModelChange("Faktory", modelPlanID, date, changes)
	if err != nil {
		return
	}
	store.AnalyzedModelChangeCreate(logger, analyzedModelChange)
}

func GenerateChanges(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) ([]models.Change, error) {
	var changes []models.Change
	modelPlanChanges, err := AnalyzeModelPlanChanges(modelPlanID, date, store, logger)
	if err != nil {
		return nil, err
	}
	changes = append(changes, modelPlanChanges...)

	crTdlChanges, err := AnalyzeCrTdlChanges(modelPlanID, date, store, logger)
	if err != nil {
		return nil, err
	}
	changes = append(changes, crTdlChanges...)

	collaboratorChanges, err := AnalyzeCollaboratorChanges(modelPlanID, date, store, logger)
	if err != nil {
		return nil, err
	}
	changes = append(changes, collaboratorChanges...)

	discussionChanges, err := AnalyzeCollaboratorChanges(modelPlanID, date, store, logger)
	if err != nil {
		return nil, err
	}
	changes = append(changes, discussionChanges...)

	sectionChanges, err := AnalyzeModelPlanSectionChanges(modelPlanID, date, store, logger)
	if err != nil {
		return nil, err
	}
	changes = append(changes, sectionChanges...)

	return changes, nil
}

func AnalyzeModelPlanChanges(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) ([]models.Change, error) {
	var changes []models.Change
	nameChanges, err := store.AuditChangeCollectionByIDAndTableAndFieldAndDate(logger, "model_plan", modelPlanID, "model_name", date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	statusChanges, err := store.AuditChangeCollectionByIDAndTableAndFieldAndDate(logger, "model_plan", modelPlanID, "status", date, models.SortDesc)
	if err != nil {
		return nil, err
	}

	for i := 0; i < len(nameChanges); i++ {
		fields, err := nameChanges[i].Fields.ToInterface()
		if err != nil {
			continue
		}
		change := models.Change{
			Model:    "model_plan",
			Field:    "model_name",
			Action:   "update",
			OldValue: fields["model_name"].(map[string]interface{})["old"].(string),
			NewValue: fields["model_name"].(map[string]interface{})["new"].(string),
		}
		changes = append(changes, change)
	}

	for i := 0; i < len(statusChanges); i++ {
		fields, err := nameChanges[i].Fields.ToInterface()
		if err != nil {
			continue
		}
		change := models.Change{
			Model:    "model_plan",
			Field:    "status",
			Action:   "update",
			OldValue: fields["model_name"].(map[string]interface{})["old"].(string),
			NewValue: fields["model_name"].(map[string]interface{})["new"].(string),
		}
		changes = append(changes, change)
	}

	if err != nil {
		return nil, err
	}
	return changes, nil
}

func AnalyzeCrTdlChanges(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) ([]models.Change, error) {
	var changes []models.Change
	crTdlChanges, err := store.AuditChangeCollectionByForeignKeyAndTableAndDate(logger, "plan_cr_tdl", modelPlanID, date, models.SortDesc)
	if err != nil {
		return nil, err
	}

	if len(crTdlChanges) > 0 {
		change := models.Change{
			Model:    "plan_cr_tdls",
			Field:    "",
			Action:   "update",
			OldValue: "",
			NewValue: "",
		}
		changes = append(changes, change)
	}

	return changes, nil
}

func AnalyzeCollaboratorChanges(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) ([]models.Change, error) {
	var changes []models.Change
	collaboratorChanges, err := store.AuditChangeCollectionByForeignKeyAndTableAndFieldAndDate(logger, "plan_colaborator", modelPlanID, "full_name", date, models.SortDesc)
	if err != nil {
		return nil, err
	}

	for i := 0; i < len(collaboratorChanges); i++ {
		fields, err := collaboratorChanges[i].Fields.ToInterface()
		if err != nil {
			continue
		}
		change := models.Change{
			Model:    "plan_collaborator",
			Field:    "name",
			Action:   "create",
			OldValue: fields["full_name"].(map[string]interface{})["old"].(string),
			NewValue: fields["full_name"].(map[string]interface{})["old"].(string),
		}
		changes = append(changes, change)
	}

	return changes, nil
}

func AnalyzeDiscussionChanges(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) ([]models.Change, error) {
	var changes []models.Change
	planDiscussionChanges, err := store.AuditChangeCollectionByForeignKeyAndTableAndDate(logger, "plan_discussion", modelPlanID, date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	discussionReplyChanges, err := store.DiscussionReplyCollectionByModelPlanAndDateID(logger, modelPlanID, date)
	if err != nil {
		return nil, err
	}

	if len(planDiscussionChanges) > 0 || len(discussionReplyChanges) > 0 {
		change := models.Change{
			Model:    "plan_discussion",
			Field:    "",
			Action:   "update",
			OldValue: "",
			NewValue: "",
		}
		changes = append(changes, change)
	}

	return changes, nil
}

func AnalyzeModelPlanSectionChanges(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) ([]models.Change, error) {
	var changes []models.Change

	// model_basics
	modelBasicsContentAudit, err := store.AuditChangeCollectionByForeignKeyAndTableAndDate(logger, "plan_basics", modelPlanID, date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	changes = append(changes, AddContentChanges(changes, modelBasicsContentAudit, "plan_basics")...)

	modelBasicsStatusAudit, err := store.AuditChangeCollectionByForeignKeyAndTableAndFieldAndDate(logger, "plan_basics", modelPlanID, "status", date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	changes = append(changes, AddStatusChanges(changes, modelBasicsStatusAudit, "plan_basics")...)

	// plan_general_characteristics
	generalCharacteristicsContentAudit, err := store.AuditChangeCollectionByForeignKeyAndTableAndDate(logger, "plan_general_characteristics", modelPlanID, date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	changes = append(changes, AddContentChanges(changes, generalCharacteristicsContentAudit, "plan_general_characteristics")...)

	generalCharacteristicsStatusAudit, err := store.AuditChangeCollectionByForeignKeyAndTableAndFieldAndDate(logger, "plan_general_characteristics", modelPlanID, "status", date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	changes = append(changes, AddStatusChanges(changes, generalCharacteristicsStatusAudit, "plan_general_characteristics")...)

	// plan_participants_and_providers
	participantsContentAudit, err := store.AuditChangeCollectionByForeignKeyAndTableAndDate(logger, "plan_participants_and_providers", modelPlanID, date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	changes = append(changes, AddContentChanges(changes, participantsContentAudit, "plan_participants_and_providers")...)

	participantsStatusAudit, err := store.AuditChangeCollectionByForeignKeyAndTableAndFieldAndDate(logger, "plan_participants_and_providers", modelPlanID, "status", date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	changes = append(changes, AddStatusChanges(changes, participantsStatusAudit, "plan_participants_and_providers")...)

	// plan_beneficiaries
	beneficiariesContentAudit, err := store.AuditChangeCollectionByForeignKeyAndTableAndDate(logger, "plan_beneficiaries", modelPlanID, date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	changes = append(changes, AddContentChanges(changes, beneficiariesContentAudit, "plan_beneficiaries")...)

	beneficiariesStatusAudit, err := store.AuditChangeCollectionByForeignKeyAndTableAndFieldAndDate(logger, "plan_beneficiaries", modelPlanID, "status", date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	changes = append(changes, AddStatusChanges(changes, beneficiariesStatusAudit, "plan_beneficiaries")...)

	// ops_eval
	opsContentAudit, err := store.AuditChangeCollectionByForeignKeyAndTableAndDate(logger, "plan_ops_eval_and_learning", modelPlanID, date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	changes = append(changes, AddContentChanges(changes, opsContentAudit, "plan_ops_eval_and_learning")...)

	opsStatusAudit, err := store.AuditChangeCollectionByForeignKeyAndTableAndFieldAndDate(logger, "plan_ops_eval_and_learning", modelPlanID, "status", date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	changes = append(changes, AddStatusChanges(changes, opsStatusAudit, "plan_ops_eval_and_learning")...)

	// payments
	paymentsContentAudit, err := store.AuditChangeCollectionByForeignKeyAndTableAndDate(logger, "plan_payments", modelPlanID, date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	changes = append(changes, AddContentChanges(changes, paymentsContentAudit, "plan_payments")...)

	paymentsStatusAudit, err := store.AuditChangeCollectionByForeignKeyAndTableAndFieldAndDate(logger, "plan_payments", modelPlanID, "status", date, models.SortDesc)
	if err != nil {
		return nil, err
	}
	changes = append(changes, AddStatusChanges(changes, paymentsStatusAudit, "plan_payments")...)

	return changes, err
}

func AddContentChanges(changesSlice []models.Change, auditChange []*models.AuditChange, modelName string) []models.Change {
	if len(auditChange) > 0 {
		change := models.Change{
			Model:    modelName,
			Field:    "",
			Action:   "update",
			OldValue: "",
			NewValue: "",
		}
		changesSlice = append(changesSlice, change)
	}
	return changesSlice
}

func AddStatusChanges(changesSlice []models.Change, auditChange []*models.AuditChange, modelName string) []models.Change {

	for i := 0; i < len(auditChange); i++ {
		fields, err := auditChange[i].Fields.ToInterface()
		if err != nil {
			continue
		}
		change := models.Change{
			Model:    modelName,
			Field:    "status",
			Action:   "update",
			OldValue: fields["status"].(map[string]interface{})["old"].(string),
			NewValue: fields["status"].(map[string]interface{})["new"].(string),
		}
		changesSlice = append(changesSlice, change)
	}
	return changesSlice
}

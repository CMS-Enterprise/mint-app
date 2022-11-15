package models

import (
	"encoding/json"
	"time"

	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// AnalyzedModelChange represents a analyzed_model_change to a table row in the database
type AnalyzedModelChange struct {
	baseStruct
	modelPlanRelation
	Date    time.Time   `json:"date" db:"date"`
	Changes interface{} `json:"changes" db:"changes"`
}

type Change struct {
	Model    string
	Field    string
	Action   string
	OldValue string
	NewValue string
}

func NewAnalyzedModelChange(createdBy string, modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) (*AnalyzedModelChange, error) {
	changes, err := json.Marshal(GenerateChanges(modelPlanID, date, store, logger))

	if err != nil {
		return nil, err
	}

	return &AnalyzedModelChange{
		Date:              date,
		Changes:           changes,
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}, nil
}

func GenerateChanges(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) []Change {
	modelPlanChanges := AnalyzeModelPlanChanges(modelPlanID, date, store, logger)
	crTdlChanges := AnalyzeCrTdlChanges(modelPlanID, date, store, logger)
	collaboratorChanges := AnalyzeCollaboratorChanges(modelPlanID, date, store, logger)
}

func AnalyzeModelPlanChanges(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) []Change {
	var changes []Change
	nameChanges := store.AuditChangeCollectionByIDAndTableAndFieldAndDate(logger, "model_plan", modelPlanID, "model_name", date, SortDesc)
	statusChanges := store.AuditChangeCollectionByIDAndTableAndFieldAndDate(logger, "model_plan", modelPlanID, "status", date, SortDesc)

	for i := 0; i < len(nameChanges); i++ {
		change := Change{
			Model:    "model_plan",
			Field:    "model_name",
			Action:   "update",
			OldValue: nameChanges[i].Fields.Old,
			NewValue: nameChanges[i].Fields.New,
		}
		changes = append(changes, change)
	}

	for i := 0; i < len(statusChanges); i++ {
		change := Change{
			Model:    "model_plan",
			Field:    "status",
			Action:   "update",
			OldValue: statusChanges[i].Fields.Old,
			NewValue: statusChanges[i].Fields.New,
		}
		changes = append(changes, change)
	}

	return changes
}

func AnalyzeCrTdlChanges(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) []Change {
	var changes []Change
	crTdlChanges := store.PlanCrTdlsGetByModelPlanIDAndDate(logger, modelPlanID, date)

	if len(crTdlChanges) > 0 {
		change := Change{
			Model:    "plan_cr_tdls",
			Field:    "",
			Action:   "update",
			OldValue: "",
			NewValue: "",
		}
		changes = append(changes, change)
	}

	return changes
}

func AnalyzeCollaboratorChanges(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) []Change {
	var changes []Change
	collaboratorChanges := store.PlanCollaboratorsByModelPlanIDAndDate(logger, modelPlanID, date)

	for i := 0; i < len(collaboratorChanges); i++ {
		change := Change{
			Model:    "plan_collaborator",
			Field:    "name",
			Action:   "create",
			OldValue: "",
			NewValue: collaboratorChanges[i].FullName,
		}
		changes = append(changes, change)
	}

	return changes
}

func AnalyzeDiscussionChanges(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) []Change {

}

func AnalyzeModelPlanSectionChanges(modelPlanID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) []Change {

}

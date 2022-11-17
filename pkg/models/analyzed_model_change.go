package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// AnalyzedModelChange represents a analyzed_model_change to a table row in the database
type AnalyzedModelChange struct {
	baseStruct
	modelPlanRelation
	Date    time.Time   `json:"date" db:"date"`
	Changes interface{} `json:"changes" db:"changes"`
}

type Change struct {
	Table    string
	Field    string
	Action   string
	OldValue string
	NewValue string
}

func NewAnalyzedModelChange(createdBy string, modelPlanID uuid.UUID, date time.Time, changes []Change) (*AnalyzedModelChange, error) {
	changesJson, err := json.Marshal(changes)

	if err != nil {
		return nil, err
	}

	return &AnalyzedModelChange{
		Date:              date,
		Changes:           changesJson,
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}, nil
}

package models

import (
	"time"
)

// AnalyzedModelChange represents a analyzed_model_change to a table row in the database
type AnalyzedModelChange struct {
	baseStruct
	modelPlanRelation
	Date    time.Time   `json:"date" db:"date"`
	Changes interface{} `json:"changes" db:"changes"`
}

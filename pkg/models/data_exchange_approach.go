package models

import (
	"github.com/google/uuid"
)

// DataExchangeApproach represents the data exchange approach of a model plan
type DataExchangeApproach struct {
	baseStruct
	modelPlanRelation
	Name        string  `json:"name" db:"name"`
	Description *string `json:"description" db:"description"`
	IsComplete  bool    `json:"isComplete" db:"is_complete"`
}

// NewDataExchangeApproach creates a new DataExchangeApproach with the required fields
func NewDataExchangeApproach(name string, createdBy uuid.UUID, modelPlanID uuid.UUID) *DataExchangeApproach {
	return &DataExchangeApproach{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		Name:              name,
		IsComplete:        false,
	}
}

package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// TODO: Should this be DataExchange? DataExchangeConcept? How do we want to identify this model?

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

// Value allows us to satisfy the valuer interface, so we can write to the database
func (d DataExchangeApproach) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface, so we can translate the JSONb from the db to an object in GO
func (d *DataExchangeApproach) Scan(src interface{}) error {
	return GenericScan(src, d)
}

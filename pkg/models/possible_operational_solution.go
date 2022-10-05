package models

import (
	"time"
)

// PossibleOperationalSolution represents a possible solution to an Operational Need
type PossibleOperationalSolution struct {
	// baseStruct //TODO, should we change this to UUID so we can use base struct?
	ID          int        `json:"id" db:"id"`
	CreatedBy   string     `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`

	FullName  string `json:"FullName" db:"full_name"`
	ShortName string `json:"ShortName" db:"short_name"`
}

// // NewPossibleOperationalSolution creates a Operation Solution with the required fields
// func NewPossibleOperationalSolution(createdBy string, operationalNeedID uuid.UUID) *PossibleOperationalSolution {

// 	return &PossibleOperationalSolution{
// 		baseStruct:        NewBaseStruct(createdBy),
// 		OperationalNeedID: operationalNeedID, //TODO, should this be an embedded struct
// 	}
// }

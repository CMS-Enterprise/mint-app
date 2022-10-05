package models

import (
	"time"
)

// PossibleOperationalNeed represents the need of a model plan
type PossibleOperationalNeed struct {
	// baseStruct //TODO, should we change this to UUID so we can use base struct?
	ID          int        `json:"id" db:"id"`
	CreatedBy   string     `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`

	FullName  string `json:"FullName" db:"full_name"`
	ShortName string `json:"ShortName" db:"short_name"`
}

// // NewOperationalNeed creatd an Operational Need with the required fields
// func NewOperationalNeed(createdBy string, modelPlanID uuid.UUID) *OperationalNeed {

// 	return &OperationalNeed{
// 		baseStruct:        NewBaseStruct(createdBy),
// 		modelPlanRelation: NewModelPlanRelation(modelPlanID),
// 	}
// 	//TODO
// }

package models

import "github.com/google/uuid"

// OperationalNeed represents the need of a model plan
type OperationalNeed struct {
	baseStruct
	modelPlanRelation
	NeedType  int     `json:"needType" db:"need_type"`
	NeedOther *string `json:"needOther" db:"need_other"`
	Needed    bool    `json:"needed" db:"needed"`
}

// NewOperationalNeed creatd an Operational Need with the required fields
func NewOperationalNeed(createdBy string, modelPlanID uuid.UUID) *OperationalNeed {

	return &OperationalNeed{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
	//TODO
}

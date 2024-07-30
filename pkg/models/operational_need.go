package models

import "github.com/google/uuid"

// OperationalNeed represents the need of a model plan
type OperationalNeed struct {
	baseStruct
	modelPlanRelation
	NeedType *int                `json:"needType" db:"need_type"`
	Name     *string             `json:"name" db:"need_name"`  // From Possible Operational Need Table
	Key      *OperationalNeedKey `json:"key" db:"need_key"`    // From Possible Operational Need Table
	Section  *TaskListSection    `json:"section" db:"section"` // From Possible Operational Need Table

	NameOther *string `json:"nameOther" db:"name_other"`
	Needed    *bool   `json:"needed" db:"needed"` // Null means that it has not been answered
}

// NewOperationalNeed creates an Operational Need with the required fields
func NewOperationalNeed(createdBy uuid.UUID, modelPlanID uuid.UUID) *OperationalNeed {

	return &OperationalNeed{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}

// GetName returns either the type name from the Possible Operational Need Table if it is a defined type, or the other name if an other type.
// if both are nil, it returns an empty string
func (opN OperationalNeed) GetName() string {
	if opN.NeedType != nil {
		if opN.Name != nil {
			return *opN.Name
		}
	}
	if opN.NameOther != nil {
		return *opN.NameOther
	}
	return ""

}

// GetIsOther checks if this is a custom need, or a predefined possible operational need
func (opN OperationalNeed) GetIsOther() bool {
	return opN.NeedType == nil
}

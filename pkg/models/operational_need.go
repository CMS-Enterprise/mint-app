package models

import "github.com/google/uuid"

// OperationalNeed represents the need of a model plan
type OperationalNeed struct {
	BaseStruct
	modelPlanRelation
	NeedType *int                `json:"needType" db:"need_type"`
	Name     *string             `json:"name" db:"need_name"`  // From Possible Operational Need Table
	Key      *OperationalNeedKey `json:"key" db:"need_key"`    // From Possible Operational Need Table
	Section  *TaskListSection    `json:"section" db:"section"` // From Possible Operational Need Table

	NameOther *string `json:"nameOther" db:"name_other"`
	Needed    *bool   `json:"needed" db:"needed"` // Null means that it has not been answered
}

// NewOperationalNeed creatd an Operational Need with the required fields
func NewOperationalNeed(createdBy uuid.UUID, modelPlanID uuid.UUID) *OperationalNeed {

	return &OperationalNeed{
		BaseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}

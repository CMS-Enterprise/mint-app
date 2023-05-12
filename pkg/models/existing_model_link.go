package models

import (
	"github.com/google/uuid"
)

// ExistingModelLink represents a link between another current model, or an existing model from the existing model table.
type ExistingModelLink struct {
	ExistingModelID    *int       `json:"existingModelID" db:"existing_model_id"`
	CurrentModelPlanID *uuid.UUID `json:"currentModelPlanID" db:"current_model_plan_id"`

	baseStruct
	modelPlanRelation
}

// NewExistingModelLink instantiates a new Existing ModelLink
func NewExistingModelLink(createdBy uuid.UUID, modelPlanID uuid.UUID, existingModelID *int, currentModelPlanID *uuid.UUID) *ExistingModelLink {
	return &ExistingModelLink{
		modelPlanRelation:  NewModelPlanRelation(modelPlanID),
		baseStruct:         NewBaseStruct(createdBy),
		ExistingModelID:    existingModelID,
		CurrentModelPlanID: currentModelPlanID,
	}

}

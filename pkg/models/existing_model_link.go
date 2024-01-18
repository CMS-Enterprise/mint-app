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

// LinkedExistingModel is an interface which is used to return a Union type for graphql.
// Specifically, it allows us to return either a model plan or an existing model.
type LinkedExistingModel interface {
	isLinkedExistingModel()
}

// ExistingModelLinks is a wrapper for a collection of Existing Model Links
type ExistingModelLinks struct {
	Links []*ExistingModelLink
}

// Names converts a collection of ExistingModelLinks to an array of strings for the represented linked names
func (emls ExistingModelLinks) Names() []string {
	return []string{"hooray", "TODO:", "TEST DATA"}

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

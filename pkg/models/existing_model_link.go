package models

import (
	"github.com/google/uuid"
)

// ExistingModelLink represents a link between another current model, or an existing model from the existing model table.
type ExistingModelLink struct {
	ExistingModelID    *int                        `json:"existingModelID" db:"existing_model_id"`
	CurrentModelPlanID *uuid.UUID                  `json:"currentModelPlanID" db:"current_model_plan_id"`
	FieldName          ExisitingModelLinkFieldType `json:"fieldName" db:"field_name"`

	baseStruct
	modelPlanRelation
}

// ExisitingModelLinkFieldType is used to distinguish what part of the model plan this link refers to.
type ExisitingModelLinkFieldType string

const (
	// EMLFTGeneralCharacteristicsResemblesExistingModelWhich is used to denote the link is in reference to the ResemblesExistingModelWhich question on Plan_General_Characteristics
	EMLFTGeneralCharacteristicsResemblesExistingModelWhich ExisitingModelLinkFieldType = "GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH"
	// EMLFTGeneralCharacteristicsParticipationExistingModelWhich is used to denote the link is in refernce to the Participation in an existing model which question on Plan_Genereal_Characteristics
	EMLFTGeneralCharacteristicsParticipationExistingModelWhich ExisitingModelLinkFieldType = "GEN_CHAR_PARTICIPATION_EXISTING_MODEL_WHICH"
)

// LinkedExistingModel is an interface which is used to return a Union type for graphql.
// Specifically, it allows us to return either a model plan or an existing model.
type LinkedExistingModel interface {
	isLinkedExistingModel()
}

// ExistingModelLinks is a wrapper for a collection of Existing Model Links
type ExistingModelLinks struct {
	FieldName ExisitingModelLinkFieldType `json:"fieldName" db:"field_name"`
	Links     []*ExistingModelLink
	modelPlanRelation
}

func NewExistingModelLinks(modelPlanID uuid.UUID, fieldName ExisitingModelLinkFieldType, links []*ExistingModelLink) *ExistingModelLinks {
	return &ExistingModelLinks{
		Links:             links,
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		FieldName:         fieldName,
	}

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

package models

import "github.com/google/uuid"

// ModelFollowerUpdate represents a message sent by a model team to everyone following a model plan
type ModelFollowerUpdate struct {
	baseStruct
	modelPlanRelation

	Content string `json:"content" db:"content"`
}

// NewModelFollowerUpdate creates a new ModelFollowerUpdate
func NewModelFollowerUpdate(createdBy uuid.UUID, modelPlanID uuid.UUID, content string) *ModelFollowerUpdate {
	return &ModelFollowerUpdate{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		Content:           content,
	}
}

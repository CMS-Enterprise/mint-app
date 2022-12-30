package models

import "github.com/google/uuid"

// PlanFavorite represents a relation that shows a model plan has been favorited
type PlanFavorite struct {
	baseStruct
	modelPlanRelation
	UserID string `json:"userID" db:"user_id"`
}

// NewPlanFavorite returns a plan collaborator object
func NewPlanFavorite(createdBy string, modelPlanID uuid.UUID) PlanFavorite {
	return PlanFavorite{
		UserID:            createdBy,
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		baseStruct:        NewBaseStruct(createdBy),
	}
}

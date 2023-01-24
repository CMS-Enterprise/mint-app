package models

import "github.com/google/uuid"

// PlanFavorite represents a relation that shows a model plan has been favorited
type PlanFavorite struct {
	baseStructUserTable
	modelPlanRelation
	UserID uuid.UUID `json:"userID" db:"user_id"`
}

// NewPlanFavorite returns a plan collaborator object
func NewPlanFavorite(createdBy uuid.UUID, userID uuid.UUID, modelPlanID uuid.UUID) PlanFavorite {
	return PlanFavorite{
		UserID:              userID,
		modelPlanRelation:   NewModelPlanRelation(modelPlanID),
		baseStructUserTable: NewBaseStructUser(createdBy),
	}
}

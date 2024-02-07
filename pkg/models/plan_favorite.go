package models

import "github.com/google/uuid"

// PlanFavorite represents a relation that shows a model plan has been favorited
type PlanFavorite struct {
	BaseStruct
	modelPlanRelation
	userIDRelation
}

// NewPlanFavorite returns a plan collaborator object
func NewPlanFavorite(createdBy uuid.UUID, userID uuid.UUID, modelPlanID uuid.UUID) PlanFavorite {
	return PlanFavorite{
		userIDRelation:    NewUserIDRelation(userID),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		BaseStruct:        NewBaseStruct(createdBy),
	}
}

package models

import "github.com/google/uuid"

//ModelPlanFavorite represents a relation that shows a model plan has been favorited
type ModelPlanFavorite struct {
	BaseStruct
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
	UserID      string    `json:"userID" db:"user_id"`
}

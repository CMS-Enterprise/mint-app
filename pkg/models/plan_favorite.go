package models

//PlanFavorite represents a relation that shows a model plan has been favorited
type PlanFavorite struct {
	BaseStruct
	ModelPlanRelation
	UserID string `json:"userID" db:"user_id"`
}

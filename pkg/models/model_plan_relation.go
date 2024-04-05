package models

import "github.com/google/uuid"

// IModelPlanRelation is an interface that represents models that are related to a model plan.
type IModelPlanRelation interface {
	GetModelPlanID() uuid.UUID
}

// ModelPlanRelation is a struct meant to be embedded to show that the object should have model plan relations enforced
type modelPlanRelation struct {
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
}

// NewModelPlanRelation returns a model plan relation object
func NewModelPlanRelation(modelPlanID uuid.UUID) modelPlanRelation {
	return modelPlanRelation{
		ModelPlanID: modelPlanID,
	}
}

// GetModelPlanID returns the modelPlanID of the task list section
func (m modelPlanRelation) GetModelPlanID() uuid.UUID {
	return m.ModelPlanID
}

// Future Enhancement: Consider adding a ModelPlan() method like we do for user accounts etc to return a ModelPlan for any relation.
// This would remove the need to implement it in the resolvers

package models

import "github.com/google/uuid"

//IModelPlanRelation is an interface that represents models that are related to a model plan.
type IModelPlanRelation interface {
	GetModelPlanID() uuid.UUID
}

//ModelPlanRelation is a struct meant to be embedded to show that the object should have model plan relations enforced
type ModelPlanRelation struct {
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
}

//GetModelPlanID returns the modelPlanID of the task list section
func (m ModelPlanRelation) GetModelPlanID() uuid.UUID {
	return m.ModelPlanID
}

//CheckAccess fulfills the check accessinterface
func (m ModelPlanRelation) CheckAccess() {

}

//ICheckAccess is an interface meant to demonstrate that this model should have an access check
type ICheckAccess interface {
	CheckAccess()
}

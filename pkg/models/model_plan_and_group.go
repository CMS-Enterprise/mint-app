package models

type ModelPlanAndGroup struct {
	modelPlanRelation
	ComponentGroup ComponentGroup `json:"componentGroup" db:"component_group"`
}

package models

import "github.com/google/uuid"

type ModelPlanAndGroup struct {
	ModelPlanID    uuid.UUID      `json:"modelPlanId" db:"model_plan_id"`
	ComponentGroup ComponentGroup `json:"componentGroup" db:"component_group"`
}

package models

import "github.com/google/uuid"

type MTOCommonSolutionModelUsage struct {
	baseStruct
	Key         MTOCommonSolutionKey `json:"key" db:"mto_common_solution_key"`
	ModelName   string               `json:"modelName" db:"model_name"`
	ModelStatus ModelStatus          `json:"status" db:"status"`
	ModelPlanID uuid.UUID            `json:"modelPlanId" db:"model_plan_id"`
}

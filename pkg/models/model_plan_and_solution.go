package models

import (
	"github.com/google/uuid"
)

type GeneralStatus string

const (
	MbSSPlanned GeneralStatus = "PLANNED"
	MbSSActive  GeneralStatus = "ACTIVE"
	MbSSEnded   GeneralStatus = "ENDED"
	MbSSOther   GeneralStatus = "OTHER"
)

type ModelPlanAndMTOCommonSolution struct {
	ModelPlanID uuid.UUID            `json:"modelPlanId" db:"model_plan_id"`
	ModelName   string               `json:"modelName" db:"model_name"`
	ModelStatus ModelStatus          `json:"modelStatus" db:"model_status"`
	ModelID     *string              `json:"modelId" db:"model_id"`
	Key         MTOCommonSolutionKey `json:"key" db:"mto_common_solution_key"`
}

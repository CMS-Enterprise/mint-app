package models

import "github.com/google/uuid"

type ModelPlanAndGroup struct {
	ModelPlanID    uuid.UUID      `json:"modelPlanId" db:"model_plan_id"`
	ComponentGroup ComponentGroup `json:"componentGroup" db:"component_group"`
}

type ModelByGroupStatus string

const (
	MbGSSPlanned ModelByGroupStatus = "PLANNED"
	MbGSActive   ModelByGroupStatus = "ACTIVE"
	MbGSEnded    ModelByGroupStatus = "ENDED"
	MbGSOther    ModelByGroupStatus = "OTHER"
)

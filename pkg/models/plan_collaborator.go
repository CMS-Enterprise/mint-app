package models

import (
	"github.com/google/uuid"
)

// PlanCollaborator represents a plan collaborator
type PlanCollaborator struct {
	BaseStruct
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
	EUAUserID   string    `json:"euaUserId" db:"eua_user_id"`
	FullName    string    `json:"fullName" db:"full_name"`
	TeamRole    TeamRole  `json:"teamRole" db:"team_role"`
}

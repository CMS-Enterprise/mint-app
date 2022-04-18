package models

import (
	// "errors"
	"time"

	"github.com/google/uuid"
)

type PlanCollaborator struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	ModelPlanID uuid.UUID  `json:"modelPlanID" db:"model_plan_id"`
	EUAUserID   string     `json:"euaUserId" db:"eua_user_id"`
	FullName    string     `json:"fullName" db:"full_name"`
	Component   CMSCenter  `json:"component" db:"component"`
	TeamRole    TeamRole   `json:"teamRole" db:"team_role"`
	CreatedBy   *string    `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}

package models

import (
	// "errors"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

type PlanCollaborator struct {
	ID          uuid.UUID   `json:"id" db:"id"`
	ModelPlanID uuid.UUID   `json:"modelPlanID" db:"model_plan_id"`
	EUAUserID   null.String `json:"euaUserId" db:"eua_user_id"`
	FullName    null.String `json:"fullName" db:"full_name"`
	Component   null.String `json:"component" db:"component"`
	TeamRole    null.String `json:"teamRole" db:"team_role"`

	CreatedBy   null.String `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  null.String `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time  `json:"modifiedDts" db:"modified_dts"`
}

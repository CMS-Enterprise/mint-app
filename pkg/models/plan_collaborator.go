package models

import (
	"time"

	"github.com/google/uuid"
)

// PlanCollaborator represents a plan collaborator
type PlanCollaborator struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	ModelPlanID uuid.UUID  `json:"modelPlanID" db:"model_plan_id"`
	EUAUserID   string     `json:"euaUserId" db:"eua_user_id"`
	FullName    string     `json:"fullName" db:"full_name"`
	CMSCenter   CMSCenter  `json:"cmsCenter" db:"cms_center"`
	TeamRole    TeamRole   `json:"teamRole" db:"team_role"`
	CreatedBy   *string    `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}

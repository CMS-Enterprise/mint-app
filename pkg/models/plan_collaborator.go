package models

import "github.com/google/uuid"

// PlanCollaborator represents a plan collaborator
type PlanCollaborator struct {
	baseStruct
	modelPlanRelation
	EUAUserID string   `json:"euaUserId" db:"eua_user_id"`
	FullName  string   `json:"fullName" db:"full_name"`
	TeamRole  TeamRole `json:"teamRole" db:"team_role"`
}

// NewPlanCollaborator returns a plan collaborator object
func NewPlanCollaborator(createdBy string, modelPlanID uuid.UUID) *PlanCollaborator {
	return &PlanCollaborator{
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		baseStruct:        NewBaseStruct(createdBy),
	}
}

// TeamRole represents the role of a team member
type TeamRole string

// These constants represent the different values of TeamRole
const (
	TeamRoleModelLead  TeamRole = "MODEL_LEAD"
	TeamRoleModelTeam  TeamRole = "MODEL_TEAM"
	TeamRoleLeadership TeamRole = "LEADERSHIP"
	TeamRoleLearning   TeamRole = "LEARNING"
	TeamRoleEvaluation TeamRole = "EVALUATION"
)

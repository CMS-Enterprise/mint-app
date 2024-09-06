package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
)

// PlanCollaborator represents a plan collaborator
// FullName and Email are stored as a result from the initial CEDAR query that's made when we create the collaborator
// This _could_ cause drift if either of these values change in CEDAR, but it's unlikely.
type PlanCollaborator struct {
	baseStruct
	modelPlanRelation
	userIDRelation
	TeamRoles pq.StringArray `json:"teamRoles" db:"team_roles"`
}

// NewPlanCollaborator returns a plan collaborator object
func NewPlanCollaborator(createdBy uuid.UUID, modelPlanID uuid.UUID, userID uuid.UUID, teamRoles []TeamRole) *PlanCollaborator {
	return &PlanCollaborator{
		userIDRelation:    NewUserIDRelation(userID),
		TeamRoles:         ConvertEnumsToStringArray(teamRoles),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		baseStruct:        NewBaseStruct(createdBy),
	}
}

// TeamRole represents the role of a team member
type TeamRole string

// These constants represent the different values of TeamRole
const (
	TeamRoleModelLead         TeamRole = "MODEL_LEAD"
	TeamRoleModelTeam         TeamRole = "MODEL_TEAM"
	TeamRoleLeadership        TeamRole = "LEADERSHIP"
	TeamRoleLearning          TeamRole = "LEARNING"
	TeamRoleEvaluation        TeamRole = "EVALUATION"
	TeamRoleITLead            TeamRole = "IT_LEAD"
	TeamRoleQuality           TeamRole = "QUALITY"
	TeamRoleOACT              TeamRole = "OACT"
	TeamRolePayment           TeamRole = "PAYMENT"
	TeamRoleCMFFSCounterpart  TeamRole = "CM_FFS_COUNTERPART"
	TeamRoleCOR               TeamRole = "COR"
	TeamRoleSolutionArchitect TeamRole = "SOLUTION_ARCHITECT"
)

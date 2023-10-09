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
		// UserID:              userID,
		userIDRelation:    NewUserIDRelation(userID),
		TeamRoles:         ConvertTeamRolesToStringArray(teamRoles),
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
	TeamRoleITLead     TeamRole = "IT_LEAD"
	TeamRoleQuality    TeamRole = "QUALITY"
	TeamRoleOACT       TeamRole = "OACT"
	TeamRolePayment    TeamRole = "PAYMENT"
)

func ConvertStringArrayToTeamRoles(sa pq.StringArray) []TeamRole {
	roles := make([]TeamRole, len(sa))
	for i, s := range sa {
		roles[i] = TeamRole(s)
	}
	return roles
}

func ConvertTeamRolesToStringArray(roles []TeamRole) pq.StringArray {
	sa := make(pq.StringArray, len(roles))
	for i, r := range roles {
		sa[i] = string(r)
	}
	return sa
}

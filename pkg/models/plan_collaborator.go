package models

import (
	"github.com/google/uuid"
)

// PlanCollaborator represents a plan collaborator
// FullName and Email are stored as a result from the initial CEDAR query that's made when we create the collaborator
// This _could_ cause drift if either of these values change in CEDAR, but it's unlikely.
type PlanCollaborator struct {
	baseStruct
	modelPlanRelation
	userIDRelation
	TeamRole TeamRole `json:"teamRole" db:"team_role"`
}

// NewPlanCollaborator returns a plan collaborator object
func NewPlanCollaborator(createdBy uuid.UUID, modelPlanID uuid.UUID, userID uuid.UUID, teamRole TeamRole) *PlanCollaborator {
	return &PlanCollaborator{
		// UserID:              userID,
		userIDRelation:    NewUserIDRelation(userID),
		TeamRole:          teamRole,
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
)

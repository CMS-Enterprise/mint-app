package models

// PlanCollaborator represents a plan collaborator
// FullName and Email are stored as a result from the initial CEDAR query that's made when we create the collaborator
// This _could_ cause drift if either of these values change in CEDAR, but it's unlikely.
type PlanCollaborator struct {
	BaseStruct
	ModelPlanRelation
	EUAUserID string   `json:"euaUserId" db:"eua_user_id"`
	FullName  string   `json:"fullName" db:"full_name"`
	TeamRole  TeamRole `json:"teamRole" db:"team_role"`
	Email     string   `json:"email" db:"email"`
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

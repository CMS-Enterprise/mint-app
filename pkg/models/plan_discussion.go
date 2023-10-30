package models

import (
	"github.com/google/uuid"
)

// PlanDiscussion represents a discussion that a user has about a model plan
type PlanDiscussion struct {
	baseStruct
	modelPlanRelation
	Content             TaggedHTMLInput     `json:"content" db:"content"` // TODO: SW this needs to be named different, or be a different type, so we can show that we can handle this as a separate resolver
	UserRole            *DiscussionUserRole `json:"userRole" db:"user_role"`
	UserRoleDescription *string             `json:"userRoleDescription" db:"user_role_description"`
	IsAssessment        bool                `json:"isAssessment" db:"is_assessment"`
}

// NewPlanDiscussion returns a New PlanDiscussion with a status of UNANSWERED
func NewPlanDiscussion(
	principal uuid.UUID,
	isAssessment bool,
	modelPlanID uuid.UUID,
	content TaggedHTMLInput,
	userRole *DiscussionUserRole,
	userRoleDescription *string,
) *PlanDiscussion {
	return &PlanDiscussion{
		Content:             content,
		UserRole:            userRole,
		UserRoleDescription: userRoleDescription,
		IsAssessment:        isAssessment,
		modelPlanRelation:   NewModelPlanRelation(modelPlanID),
		baseStruct:          NewBaseStruct(principal),
	}
}

// DiscussionReply represents a comment that was made on the PlanDiscussion
type DiscussionReply struct {
	baseStruct
	discussionRelation
	Content             TaggedHTMLInput     `json:"content" db:"content"`
	UserRole            *DiscussionUserRole `json:"userRole" db:"user_role"`
	UserRoleDescription *string             `json:"userRoleDescription" db:"user_role_description"`
	IsAssessment        bool                `json:"isAssessment" db:"is_assessment"`
}

// NewDiscussionReply returns a new Discussion Reply
func NewDiscussionReply(
	principal uuid.UUID,
	isAssessment bool,
	discussionID uuid.UUID,
	content TaggedHTMLInput,
	userRole *DiscussionUserRole,
	userRoleDescription *string,
) *DiscussionReply {
	return &DiscussionReply{
		Content:             content,
		UserRole:            userRole,
		UserRoleDescription: userRoleDescription,
		IsAssessment:        isAssessment,
		discussionRelation:  NewDiscussionRelation(discussionID),
		baseStruct:          NewBaseStruct(principal),
	}
}

// DiscussionUserRole is an enum that represents the role of a user in a Discussion
type DiscussionUserRole string

// These constants represent the possible values of a DiscussionUserRole
const (
	DiscussionRoleCmsSystemServiceTeam             DiscussionUserRole = "CMS_SYSTEM_SERVICE_TEAM"
	DiscussionRoleItArchitect                      DiscussionUserRole = "IT_ARCHITECT"
	DiscussionRoleLeadership                       DiscussionUserRole = "LEADERSHIP"
	DiscussionRoleMedicareAdministrativeContractor DiscussionUserRole = "MEDICARE_ADMINISTRATIVE_CONTRACTOR"
	DiscussionRoleMintTeam                         DiscussionUserRole = "MINT_TEAM"
	DiscussionRoleModelItLead                      DiscussionUserRole = "MODEL_IT_LEAD"
	DiscussionRoleModelTeam                        DiscussionUserRole = "MODEL_TEAM"
	DiscussionRoleSharedSystemMaintainer           DiscussionUserRole = "SHARED_SYSTEM_MAINTAINER"
	DiscussionRoleNoneOfTheAbove                   DiscussionUserRole = "NONE_OF_THE_ABOVE"
)

// DiscussionRoleSelection represents a user's selection of a DiscussionUserRole and optionally a description of their role
type DiscussionRoleSelection struct {
	UserRole            DiscussionUserRole `json:"userRole" db:"user_role"`
	UserRoleDescription *string            `json:"userRoleDescription" db:"user_role_description"`
}

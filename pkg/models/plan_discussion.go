package models

import (
	"github.com/google/uuid"
)

// PlanDiscussion represents a discussion that a user has about a model plan
type PlanDiscussion struct {
	baseStruct
	modelPlanRelation
	Content      string             `json:"content" db:"content"`
	Role         DiscussionUserRole `json:"role" db:"role"`
	Status       DiscussionStatus   `json:"status" db:"status"`
	IsAssessment bool               `json:"isAssessment" db:"is_assessment"`
}

// NewPlanDiscussion returns a New PlanDiscussion with a status of UNANSWERED
func NewPlanDiscussion(principal uuid.UUID, isAssessment bool, modelPlanID uuid.UUID, content string) *PlanDiscussion {
	return &PlanDiscussion{
		Content:           content,
		Status:            DiscussionUnAnswered,
		IsAssessment:      isAssessment,
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		baseStruct:        NewBaseStruct(principal),
	}
}

// DiscussionReply represents a comment that was made on the PlanDiscussion
type DiscussionReply struct {
	baseStruct
	discussionRelation
	Content      string `json:"content" db:"content"`
	Resolution   bool   `json:"resolution" db:"resolution"` //default to false
	IsAssessment bool   `json:"isAssessment" db:"is_assessment"`
}

// NewDiscussionReply returns a new Discussion Reply
func NewDiscussionReply(principal uuid.UUID, isAssessment bool, discussionID uuid.UUID, content string, resolution bool) *DiscussionReply {
	return &DiscussionReply{
		Content:            content,
		Resolution:         resolution,
		IsAssessment:       isAssessment,
		discussionRelation: NewDiscussionRelation(discussionID),
		baseStruct:         NewBaseStruct(principal),
	}
}

// DiscussionStatus is an enum that represents the status of a Discussion
type DiscussionStatus string

// These constants represent the possible values of a DiscussionStatus
const (
	DiscussionAnswered   DiscussionStatus = "ANSWERED"
	DiscussionWaiting    DiscussionStatus = "WAITING_FOR_RESPONSE"
	DiscussionUnAnswered DiscussionStatus = "UNANSWERED"
)

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

package models

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

// PlanDiscussion represents a discussion that a user has about a model plan
type PlanDiscussion struct {
	baseStruct
	modelPlanRelation
	Content      string           `json:"content" db:"content"`
	Status       DiscussionStatus `json:"status" db:"status"`
	IsAssessment bool             `json:"isAssessment" db:"is_assessment"`
}

// NewPlanDiscussion returns a New PlanDiscussion with a status of UNANSWERED
func NewPlanDiscussion(principal authentication.Principal, modelPlanID uuid.UUID, content string) *PlanDiscussion {
	return &PlanDiscussion{
		Content:           content,
		Status:            DiscussionUnAnswered,
		IsAssessment:      principal.AllowASSESSMENT(),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		baseStruct:        NewBaseStruct(principal.ID()),
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
func NewDiscussionReply(principal authentication.Principal, discussionID uuid.UUID, content string, resolution bool) *DiscussionReply {
	return &DiscussionReply{
		Content:            content,
		Resolution:         resolution,
		IsAssessment:       principal.AllowASSESSMENT(),
		discussionRelation: NewDiscussionRelation(discussionID),
		baseStruct:         NewBaseStruct(principal.ID()),
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

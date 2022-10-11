package models

import "github.com/google/uuid"

// PlanDiscussion represents a discussion that a user has about a model plan
type PlanDiscussion struct {
	baseStruct
	modelPlanRelation
	Content string           `json:"content" db:"content"`
	Status  DiscussionStatus `json:"status" db:"status"`
}

// NewPlanDiscussion returns a New PlanDiscussion with a status of UNANSWERED
func NewPlanDiscussion(createdBy string, modelPlanID uuid.UUID, content string) *PlanDiscussion {
	return &PlanDiscussion{
		Content:           content,
		Status:            DiscussionUnAnswered,
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		baseStruct:        NewBaseStruct(createdBy),
	}
}

// DiscussionReply represents a comment that was made on the PlanDiscussion
type DiscussionReply struct {
	baseStruct
	discussionRelation
	Content    string `json:"content" db:"content"`
	Resolution bool   `json:"resolution" db:"resolution"` //default to false
}

// NewDiscussionReply returns a new Discussion Reply
func NewDiscussionReply(createdBy string, discussionID uuid.UUID, content string, resolution bool) *DiscussionReply {
	return &DiscussionReply{
		Content:            content,
		Resolution:         resolution,
		discussionRelation: NewDiscussionRelation(discussionID),
		baseStruct:         NewBaseStruct(createdBy),
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

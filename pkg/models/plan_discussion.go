package models

import (
	"github.com/google/uuid"
)

//PlanDiscussion represents a discussion that a user has about a model plan
type PlanDiscussion struct {
	BaseStruct
	ModelPlanID uuid.UUID        `json:"modelPlanID" db:"model_plan_id"`
	Content     string           `json:"content" db:"content"`
	Status      DiscussionStatus `json:"status" db:"status"`
}

//DiscussionReply represents a comment that was made on the PlanDiscussion
type DiscussionReply struct {
	BaseStruct
	DiscussionID uuid.UUID `json:"discussionID" db:"discussion_id"`
	Content      string    `json:"content" db:"content"`
	Resolution   bool      `json:"resolution" db:"resolution"` //default to false
}

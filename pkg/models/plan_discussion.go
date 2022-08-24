package models

import (
	"github.com/google/uuid"
)

//PlanDiscussion represents a discussion that a user has about a model plan
type PlanDiscussion struct {
	BaseStruct
	ModelPlanRelation
	Content string           `json:"content" db:"content"`
	Status  DiscussionStatus `json:"status" db:"status"`
}

//DiscussionReply represents a comment that was made on the PlanDiscussion
type DiscussionReply struct {
	BaseStruct
	DiscussionRelation
	// DiscussionID uuid.UUID `json:"discussionID" db:"discussion_id"`
	Content    string `json:"content" db:"content"`
	Resolution bool   `json:"resolution" db:"resolution"` //default to false
}

//DiscussionStatus is an enum that represents the status of a Discussion
type DiscussionStatus string

//These constants represent the possible values of a DiscussionStatus
const (
	DiscussionAnswered   DiscussionStatus = "ANSWERED"
	DiscussionWaiting    DiscussionStatus = "WAITING_FOR_RESPONSE"
	DiscussionUnAnswered DiscussionStatus = "UNANSWERED"
)

//IDiscussionRelation is an interface that represents models that are related to a discussion.
type IDiscussionRelation interface {
	GetDiscussionID() uuid.UUID
}

//DiscussionRelation is an embedded struct meant to satisify the IDiscussionRelation interface
type DiscussionRelation struct {
	DiscussionID uuid.UUID `json:"discussionID" db:"discussion_id"`
}

//GetDiscussionID returns DiscussionID
func (d DiscussionRelation) GetDiscussionID() uuid.UUID {
	return d.DiscussionID
}

package models

// PlanDiscussion represents a discussion that a user has about a model plan
type PlanDiscussion struct {
	BaseStruct
	ModelPlanRelation
	Content string           `json:"content" db:"content"`
	Status  DiscussionStatus `json:"status" db:"status"`
}

// DiscussionReply represents a comment that was made on the PlanDiscussion
type DiscussionReply struct {
	BaseStruct
	DiscussionRelation
	// DiscussionID uuid.UUID `json:"discussionID" db:"discussion_id"`
	Content    string `json:"content" db:"content"`
	Resolution bool   `json:"resolution" db:"resolution"` //default to false
}

// DiscussionStatus is an enum that represents the status of a Discussion
type DiscussionStatus string

// These constants represent the possible values of a DiscussionStatus
const (
	DiscussionAnswered   DiscussionStatus = "ANSWERED"
	DiscussionWaiting    DiscussionStatus = "WAITING_FOR_RESPONSE"
	DiscussionUnAnswered DiscussionStatus = "UNANSWERED"
)

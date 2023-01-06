package models

import (
	"github.com/google/uuid"
)

// PlanDiscussion represents a discussion that a user has about a model plan
type PlanDiscussion struct {
	baseStruct
	modelPlanRelation
	Content            string           `json:"content" db:"content"`
	Status             DiscussionStatus `json:"status" db:"status"`
	IsAssessment       bool             `json:"isAssessment" db:"is_assessment"`
	CreatedByUserInfo  UserInfo         `json:"createdByUserInfo" db:"created_by_user_info"`
	ModifiedByUserInfo *UserInfo        `json:"modifiedByUserInfo" db:"modified_by_user_info"`
}

// NewPlanDiscussion returns a New PlanDiscussion with a status of UNANSWERED
func NewPlanDiscussion(
	principal string,
	isAssessment bool,
	modelPlanID uuid.UUID,
	content string,
	createdByUserInfo UserInfo,
	modifiedByUserInfo *UserInfo,
) *PlanDiscussion {
	return &PlanDiscussion{
		Content:            content,
		Status:             DiscussionUnAnswered,
		IsAssessment:       isAssessment,
		CreatedByUserInfo:  createdByUserInfo,
		ModifiedByUserInfo: modifiedByUserInfo,
		modelPlanRelation:  NewModelPlanRelation(modelPlanID),
		baseStruct:         NewBaseStruct(principal),
	}
}

// DiscussionReply represents a comment that was made on the PlanDiscussion
type DiscussionReply struct {
	baseStruct
	discussionRelation
	Content            string    `json:"content" db:"content"`
	Resolution         bool      `json:"resolution" db:"resolution"` //default to false
	IsAssessment       bool      `json:"isAssessment" db:"is_assessment"`
	CreatedByUserInfo  UserInfo  `json:"createdByUserInfo" db:"created_by_user_info"`
	ModifiedByUserInfo *UserInfo `json:"modifiedByUserInfo" db:"modified_by_user_info"`
}

// NewDiscussionReply returns a new Discussion Reply
func NewDiscussionReply(
	principal string,
	isAssessment bool,
	discussionID uuid.UUID,
	content string,
	resolution bool,
	createdByUserInfo UserInfo,
	modifiedByUserInfo *UserInfo,
) *DiscussionReply {
	return &DiscussionReply{
		Content:            content,
		Resolution:         resolution,
		IsAssessment:       isAssessment,
		CreatedByUserInfo:  createdByUserInfo,
		ModifiedByUserInfo: modifiedByUserInfo,
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

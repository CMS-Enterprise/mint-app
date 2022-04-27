package models

import (
	"time"

	"github.com/google/uuid"
)

//PlanDiscussion represents a discussion that a user has about a model plan
type PlanDiscussion struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	Content string `json:"content" db:"content"`

	CreatedBy   string    `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time `json:"createdDts" db:"created_dts"`
	ModifiedBy  string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts time.Time `json:"modifiedDts" db:"modified_dts"`

	Status DiscussionStatus `json:"status" db:"status"`
}

//DiscussionReply represents a comment that was made on the PlanDiscussion
type DiscussionReply struct {
	ID           uuid.UUID `json:"id" db:"id"`
	DiscussionID uuid.UUID `json:"discussionID" db:"discussion_id"`
	Content      string    `json:"content" db:"content"`
	Resolution   bool      `json:"resolution" db:"resolution"` //default to false

	CreatedBy   string    `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time `json:"createdDts" db:"created_dts"`
	ModifiedBy  string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts time.Time `json:"modifiedDts" db:"modified_dts"`
}

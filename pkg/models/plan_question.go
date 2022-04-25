package models

import (
	"time"

	"github.com/google/uuid"
)

//PlanQuestion represents a question that a user has about a section on the plan
type PlanQuestion struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	Section TaskSection `json:"section" db:"section"`

	Page     int16   `json:"page" db:"page"`
	Question *string `json:"question" db:"question"`

	CreatedBy   *string    `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`

	Status QuestionStatus `json:"status" db:"status"`
}

//QuestionComment represents a comment that was made on the Plan Question
type QuestionComment struct {
	ID         uuid.UUID `json:"id" db:"id"`
	ThreadID   uuid.UUID `json:"threadID" db:"thread_id"`
	Comment    *string   `json:"comment" db:"comment"`
	Resolution bool      `json:"resolution" db:"resolution"` //default to false

	CreatedBy   *string    `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}

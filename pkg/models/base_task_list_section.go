package models

import (
	"time"

	"github.com/google/uuid"
)

// IBaseTaskListSection returns the embedded BaseTaskListSection
type IBaseTaskListSection interface {
	Get() BaseTaskListSection
}

// BaseTaskListSection represents all the shared fields in common to a task list section
type BaseTaskListSection struct {
	BaseModel
	ModelPlanID       uuid.UUID  `json:"modelPlanID" db:"model_plan_id"`
	ReadyForReviewBy  *string    `json:"readyForReviewBy" db:"ready_for_review_by"`
	ReadyForReviewDts *time.Time `json:"readyForReviewDts" db:"ready_for_review_dts"`
	Status            TaskStatus `json:"status" db:"status"`
	oldStatus         TaskStatus `db:"status"`
}

//SetOldStatus sets oldStatus to the value of Status
func (b *BaseTaskListSection) SetOldStatus() {
	b.oldStatus = b.Status
}

// NewBaseTaskListSection makes a task list section by a modelPlanID and euaid
func NewBaseTaskListSection(modelPlanID uuid.UUID, euaid string) BaseTaskListSection {

	return BaseTaskListSection{
		ModelPlanID: modelPlanID,
		BaseModel: BaseModel{
			CreatedBy: euaid,
		},
	}

}

// CalcStatus updates the TaskStatus if it is in ready, but it has been modified.
func (b *BaseTaskListSection) CalcStatus() error {

	switch b.Status {
	case TaskReady:
		if b.ModifiedBy != nil {
			b.Status = TaskInProgress
		}
	case TaskInProgress:
	case TaskComplete:
	case TaskReadyForReview:
		if b.oldStatus != TaskReadyForReview {
			now := time.Now()
			b.ReadyForReviewBy = b.ModifiedBy
			b.ReadyForReviewDts = &now
		}
	case "": //TODO think about restructuring this, do we just want to default to a status when made?
		if b.ModifiedBy != nil {
			b.Status = TaskInProgress
		} else {
			b.Status = TaskReady
		}
	default:
	}

	return nil
}

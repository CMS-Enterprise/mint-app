package models

import (
	"time"

	"github.com/google/uuid"
)

// IBaseTaskListSection returns the embedded BaseTaskListSection
type IBaseTaskListSection interface {
	GetBaseTaskListSection() *BaseTaskListSection
}

// BaseTaskListSection represents all the shared fields in common to a task list section
type BaseTaskListSection struct {
	BaseModel
	ModelPlanID       uuid.UUID  `json:"modelPlanID" db:"model_plan_id"`
	ReadyForReviewBy  *string    `json:"readyForReviewBy" db:"ready_for_review_by"`
	ReadyForReviewDts *time.Time `json:"readyForReviewDts" db:"ready_for_review_dts"`
	Status            TaskStatus `json:"status" db:"status"`
}

// NewBaseTaskListSection makes a task list section by a modelPlanID and euaid
func NewBaseTaskListSection(modelPlanID uuid.UUID, euaid string) BaseTaskListSection {

	return BaseTaskListSection{
		ModelPlanID: modelPlanID,
		Status:      TaskReady,
		BaseModel: BaseModel{
			CreatedBy: euaid,
		},
	}

}

//GetBaseTaskListSection returns the BaseTaskListSection Object embedded in the struct
func (b *BaseTaskListSection) GetBaseTaskListSection() *BaseTaskListSection {
	return b
}

// CalcStatus updates the TaskStatus if it is in ready, but it has been modified.
func (b *BaseTaskListSection) CalcStatus(oldStatus TaskStatus) error {

	switch b.Status {
	case TaskReady:
		if b.ModifiedBy != nil {
			b.Status = TaskInProgress
		}
	case TaskInProgress:
	case TaskComplete:
	case TaskReadyForReview:
		if oldStatus != TaskReadyForReview {
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

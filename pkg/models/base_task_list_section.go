package models

import (
	"time"

	"github.com/google/uuid"
)

// IBaseTaskListSection returns the embedded BaseTaskListSection
type IBaseTaskListSection interface {
	GetBaseTaskListSection() *BaseTaskListSection
	CalcStatus(TaskStatus) error
	//methods from BaseStruct
	GetBaseStruct() *baseStruct
	GetID() uuid.UUID
	GetCreatedBy() string
	GetModifiedBy() *string
}

// BaseTaskListSection represents all the shared fields in common to a task list section
type BaseTaskListSection struct {
	baseStruct
	modelPlanRelation
	ReadyForReviewBy  *string    `json:"readyForReviewBy" db:"ready_for_review_by"`
	ReadyForReviewDts *time.Time `json:"readyForReviewDts" db:"ready_for_review_dts"`
	Status            TaskStatus `json:"status" db:"status"`
}

// NewBaseTaskListSection makes a task list section by a modelPlanID and euaid
func NewBaseTaskListSection(modelPlanID uuid.UUID, euaid string) BaseTaskListSection {

	return BaseTaskListSection{
		modelPlanRelation: NewModelPlanRelation(modelPlanID),

		Status:     TaskReady,
		baseStruct: NewBaseStruct(euaid),
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
	case TaskReadyForReview:
		if oldStatus != TaskReadyForReview {
			now := time.Now()
			b.ReadyForReviewBy = b.ModifiedBy
			b.ReadyForReviewDts = &now
		}
	case "": //If Task status was not initialized
		if b.ModifiedBy != nil {
			b.Status = TaskInProgress
		} else {
			b.Status = TaskReady
		}
	default:
	}

	return nil
}

//GetModelPlanID returns the modelPlanID of the task list section
func (b BaseTaskListSection) GetModelPlanID() uuid.UUID {
	return b.ModelPlanID
}

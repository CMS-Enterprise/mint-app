package models

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
)

// IBaseTaskListSection returns the embedded BaseTaskListSection
type IBaseTaskListSection interface {
	CalcStatus(TaskStatus) error
	//methods from BaseStruct
	GetID() uuid.UUID
	GetCreatedBy() string
	GetModifiedBy() *string
	SetModifiedBy(principal authentication.Principal) error
	GetStatus() TaskStatus
}

// baseTaskListSection represents all the shared fields in common to a task list section
type baseTaskListSection struct {
	baseStruct
	modelPlanRelation
	ReadyForReviewBy     *uuid.UUID `json:"readyForReviewBy" db:"ready_for_review_by"`
	ReadyForReviewDts    *time.Time `json:"readyForReviewDts" db:"ready_for_review_dts"`
	ReadyForClearanceBy  *uuid.UUID `json:"readyForClearanceBy" db:"ready_for_clearance_by"`
	ReadyForClearanceDts *time.Time `json:"readyForClearanceDts" db:"ready_for_clearance_dts"`
	Status               TaskStatus `json:"status" db:"status"`
}

// NewBaseTaskListSection makes a task list section by a modelPlanID and user id of the user creating it
func NewBaseTaskListSection(createdBy uuid.UUID, modelPlanID uuid.UUID) baseTaskListSection {

	return baseTaskListSection{
		modelPlanRelation: NewModelPlanRelation(modelPlanID),

		Status:     TaskReady,
		baseStruct: NewBaseStruct(createdBy),
	}

}

// GetStatus returns the status of a basesTaskListSection
func (b *baseTaskListSection) GetStatus() TaskStatus {
	return b.Status
}

// CalcStatus updates the TaskStatus if it is in ready, but it has been modified.
func (b *baseTaskListSection) CalcStatus(oldStatus TaskStatus) error {

	// If model is moved out of READY_FOR_CLEARANCE it should be set to IN_PROGRESS
	if oldStatus == TaskReadyForClearance && b.Status != TaskReadyForClearance {
		b.Status = TaskInProgress
		return nil
	}

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
	case TaskReadyForClearance:
		if oldStatus != TaskReadyForClearance {
			now := time.Now()
			b.ReadyForClearanceBy = b.ModifiedBy
			b.ReadyForClearanceDts = &now
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

// GetModelPlanID returns the modelPlanID of the task list section
func (b baseTaskListSection) GetModelPlanID() uuid.UUID {
	return b.ModelPlanID
}

// ReadyForClearanceByUserAccount returns the user account for user ID set for Ready for Clearance By
func (b *baseTaskListSection) ReadyForClearanceByUserAccount(ctx context.Context) *authentication.UserAccount {

	if b.ReadyForClearanceBy == nil {
		return nil
	}

	service := appcontext.UserAccountService(ctx)
	account, _ := service(ctx, *b.ReadyForClearanceBy)
	return account
}

// ReadyForReviewByUserAccount returns the user account for user ID set for Ready for Review By
func (b *baseTaskListSection) ReadyForReviewByUserAccount(ctx context.Context) *authentication.UserAccount {

	if b.ReadyForReviewBy == nil {
		return nil
	}

	service := appcontext.UserAccountService(ctx)
	account, _ := service(ctx, *b.ReadyForReviewBy)
	return account
}

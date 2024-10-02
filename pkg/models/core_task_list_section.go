package models

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

// ICoreTaskListSection returns the embedded CoreTaskListSection
type ICoreTaskListSection interface {
	GetID() uuid.UUID
	GetCreatedBy() string
	GetModifiedBy() *string
	SetModifiedBy(principal authentication.Principal) error
}

// coreTaskListSection represents the core fields in common to a task list section
type coreTaskListSection struct {
	baseStruct
	modelPlanRelation
}

// NewCoreTaskListSection creates a new coreTaskListSection with the required fields
func NewCoreTaskListSection(createdBy uuid.UUID, modelPlanID uuid.UUID) coreTaskListSection {
	return coreTaskListSection{
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		baseStruct:        NewBaseStruct(createdBy),
	}
}

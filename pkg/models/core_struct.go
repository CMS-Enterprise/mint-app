package models

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

// ICoreStruct is an interface that all core models must implement
type ICoreStruct interface {
	GetID() uuid.UUID
	GetCreatedBy() string
	GetModifiedBy() *string
	SetModifiedBy(principal authentication.Principal) error
}

// GetID returns the ID property for a CoreTaskListSection struct
func (c coreTaskListSection) GetID() uuid.UUID {
	return c.ID
}

// GetCreatedBy returns the CreatedBy property for a CoreTaskListSection struct
func (c coreTaskListSection) GetCreatedBy() string {
	return c.CreatedBy.String()
}

// GetModifiedBy returns the ModifiedBy property for a CoreTaskListSection struct
func (c coreTaskListSection) GetModifiedBy() *string {
	if c.ModifiedBy == nil {
		return nil
	}

	if *c.ModifiedBy == uuid.Nil {
		return nil
	}

	retString := c.ModifiedBy.String()
	return &retString
}

// SetModifiedBy sets the ModifiedBy property for a CoreTaskListSection struct
func (c *coreTaskListSection) SetModifiedBy(principal authentication.Principal) error {
	return c.baseStruct.SetModifiedBy(principal)
}

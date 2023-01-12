package models

import (
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

// baseStructUserTable represents the shared data in common betwen all models
type baseStructUserTable struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	CreatedBy   uuid.UUID  `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *uuid.UUID `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}

// NewBaseStructUser returns a base struct User object
func NewBaseStructUser(createdBy uuid.UUID) baseStructUserTable {
	return baseStructUserTable{
		CreatedBy: createdBy,
	}
}
func (b *baseStructUserTable) SetModifiedBy(principal authentication.Principal) error {

	userID := principal.Account().ID

	b.ModifiedBy = &userID
	return nil
}

// GetID returns the ID property for a PlanBasics struct
func (b baseStructUserTable) GetID() uuid.UUID {
	return b.ID
}

// GetModifiedBy returns the ModifiedBy property for an i base struct
func (b baseStructUserTable) GetModifiedBy() *string {

	if b.ModifiedBy == nil {
		return nil
	}

	if *b.ModifiedBy == uuid.Nil {
		return nil
	}

	retString := b.ModifiedBy.String()
	return &retString

}

// GetCreatedBy implements the CreatedBy property
func (b baseStructUserTable) GetCreatedBy() string {
	return b.CreatedBy.String()
}

package models

import (
	"slices"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

// IBaseStruct is an interface that all models must implement
type IBaseStruct interface {
	GetID() uuid.UUID
	GetCreatedBy() string
	GetModifiedBy() *string
	SetModifiedBy(principal authentication.Principal) error
	MostRecentModification() (time.Time, uuid.UUID)
}

// baseStruct represents the shared data in common betwen all models
type baseStruct struct {
	ID uuid.UUID `json:"id" db:"id"`
	createdByRelation
	modifiedByRelation
}

// NewBaseStruct returns a base struct object
func NewBaseStruct(createdBy uuid.UUID) baseStruct {
	return baseStruct{
		createdByRelation: createdByRelation{
			CreatedBy: createdBy,
		},
	}
}
func (b *baseStruct) SetModifiedBy(principal authentication.Principal) error {

	userID := principal.Account().ID

	b.ModifiedBy = &userID
	return nil
}

// GetID returns the ID property for a PlanBasics struct
func (b baseStruct) GetID() uuid.UUID {
	return b.ID
}

// GetModifiedBy returns the ModifiedBy property for an IBaseStruct
func (b baseStruct) GetModifiedBy() *string {

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
func (b baseStruct) GetCreatedBy() string {
	return b.CreatedBy.String()
}

func (b baseStruct) MostRecentModification() (time.Time, uuid.UUID) {
	if b.ModifiedDts != nil && b.ModifiedBy != nil {
		return *b.ModifiedDts, *b.ModifiedBy
	}
	return b.CreatedDts, b.CreatedBy
}

func GetMostRecentTime(baseStructs []IBaseStruct) (time.Time, uuid.UUID) {
	var timeToReturn time.Time //ZeroValue
	if len(baseStructs) < 1 {
		return timeToReturn, uuid.Nil
	}
	// Sort baseStructs based on a custom comparison function
	slices.SortStableFunc(baseStructs, func(item1, item2 IBaseStruct) int {
		// Directly call the MostRecentModification method on IBaseStruct
		time1, _ := item1.MostRecentModification()
		time2, _ := item2.MostRecentModification()

		// Return -1 if time1 is after time2 (more recent)
		// Return 1 if time2 is after time1
		// Return 0 if they are equal
		if time1.After(time2) {
			return -1
		} else if time2.After(time1) {
			return 1
		}
		return 0 // Default comparison if times are equal
	})

	return baseStructs[0].MostRecentModification()

}

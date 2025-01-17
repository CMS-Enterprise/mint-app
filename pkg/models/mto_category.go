package models

import (
	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/constants"
)

const UncategorizedMTOName = "Uncategorized"

type Positioner interface {
	GetPosition() int
}

type MTOCategory struct {
	baseStruct
	modelPlanRelation

	Name     string     `json:"name" db:"name"`
	Position int        `json:"position" db:"position"`
	ParentID *uuid.UUID `json:"parent_id" db:"parent_id"`
}

// MTOCategories is a struct meant to represent the Category and Subcategory associated with a given MTO Milestone.
// This struct exists to allow us to resolve/fetch both Category and Subcategory at the same time and return them together in a single resolver.
type MTOCategories struct {
	Category    *MTOCategory    `json:"category,omitempty"`
	SubCategory *MTOSubcategory `json:"subCategory,omitempty"`
}

func (m MTOCategory) GetPosition() int {
	return m.Position
}
func (m MTOSubcategory) GetPosition() int {
	return m.Position
}

// NewMTOCategory returns a new mtoCategory object. A Nil parentID means that this is a top level category, and not a subcategory
// Note, a new category automatically is added as the last in order. It can be re-ordered, but it can't be set from the start
// We set a position simply to allow manual manipulation of position for non db- entities (uncategorized categories)
func NewMTOCategory(createdBy uuid.UUID, name string, modelPlanID uuid.UUID, parentID *uuid.UUID, position int) *MTOCategory {
	return &MTOCategory{
		Name:              name,
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		ParentID:          parentID,
		Position:          position,
	}
}

// MTOUncategorizedFromArray takes an array of sibling categories to determine the next position that is relevant for the array.
// the new uncategorized result will now have the correct position
func MTOUncategorizedFromArray(modelPlanID uuid.UUID, parentID *uuid.UUID, categories []*MTOCategory) *MTOCategory {
	//Find the greatest position, and iterate it to create the new Uncategorized category with a position as well
	maxPosition := GetMaxPosition(categories)
	return MTOUncategorized(modelPlanID, parentID, maxPosition+1)

}

// GetMaxPosition will return the max position from an array of positioner types
func GetMaxPosition[T Positioner](positioners []T) int {
	if len(positioners) <= 0 {
		return 0
	}
	maxPosition := lo.MaxBy(positioners, func(a, b T) bool {
		return a.GetPosition() > b.GetPosition()
	}).GetPosition()
	return maxPosition
}

// MTOUncategorized returns a placeholder category to hold all milestones that aren't categorized into a subcategory
func MTOUncategorized(modelPlanID uuid.UUID, parentID *uuid.UUID, position int) *MTOCategory {
	return NewMTOCategory(constants.GetSystemAccountUUID(), UncategorizedMTOName, modelPlanID, parentID, position)
}
func MTOUncategorizedSubcategory(modelPlanID uuid.UUID, parentID *uuid.UUID, position int) *MTOSubcategory {
	category := NewMTOCategory(constants.GetSystemAccountUUID(), UncategorizedMTOName, modelPlanID, parentID, position)

	return category.ToSubcategory()
}
func MTOUncategorizedSubcategoryFromArray(modelPlanID uuid.UUID, parentID *uuid.UUID, subCategories []*MTOSubcategory) *MTOSubcategory {
	maxPosition := GetMaxPosition(subCategories)
	category := NewMTOCategory(constants.GetSystemAccountUUID(), UncategorizedMTOName, modelPlanID, parentID, maxPosition+1)

	return category.ToSubcategory()
}

// MTOSubcategory is the same as a MTOCategory in the database. It is separated here so we can be precise in graphql
type MTOSubcategory MTOCategory

func (m *MTOCategory) ToSubcategory() *MTOSubcategory {
	return (*MTOSubcategory)(m)
}

// IsUncategorized returns if a category is an actual category, or if it is a placeholder category that is not store in the database
func (m MTOCategory) IsUncategorized() bool {
	return m.ID == uuid.Nil
}

// IsUncategorized returns if a category is an actual subcategory, or if it is a placeholder subcategory that is not store in the database
func (m MTOSubcategory) IsUncategorized() bool {
	return m.ID == uuid.Nil
}

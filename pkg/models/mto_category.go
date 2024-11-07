package models

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/constants"
	"github.com/cms-enterprise/mint-app/pkg/helpers"
)

const unCategorizedMTOName = "Uncategorized"

type MTOCategory struct {
	baseStruct
	modelPlanRelation

	Name     string     `json:"name" db:"name"`
	Position int        `json:"position" db:"position"`
	ParentID *uuid.UUID `json:"parent_id" db:"parent_id"`
}

// NewMTOCategory returns a new mtoCategory object. A Nil parentID means that this is a top level category, and not a subcategory
// Note, a new category automatically is added as the last in order. It can be re-ordered, but it can't be set from the start
func NewMTOCategory(createdBy uuid.UUID, name string, modelPlanID uuid.UUID, parentID *uuid.UUID) *MTOCategory {
	return &MTOCategory{
		Name:              name,
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		ParentID:          parentID,
	}
}

// MTOUncategorized returns a placeholder category to hold all milestones that aren't categorized into a subcategory
func MTOUncategorized(modelPlanID uuid.UUID, parentID *uuid.UUID) *MTOCategory {
	return NewMTOCategory(constants.GetSystemAccountUUID(), unCategorizedMTOName, modelPlanID, parentID)
}
func MTOUncategorizedSubcategory(modelPlanID uuid.UUID, parentID *uuid.UUID) *MTOSubcategory {
	category := NewMTOCategory(constants.GetSystemAccountUUID(), unCategorizedMTOName, modelPlanID, parentID)
	helpers.PointerTo(category)

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

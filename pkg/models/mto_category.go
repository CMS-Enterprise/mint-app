package models

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/constants"
)

const unCategorizedMTOName = "Uncategorized"

type MTOCategory struct {
	baseStruct
	modelPlanRelation

	Name     string    `json:"name" db:"name"`
	ParentID uuid.UUID `json:"parent_id" db:"parent_id"`
}

func NewMTOCategory(createdBy uuid.UUID, name string, modelPlanID uuid.UUID) *MTOCategory {
	return &MTOCategory{
		Name:              name,
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}

// MTOUncategorized returns a placeholder category to hold all milestones that aren't categorized into a subcategory
func MTOUncategorized(modelPlanID uuid.UUID) *MTOCategory {
	return NewMTOCategory(constants.GetSystemAccountUUID(), unCategorizedMTOName, modelPlanID)
}

// MTOSubcategory is the same as a MTOCategory in the database. It is separated here so we can be precise in graphql
type MTOSubcategory MTOCategory

// IsUncategorized returns if a category is an actual category, or if it is a placeholder category that is not store in the database
func (m MTOCategory) IsUncategorized() bool {
	return m.ID == uuid.Nil
}

// IsUncategorized returns if a category is an actual subcategory, or if it is a placeholder subcategory that is not store in the database
func (m MTOSubcategory) IsUncategorized() bool {
	return m.ID == uuid.Nil
}
